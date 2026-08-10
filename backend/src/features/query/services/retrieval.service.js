import { sql } from "drizzle-orm";
import { db } from "../../../db/index.js";
import { documentChunks } from "../../../db/schema.js";

export async function retrieveTopChunks(documentId, questionEmbedding, topK = 5) {
  const vectorString = `[${questionEmbedding.join(",")}]`;

  const results = await db.execute(sql`
    SELECT id, chunk_index, content
    FROM document_chunks
    WHERE document_id = ${documentId}
    ORDER BY embedding <=> ${vectorString}::vector
    LIMIT ${topK}
  `);

  return results;
}