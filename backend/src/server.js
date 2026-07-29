import "dotenv/config";
import express from "express";
import authRoutes from "../src/features/auth/routes/auth.routes.js"


import cors from "cors";


const app = express()

app.use(cors())

app.use(express.json())
app.use("/api/auth",authRoutes);

const PORT = process.env.PORT;

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
});

