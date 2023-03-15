import express from 'express';

// controllers
import file from '../controllers/File.js';

const router = express.Router();

router
  .post('/save', file.save)
  .get('/get/:foldername', file.get)
  .delete('/delete/:uniqBroswer/', file.delete)
  .delete('/delete/:uniqBroswer/:file', file.delete);

export default router;