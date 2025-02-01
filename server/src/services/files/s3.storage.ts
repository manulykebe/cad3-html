import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { StorageProvider } from './storage.provider.js';
import { config } from '../../config/env.js';

function replaceInvalidCharacters(filename: string): string {
  return filename.replace(/[\\]/g, '/').replace(/[^/a-zA-Z0-9_.-]/g, '_');
}
export class S3StorageProvider implements StorageProvider {
  private client: S3Client;
  private bucket: string;
  
  constructor(bucket: string) {
    this.bucket = bucket;
    this.client = new S3Client({ 
      region: config.aws.region,
      credentials: {
        accessKeyId: config.aws.accessKeyId,
        secretAccessKey: config.aws.secretAccessKey
      }
    });
  }

  async save(filename: string, content: string): Promise<void> {
    const key = replaceInvalidCharacters(filename);
    await this.client.send(new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: content,
    }));
  }

  async get(filename: string): Promise<string | null> {
    const key = replaceInvalidCharacters(filename);
    try {
      const response = await this.client.send(new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }));
      return await response.Body?.transformToString() ?? null;
    } catch (error) {
      return null;
    }
  }

  async delete(filename: string): Promise<void> {
    const key = replaceInvalidCharacters(filename);
    await this.client.send(new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
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