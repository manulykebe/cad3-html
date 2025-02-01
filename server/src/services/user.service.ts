import bcrypt from 'bcryptjs';
import { FileStorageService } from './files/files.service.js';

interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  firstName: string;
  isAdmin: boolean;
}

export class UserService {
  private fileService: FileStorageService;
  private readonly USERS_FILE = 'users.json';

  constructor() {
    this.fileService = new FileStorageService();
  }

  private async readUsers(): Promise<User[]> {
    try {
      const data = await this.fileService.getFile(this.USERS_FILE);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      return [];
    }
  }

  private async writeUsers(users: User[]): Promise<void> {
    await this.fileService.saveFile(this.USERS_FILE, JSON.stringify(users, null, 2));
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.readUsers();
    return users.map(({ password, ...user }) => user);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const users = await this.readUsers();
    return users.find((u) => u.email === email);
  }

  async create(userData: Omit<User, 'id'>): Promise<Omit<User, 'password'>> {
    const users = await this.readUsers();

    if (users.some((u) => u.email === userData.email)) {
      throw new Error('User already exists');
    }

    const saltRounds = 10;
    const secretKey = process.env.JWT_SECRET_KEY;

    const hashedPassword = await bcrypt.hash(userData.password + secretKey, saltRounds);
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      password: hashedPassword,
    };

    await this.writeUsers([...users, newUser]);
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async update(
    id: string,
    userData: Partial<User>,
  ): Promise<Omit<User, 'password'> | null> {
    const users = await this.readUsers();
    const index = users.findIndex((u) => u.id === id);

    if (index === -1) return null;

    const updatedUser = {
      ...users[index],
      ...userData,
    };

    if (userData.password) {
      updatedUser.password = await bcrypt.hash(userData.password, 10);
    }

    users[index] = updatedUser;
    await this.writeUsers(users);

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async delete(id: string): Promise<void> {
    const users = await this.readUsers();
    const filteredUsers = users.filter((u) => u.id !== id);
    await this.writeUsers(filteredUsers);
  }
}