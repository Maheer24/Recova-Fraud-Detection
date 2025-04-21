import express from 'express';
import http from 'http';
import 'dotenv/config'
import mongoose from 'mongoose';
import app from './app.js';
import cors from 'cors';






const server = http.createServer(app);

app.use(cors({
    origin: "http://localhost:5173", // ✅ Set this to your frontend URL
    credentials: true,  // ✅ Allows cookies to be sent
  
}));

const portno = process.env.PORT || 3000;
server.listen(portno, () => {
    console.log(`Server is running on port ${portno}`);
})











