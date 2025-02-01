import { StorageProvider } from './storage.provider.js';
import { LocalStorageProvider } from './local.storage.js';
import { S3StorageProvider } from './s3.storage.js';

export class FileStorageService {
  private provider: StorageProvider;

  constructor() {
    this.provider = process.env.NODE_ENV === 'production'
      ? new S3StorageProvider(process.env.S3_BUCKET || 'default-bucket')
      : new LocalStorageProvider();
  }

  async saveFile(filename: string, content: string): Promise<void> {
    await this.provider.save(filename, content);
  }

  async getFile(filename: string): Promise<string | null> {
    return await this.provider.get(filename);
  }

  async deleteFile(filename: string): Promise<void> {
    await this.provider.delete(filename);
  }

  async listFiles(): Promise<string[]> {
    return await this.provider.list();
  }

  async updateFile(filename: string, content: string): Promise<void> {
    await this.provider.update(filename, content);
  }
}