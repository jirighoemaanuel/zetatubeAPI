import dotenv from 'dotenv';
import express from 'express';
dotenv.config();

const port = 3000 || process.env.PORT;
const app = express();

const server = () => {
  app.listen(port, () => {
    console.log(`sever running on port:${port}`);
  });
};

server();
