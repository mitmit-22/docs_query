import { integer } from "drizzle-orm/gel-core";
import { pgTable, uuid, varchar, timestamp} from "drizzle-orm/pg-core";
import { text, customType } from "drizzle-orm/pg-core";


export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// id userid as foreign key filename storageUrl createdat

export const documents = pgTable("documents",{
    id : uuid("id").primaryKey().defaultRandom(),
    filename : varchar("filename",{length:255}).notNull(),
    storageUrl : varchar("storage_url",{length:255}),
    createdAt : timestamp("created_at").defaultNow(),
    userId : uuid("user_id").references(()=>users.id).notNull() 
    

});




const vector = customType({
  dataType() {
    return "vector(1024)"; // 1024 = Voyage AI's embedding dimension
  },
  toDriver(value) {
    return `[${value.join(",")}]`;
  },
});

export const documentChunks = pgTable("document_chunks", {
  id: uuid("id").primaryKey().defaultRandom(),
  documentId: uuid("document_id").references(() => documents.id).notNull(),
  chunkIndex: integer("chunk_index").notNull(),
  content: text("content").notNull(),
  embedding: vector("embedding"),
  createdAt: timestamp("created_at").defaultNow(),
});