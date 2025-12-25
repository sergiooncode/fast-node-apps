import express from 'express';
import cors from 'cors';
import type { CreateTripInput, UpdateTripInput } from './types.js';
import { prisma } from './db.js';

const app = express();
const port = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello from Express API!' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/trips', async (req, res) => {
  try {
    const trips = await prisma.trip.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trips' });
  }
});

app.get('/trips/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid trip ID' });
    }

    const trip = await prisma.trip.findUnique({
      where: { id }
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    res.json(trip);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trip' });
  }
});

app.post('/trips', async (req, res) => {
  try {
    const input: CreateTripInput = req.body;

    if (!input.title || !input.dateStart || !input.dateFinish || !input.code) {
      return res.status(400).json({
        error: 'Missing required fields: title, dateStart, dateFinish, code'
      });
    }

    const trip = await prisma.trip.create({
      data: input
    });

    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create trip' });
  }
});

app.put('/trips/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid trip ID' });
    }

    const input: UpdateTripInput = req.body;

    const trip = await prisma.trip.update({
      where: { id },
      data: input
    });

    res.json(trip);
  } catch (error) {
    if ((error as any).code === 'P2025') {
      return res.status(404).json({ error: 'Trip not found' });
    }
    res.status(500).json({ error: 'Failed to update trip' });
  }
});

app.delete('/trips/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid trip ID' });
    }

    await prisma.trip.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    if ((error as any).code === 'P2025') {
      return res.status(404).json({ error: 'Trip not found' });
    }
    res.status(500).json({ error: 'Failed to delete trip' });
  }
});

app.listen(port, () => {
  console.log(`API server running on http://localhost:${port}`);
});
