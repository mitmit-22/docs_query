import redis from "../../../db/redis.js";
import { hashText } from "./hash.service.js";
import { cacheStats } from "./cacheStats.service.js";

const CACHE_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days
const VOYAGE_BATCH_SIZE = 100;

export async function embedChunks(chunks, inputType = "document") {
  const keys = chunks.map((c) => `embedding:${inputType}:${hashText(c)}`);
  const cached = await redis.mget(keys);

  const results = new Array(chunks.length);
  const missIndices = [];
  const missChunks = [];

  cached.forEach((val, i) => {
    if (val) {
      results[i] = JSON.parse(val);
      cacheStats.hits++;
    } else {
      missIndices.push(i);
      missChunks.push(chunks[i]);
      cacheStats.misses++;
    }
  });

  if (missChunks.length > 0) {
    const freshEmbeddings = await embedInBatches(missChunks, inputType);

    const pipeline = redis.pipeline();
    missIndices.forEach((originalIdx, j) => {
      results[originalIdx] = freshEmbeddings[j];
      pipeline.set(keys[originalIdx], JSON.stringify(freshEmbeddings[j]), "EX", CACHE_TTL_SECONDS);
    });
    await pipeline.exec();
  }

  return results;
}

async function embedInBatches(chunks, inputType) {
  const allEmbeddings = [];
  for (let i = 0; i < chunks.length; i += VOYAGE_BATCH_SIZE) {
    const batch = chunks.slice(i, i + VOYAGE_BATCH_SIZE);
    const batchEmbeddings = await fetchFromVoyage(batch, inputType);
    allEmbeddings.push(...batchEmbeddings);
  }
  return allEmbeddings;
}

async function fetchFromVoyage(chunks, inputType) {
  const response = await fetch("https://api.voyageai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.VOYAGE_API_KEY}`,
    },
    body: JSON.stringify({ input: chunks, model: "voyage-2", input_type: inputType }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Voyage embedding failed: ${errText}`);
  }

  const data = await response.json();
  return data.data.map((item) => item.embedding);
}