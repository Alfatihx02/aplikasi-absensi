// dosen.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Model_Materi = require('../models/Model_Materi');

// Konfigurasi multer untuk penyimpanan file materi
const materiStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/materi/'); // Folder penyimpanan file materi
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Menambahkan timestamp ke nama file
  }
});

// Filter untuk memastikan hanya format yang diizinkan
const materiFileFilter = (req, file, cb) => {
  const filetypes = /pdf|docx|pptx|zip/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Error: File upload materi hanya dapat berupa PDF, DOCX, PPTX, atau ZIP!');
  }
};

// Inisialisasi multer untuk materi
const uploadMateri = multer({
  storage: materiStorage,
  limits: { fileSize: 1000000 }, // Batas ukuran file (1MB)
  fileFilter: materiFileFilter
});

// Endpoint untuk upload materi
router.post('/materi/upload', uploadMateri.single('file_materi'), async (req, res) => {
  try {
    const data = {
      judul_materi: req.body.judul_materi,
      file_materi: req.file.path, // Simpan path file di database
      id_jadwal: req.body.id_jadwal
    };
    const result = await Model_Materi.Store(data);
    res.status(201).json({ message: 'Materi berhasil diupload!', result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengupload materi.', error });
  }
});

// Other routes for dosen.js
router.get('/dosen', async (req, res) => {
  // code for getting dosen data
});

router.post('/dosen', async (req, res) => {
  // code for creating new dosen data
});

module.exports = router;