import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import auth from './middleware/auth.js';
import { AuthRequest } from './types/index.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const usersFilePath = path.join(__dirname, 'users.json');

app.use(cors());
app.use(express.json());

// Helper function to read users from the JSON file
const readUsers = () => {
  if (!fs.existsSync(usersFilePath)) {
    return [];
  }
  const usersData = fs.readFileSync(usersFilePath, 'utf-8');
  return JSON.parse(usersData);
};

// Helper function to write users to the JSON file
const writeUsers = (users: any) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

// Public routes
app.post('/api/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const users = readUsers();
  const user = users.find((u: any) => u.email === email);

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
    expiresIn: '1h',
  });
  res.json({ token });
});

// User management routes
app.post('/api/users', async (req: Request, res: Response) => {
  const { name, firstName, email, password } = req.body;
  const users = readUsers();

  if (users.find((u: any) => u.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { id: Date.now().toString(), name, firstName, email, password: hashedPassword };
  users.push(newUser);
  writeUsers(users);

  res.status(201).json(newUser);
});

app.put('/api/users/:id', auth, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { name, firstName, email, password } = req.body;
  const users = readUsers();
  const userIndex = users.findIndex((u: any) => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  const hashedPassword = password ? await bcrypt.hash(password, 10) : users[userIndex].password;
  users[userIndex] = { ...users[userIndex], name, firstName, email, password: hashedPassword };
  writeUsers(users);

  res.json(users[userIndex]);
});

app.delete('/api/users/:id', auth, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const users = readUsers();
  const userIndex = users.findIndex((u: any) => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  users.splice(userIndex, 1);
  writeUsers(users);

  res.status(204).send();
});

// Protected routes
app.get('/api/health', auth, (req: AuthRequest, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.get('/api/greeting', auth, (req: AuthRequest, res: Response) => {
  res.json({ message: 'Hello from the server!' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
