import express from 'express';

// controllers
import file from '../controllers/File.js';

const router = express.Router();

router
  .post('/save', file.save);

export default router;