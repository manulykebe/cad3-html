import { Router } from 'express';
import { 
  uploadFile,
  downloadFile,
  deleteFile,
  listFiles,
  updateFile
} from '../../controllers/files/files.controller.js';
import { auth } from '../../middleware/auth.js';

const router = Router();

// Protect all file routes with authentication
router.use(auth);

// POST   /api/files/upload          - Upload a new file
// GET    /api/files/download/:name  - Download a file
// DELETE /api/files/:name           - Delete a file
// GET    /api/files/list            - List all files
// PUT    /api/files/:name           - Update a file


router.post('/upload', uploadFile);
router.get('/download/:filename', downloadFile);
router.delete('/:filename', deleteFile);
router.get('/list', listFiles);
router.put('/:filename', updateFile);

export default router;