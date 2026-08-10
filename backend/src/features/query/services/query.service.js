import { eq } from "drizzle-orm";
import { db } from "../../../db/index.js";
import { documents } from "../../../db/schema.js";
import { embedChunks } from "../../documents/services/embedding.service.js";
import { retrieveTopChunks } from "./retrieval.service.js";
import { generateAnswer } from "./completion.service.js";

export async function answerQuestion(userId, question) {
  const [document] = await db.select().from(documents).where(eq(documents.userId, userId));
  if (!document) {
    const err = new Error("No document uploaded yet");
    err.status = 404;
    throw err;
  }

  const [questionEmbedding] = await embedChunks([question], "query");
  const chunks = await retrieveTopChunks(document.id, questionEmbedding);

  if (chunks.length === 0) {
    const err = new Error("No content found for this document");
    err.status = 404;
    throw err;
  }

  const answer = await generateAnswer(question, chunks);

  return {
    answer,
    sourceChunks: chunks.map((c) => ({ chunkIndex: c.chunk_index, excerpt: c.content.slice(0, 150) })),
  };
}