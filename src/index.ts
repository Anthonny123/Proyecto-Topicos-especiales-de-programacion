import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import weatherRoutes from './routes/weather.routes';
import earthquakeRoutes from "./routes/earthquake.routes";

import { swaggerUi, specs } from "./swagger";



const app = express();

app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use('/api/weather', weatherRoutes);
app.use("/api/earthquake", earthquakeRoutes);


const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

connectDB()
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
  });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;