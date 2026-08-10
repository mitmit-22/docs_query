import { PDFParse } from "pdf-parse";
import { eq } from "drizzle-orm";
import { db } from "../../../db/index.js";
import { documents, documentChunks } from "../../../db/schema.js";
import { chunkText } from "./chunking.service.js";
import { embedChunks } from "./embedding.service.js";

export async function uploadDocument(userId, file) {
  // Replace-on-upload: remove any existing document for this user first
  const [existing] = await db.select().from(documents).where(eq(documents.userId, userId));
  if (existing) {
    await db.delete(documentChunks).where(eq(documentChunks.documentId, existing.id));
    await db.delete(documents).where(eq(documents.id, existing.id));
  }

  // Extract text from the uploaded PDF buffer
  const parser = new PDFParse({ data: file.buffer });
const parsed = await parser.getText();
await parser.destroy();

  // Chunk and embed
  const chunks = chunkText(parsed.text);
  const embeddings = await embedChunks(chunks);

  // Insert the document record
  const [document] = await db
    .insert(documents)
    .values({ userId, filename: file.originalname })
    .returning();

  // Insert all chunk rows in one batch
  const chunkRows = chunks.map((content, i) => ({
    documentId: document.id,
    chunkIndex: i,
    content,
    embedding: embeddings[i],
  }));
  await db.insert(documentChunks).values(chunkRows);

  return { id: document.id, filename: document.filename, status: "processed" };
}

export async function getCurrentDocument(userId) {
  const [document] = await db.select().from(documents).where(eq(documents.userId, userId));
  return document || null;
}

export async function discardDocument(userId) {
  const [existing] = await db.select().from(documents).where(eq(documents.userId, userId));
  if (!existing) return false;

  await db.delete(documentChunks).where(eq(documentChunks.documentId, existing.id));
  await db.delete(documents).where(eq(documents.id, existing.id));
  return true;
}