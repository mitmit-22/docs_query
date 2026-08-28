import "dotenv/config";
import express from "express";
import authRoutes from "../src/features/auth/routes/auth.routes.js"
import documentsRouter from "./features/documents/routes/documents.routes.js"
import queryRouter from "./features/query/routes/query.routes.js"
import redis from "../src/db/redis.js";


import cors from "cors";


const app = express()

app.use(cors())

app.use(express.json())
app.use("/api/auth",authRoutes);
app.use("/api/documents",documentsRouter);
app.use("/api/query",queryRouter);



const PORT = process.env.PORT;

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
});

