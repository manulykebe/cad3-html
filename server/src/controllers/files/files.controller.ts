import { Request, Response } from 'express';
import { FileStorageService } from '../../services/files/files.service.js';
import { StorageProvider } from '../../services/files/storage.provider.js';

const storageService = new FileStorageService();

export const uploadFile = async (req: Request, res: Response) => {
  try {
    const { filename, content } = req.body;
    if (!filename || !content) {
      return res.status(400).json({ message: 'Filename and content are required' });
    }

    await storageService.saveFile(filename, content);
    res.status(201).json({ message: 'File uploaded successfully' });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      message: 'File upload failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const downloadFile = async (req: Request, res: Response) => {
  try {
    const { filename } = req.params;
    const content = await storageService.getFile(filename);
    
    if (!content) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.json({ filename, content });
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ message: 'Error downloading file' });
  }
};

export const deleteFile = async (req: Request, res: Response) => {
  try {
    const { filename } = req.params;
    await storageService.deleteFile(filename);
    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Error deleting file' });
  }
};

export const listFiles = async (_req: Request, res: Response) => {
  try {
    const files = await storageService.listFiles();
    res.json(files);
  } catch (error) {
    console.error('List error:', error);
    res.status(500).json({ message: 'Error listing files' });
  }
};

export const updateFile = async (req: Request, res: Response) => {
  try {
    const { filename } = req.params;
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    await storageService.updateFile(filename, content);
    res.json({ message: 'File updated successfully' });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Error updating file' });
  }
};