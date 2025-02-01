export interface StorageProvider {
  save(filename: string, content: string): Promise<void>;
  get(filename: string): Promise<string | null>;
  delete(filename: string): Promise<void>;
  list(): Promise<string[]>;
  update(filename: string, content: string): Promise<void>;
}