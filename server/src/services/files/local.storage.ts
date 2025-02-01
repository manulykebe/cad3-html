import fs from 'fs/promises';
import path from 'path';
import { StorageProvider } from './storage.provider.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class LocalStorageProvider implements StorageProvider {
  private storagePath: string;

  constructor() {
    this.storagePath = path.join('../storage');
    this.initStorage();
  }

  private async initStorage() {
    try {
      await fs.access(this.storagePath);
    } catch {
      await fs.mkdir(this.storagePath, { recursive: true });
    }
  }

  private getFilePath(filename: string): string {
    return path.join(this.storagePath, filename);
  }

  async save(filename: string, content: string): Promise<void> {
    const filepath = this.getFilePath(filename);
    await fs.writeFile(filepath, content, 'utf-8');
  }

  async get(filename: string): Promise<string | null> {
    try {
      const filepath = this.getFilePath(filename);
      const content = await fs.readFile(filepath, 'utf-8');
      return content;
    } catch (error) {
      return null;
    }
  }

  async delete(filename: string): Promise<void> {
    const filepath = this.getFilePath(filename);
    await fs.unlink(filepath);
  }

  async list(): Promise<string[]> {
    const files = await fs.readdir(this.storagePath);
    return files;
  }

  async update(filename: string, content: string): Promise<void> {
    await this.save(filename, content);
  }
}