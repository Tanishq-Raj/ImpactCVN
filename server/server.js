import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './prisma.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import authRoutes from './routes/auth.js';
import authMiddleware from './middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from parent directory (project root)
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Authentication routes (public)
app.use('/api/users', authRoutes);

// Resume sharing endpoint (public)
app.post('/api/share-resume', async (req, res) => {
  try {
    const { shareId, resumeData } = req.body;
    
    if (!shareId || !resumeData) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Store the shared resume in the database (upsert)
    await prisma.sharedResume.upsert({
      where: { shareId },
      update: { data: resumeData },
      create: {
        shareId,
        data: resumeData
      }
    });
    
    res.json({ success: true, shareId });
  } catch (err) {
    console.error('Error sharing resume:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get shared resume by ID (public)
app.get('/api/share-resume/:shareId', async (req, res) => {
  try {
    const { shareId } = req.params;
    
    const sharedResume = await prisma.sharedResume.findUnique({
      where: { shareId },
      select: { data: true }
    });
    
    if (!sharedResume) {
      return res.status(404).json({ error: 'Shared resume not found' });
    }
    
    res.json({ data: sharedResume.data });
  } catch (err) {
    console.error('Error retrieving shared resume:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PDF sharing endpoint
app.post('/api/share-pdf', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }
    
    const filename = req.file.filename;
    const shareId = path.parse(filename).name;
    
    // In a production app, you would save this to the database
    // For now, we'll just return the URL to the uploaded file
    const pdfUrl = `${req.protocol}://${req.get('host')}/uploads/${filename}`;
    
    res.json({ 
      success: true, 
      shareId,
      pdfUrl
    });
  } catch (err) {
    console.error('Error sharing PDF:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get shared PDF by ID
app.get('/api/shared-pdf/:shareId', async (req, res) => {
  try {
    const { shareId } = req.params;
    
    // In a production app, you would look up the file in the database
    // For now, we'll just check if the file exists in the uploads directory
    const files = fs.readdirSync(uploadsDir);
    const pdfFile = files.find(file => file.startsWith(shareId));
    
    if (!pdfFile) {
      return res.status(404).json({ error: 'Shared PDF not found' });
    }
    
    const pdfUrl = `${req.protocol}://${req.get('host')}/uploads/${pdfFile}`;
    res.json({ pdfUrl });
  } catch (err) {
    console.error('Error retrieving shared PDF:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Routes for resumes (protected with authentication)
// Get specific resume by ID - must be defined before the userId route to avoid path conflicts
app.get('/api/resume/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const resume = await prisma.resume.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    res.json(resume);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all resumes for authenticated user
app.get('/api/resumes', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const resumes = await prisma.resume.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' }
    });
    res.json(resumes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a resume (legacy endpoint)
app.put('/api/resume/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, theme, data } = req.body;
    
    const resume = await prisma.resume.update({
      where: { id: parseInt(id) },
      data: { title, theme, data }
    });
    
    res.json(resume);
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Resume not found' });
    }
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a resume (new endpoint for autosave)
app.put('/api/resumes/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { data, lastModified } = req.body;
    
    // Extract theme from data if present
    const theme = data?.activeTheme || 'modern';
    const title = data?.basicInfo?.name || 'Untitled Resume';
    
    const resume = await prisma.resume.update({
      where: { id: parseInt(id) },
      data: {
        title,
        theme,
        data
      }
    });
    
    res.json({ 
      success: true, 
      resume,
      message: 'Resume saved successfully'
    });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Resume not found' });
    }
    console.error('Error updating resume:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Get resume by ID (new endpoint for loading)
app.get('/api/resumes/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const resume = await prisma.resume.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    
    res.json(resume);
  } catch (err) {
    console.error('Error fetching resume:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Delete a resume
app.delete('/api/resume/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.resume.delete({
      where: { id: parseInt(id) }
    });
    
    res.json({ message: 'Resume deleted successfully' });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Resume not found' });
    }
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new resume
app.post('/api/resumes', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { title, content } = req.body;
    
    const resume = await prisma.resume.create({
      data: {
        userId,
        title: title || 'Untitled Resume',
        theme: 'modern',
        data: content
      }
    });
    
    res.status(201).json(resume);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT NOW()`;
    res.json({ status: 'ok' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});