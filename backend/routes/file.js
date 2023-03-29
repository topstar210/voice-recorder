import express from 'express';

// controllers
import file from '../controllers/File.js';

const router = express.Router();

router
  .post('/save', file.save)
  .get('/get/:pinCode/:dateVal', file.get)
  .get('/get_removed/:pinCode', file.getRemovedFiles)
  // .delete('/delete/:pinCode/', file.delete)
  .delete('/delete/:pinCode/:dateVal/:file', file.delete);
  

export default router;