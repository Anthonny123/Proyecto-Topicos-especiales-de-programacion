import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import weatherRoutes from './routes/weather.routes';


const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/weather', weatherRoutes);


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