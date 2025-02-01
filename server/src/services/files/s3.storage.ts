import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { StorageProvider } from './storage.provider.js';

export class S3StorageProvider implements StorageProvider {
  private client: S3Client;
  private bucket: string;
  
  constructor(bucket: string) {
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      throw new Error('AWS credentials not configured');
    }
    this.bucket = bucket;
    this.client = new S3Client({ 
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
      }
    });
  }

  async save(filename: string, content: string): Promise<void> {
    await this.client.send(new PutObjectCommand({
      Bucket: this.bucket,
      Key: filename,
      Body: content,
    }));
  }

  async get(filename: string): Promise<string | null> {
    try {
      const response = await this.client.send(new GetObjectCommand({
        Bucket: this.bucket,
        Key: filename,
      }));
      return await response.Body?.transformToString() ?? null;
    } catch (error) {
      return null;
    }
  }

  async delete(filename: string): Promise<void> {
    await this.client.send(new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: filename,
    }));
  }

  async list(): Promise<string[]> {
    const response = await this.client.send(new ListObjectsV2Command({
      Bucket: this.bucket,
    }));
    return response.Contents?.map(item => item.Key!) ?? [];
  }

  async update(filename: string, content: string): Promise<void> {
    await this.save(filename, content);
  }
}