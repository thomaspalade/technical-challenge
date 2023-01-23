import express, { Request, Response } from 'express';
// Config
import { config } from 'dotenv';
config();

// Middlewares
const app = express();

const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
  res.send('Get endpoint works');
});

app.listen(port, () => {
  console.log('[server]: Server is running at port = ' + port);
})