import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Routes for resumes
// Get specific resume by ID - must be defined before the userId route to avoid path conflicts
app.get('/api/resume/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM resumes WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all resumes for a user
app.get('/api/resumes/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await db.query('SELECT * FROM resumes WHERE user_id = $1', [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a resume (legacy endpoint)
app.put('/api/resume/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, theme, data } = req.body;
    
    const result = await db.query(
      'UPDATE resumes SET title = $1, theme = $2, data = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [title, theme, data, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a resume (new endpoint for autosave)
app.put('/api/resumes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, lastModified } = req.body;
    
    // Extract theme from data if present
    const theme = data?.activeTheme || 'modern';
    const title = data?.basicInfo?.name || 'Untitled Resume';
    
    const result = await db.query(
      'UPDATE resumes SET title = $1, theme = $2, data = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [title, theme, JSON.stringify(data), id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    
    res.json({ 
      success: true, 
      resume: result.rows[0],
      message: 'Resume saved successfully'
    });
  } catch (err) {
    console.error('Error updating resume:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Get resume by ID (new endpoint for loading)
app.get('/api/resumes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM resumes WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    
    const resume = result.rows[0];
    // Parse data if it's a string
    if (typeof resume.data === 'string') {
      resume.data = JSON.parse(resume.data);
    }
    
    res.json(resume);
  } catch (err) {
    console.error('Error fetching resume:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Delete a resume
app.delete('/api/resume/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query('DELETE FROM resumes WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    
    res.json({ message: 'Resume deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new resume
app.post('/api/resumes', async (req, res) => {
  try {
    const { user_id, title, content } = req.body;
    const result = await db.query(
      'INSERT INTO resumes (user_id, title, theme, data) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_id, title, 'modern', JSON.stringify(content)]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Test database connection
    await db.query('SELECT NOW()');
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