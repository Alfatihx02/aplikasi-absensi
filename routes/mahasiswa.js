var express = require('express');
var router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const Model_Mahasiswa = require('../model/Model_Mahasiswa');
const Model_Jadwal = require('../model/Model_Jadwal');
const Model_Tugas = require('../model/Model_Tugas');
const Model_Materi = require('../model/Model_Materi');
const Model_Pengumuman = require('../model/Model_Pengumuman');
const Model_Pengumpulan = require('../model/Model_Pengumpulan');
const Model_HistoriPresensi = require('../model/Model_HistoriPresensi');
const Model_Presensi = require('../model/Model_Presensi');
const { DATE } = require('mysql/lib/protocol/constants/types');

const ensureAuthenticated = (req, res, next) => {
    if (req.session.userId && req.session.level_users == 3) {
      return next();
    } else {
      req.flash('error','Anda tida memiliki izin untuk halaman ini !!');
      res.redirect('/login')
    }
  };

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const id_tugas = req.params.id_tugas;
    const dir = `public/pengumpulan/${id_tugas}`;
    fs.mkdir(dir, { recursive: true }, (err) => {
      if (err) {
        console.error('Error creating directory:', err);
      }
      cb(null, dir);
    });
  },
  filename: (req, file, cb) => {
    // Get the file extension
    const ext = path.extname(file.originalname);
    // Create a unique filename while preserving the original name
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, + uniqueSuffix + ' - ' + file.originalname);
  }
});

// File filter (unchanged)
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.doc', '.docx', '.pdf', '.png', '.jpg', '.jpeg'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Format file tidak didukung.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024  // 5MB file size limit
  }
});

  router.get('/', ensureAuthenticated, async(req, res) =>{
    try {
      
      let id_user = req.session.userId;
      console.log('User ID: ', req.session.userId);
  
      let idMahasiswa = await Model_Mahasiswa.getIdFromUserId(id_user);
  
      let rows = await Model_Jadwal.getByIdMahasiswa(idMahasiswa);
      console.log('ID Mahasiswa: ', idMahasiswa);

      let Dosen = rows.length > 0 ? rows[0].Nama : NULL;
  
      res.render('mahasiswa/index',{data: rows, Dosen})
    } catch (error) {
      req.flash('error','Terjadi kesalahan saat mengambil data')
      res.redirect('/');
    }
  })

  router.get('/matakuliah', ensureAuthenticated, async(req, res) =>{
    try {
      
      let id_user = req.session.userId;
      console.log('User ID: ', req.session.userId);
  
      let idMahasiswa = await Model_Mahasiswa.getIdFromUserId(id_user);
  
      let rows = await Model_Jadwal.getByIdMahasiswa(idMahasiswa);
      console.log('ID Mahasiswa: ', idMahasiswa);

      let Dosen = rows.length > 0 ? rows[0].Nama : NULL;
  
      res.render('mahasiswa/jadwalKuliah',{data: rows, Dosen})
    } catch (error) {
      req.flash('error','Terjadi kesalahan saat mengambil data')
      res.redirect('/');
    }
  })

  // Router untuk mendapatkan tugas
  router.get('/tugas', ensureAuthenticated, async (req, res) => {
    try {
      let id_user = req.session.userId;
      let idMahasiswa = await Model_Mahasiswa.getIdFromUserId(id_user);
      
      let tugas = await Model_Tugas.getByIdMahasiswa(idMahasiswa);

      // Kirim data jadwal dan id_jadwal ke view
      res.render('mahasiswa/daftarTugas', { data: tugas }); 
    } catch (error) {
      req.flash('error', 'Terjadi kesalahan saat mengambil data tugas');
      res.redirect('/');
    }
  });

  router.get('/materi', ensureAuthenticated, async (req, res) => {
    try {
        let id_user = req.session.userId;
        let idMahasiswa = await Model_Mahasiswa.getIdFromUserId(id_user);
        
        let materi = await Model_Materi.getByIdMahasiswa(idMahasiswa);

        // Kirim data materi ke view
        res.render('mahasiswa/daftarMateri', { data: materi });
    } catch (error) {
        req.flash('error', 'Terjadi kesalahan saat mengambil data materi');
        res.redirect('/');
    }
});

router.get('/pengumuman', ensureAuthenticated, async (req, res) => {
  try {
      let id_user = req.session.userId;
      let idMahasiswa = await Model_Mahasiswa.getIdFromUserId(id_user);

      let pengumuman = await Model_Pengumuman.getByIdMahasiswa(idMahasiswa);

      res.render('mahasiswa/daftarPengumuman', { data: pengumuman });
  } catch (error) {
      req.flash('error', 'Terjadi kesalahan saat mengambil data pengumuman');
      res.redirect('/');
  }
});



  router.get('/jadwal/:id_jadwal', ensureAuthenticated, async (req, res, next) => {
    try {
      let id = req.session.userId;
      let id_jadwal = req.params.id_jadwal;
  
      let idMahasiswa = await Model_Mahasiswa.getIdFromUserId(id);
      let mahasiswaJadwal = await Model_Jadwal.getById(id_jadwal);
  
      // Check if the mahasiswa has access to this jadwal
      let jadwalMahasiswa = await Model_Jadwal.getByIdMahasiswa(idMahasiswa);
      if (!jadwalMahasiswa.some(jadwal => jadwal.id_jadwal === parseInt(id_jadwal))) {
        req.flash('error', 'Anda tidak memiliki akses ke jadwal ini.');
        return res.redirect('/mahasiswa/');
      }
  
      let presensiStatus = await Model_Presensi.getPresensiStatusByJadwal(id_jadwal);
      let id_presensi = null;
  
      if (presensiStatus === 'dibuka') {
        const activePresensi = await Model_Presensi.getActivatePresensiByJadwal(id_jadwal);
        if (activePresensi) {
          id_presensi = activePresensi.id_presensi;
        } else {
          presensiStatus = 'belum dibuka';
        }
      }
  
      // Get histori presensi for this mahasiswa and jadwal
      const historiPresensi = await Model_HistoriPresensi.getByMahasiswaAndJadwal(idMahasiswa, id_jadwal);
  
      res.render('mahasiswa/detail-jadwal', {
        data: mahasiswaJadwal,
        presensiStatus: presensiStatus,
        id_presensi: id_presensi,
        historiPresensi: historiPresensi,
      });
  
    } catch (error) {
      console.error(error);
      req.flash('error', 'Terjadi kesalahan saat mengambil data');
      res.redirect('/mahasiswa/');
    }
  });

  
  router.post('/presensi/submit/:id_jadwal', ensureAuthenticated, async (req, res) => {
    try {
      const id_jadwal = req.params.id_jadwal;
      const id_presensi = req.body.id_presensi;
      const id_user = req.session.userId;
  
      // Cek status presensi
      const presensi = await Model_Presensi.getId(id_presensi);
      const id_mahasiswa = await Model_Mahasiswa.getIdFromUserId(id_user)
      
      if (!presensi) {
        req.flash('error', 'Presensi tidak ditemukan.');
        return res.redirect(`/mahasiswa/jadwal/${id_jadwal}`);
      }
  
      if (presensi.status === 'ditutup') {
        req.flash('error', 'Presensi sudah ditutup');
        return res.redirect(`/mahasiswa/jadwal/${id_jadwal}`);
      }
      if (presensi.status === '') {
        req.flash('error', 'Presensi belum dibuka.');
        return res.redirect(`/mahasiswa/jadwal/${id_jadwal}`);
      }

  
      // Cek apakah mahasiswa sudah melakukan presensi
      const existingPresensi = await Model_HistoriPresensi.getByMahasiswaAndPresensi(id_mahasiswa, id_presensi);
      
      if (existingPresensi) {
        req.flash('error', 'Anda sudah melakukan presensi untuk sesi ini.');
        return res.redirect(`/mahasiswa/jadwal/${id_jadwal}`);
      }
  
      // Lakukan presensi
      const historiPresensi = {
        id_mahasiswa: id_mahasiswa,
        id_presensi: id_presensi,
        waktu_presensi: new Date()
      };
  
      const result = await Model_HistoriPresensi.Store(historiPresensi);
  
      if (result.affectedRows > 0) {
        req.flash('success', 'Presensi berhasil dilakukan.');
      } else {
        req.flash('error', 'Gagal melakukan presensi.');
      }
      
      return res.redirect(`/mahasiswa/jadwal/${id_jadwal}`);
  
    } catch (error) {
      console.error(error);
      req.flash('error', 'Terjadi kesalahan saat melakukan presensi.');
      return res.redirect(`/mahasiswa/jadwal/${req.params.id_jadwal}`);
    }
  });


  router.get('/materi/:id_jadwal', ensureAuthenticated, async (req, res, next) => {
    try {
      let id_jadwal = req.params.id_jadwal;
      let jadwal = await Model_Jadwal.getJadwalById(id_jadwal);
      let materi = await Model_Materi.getByIdJadwal(id_jadwal);
      console.log('jadwal: ', jadwal);
  
      // Jika materi kosong atau tidak ditemukan
      let message = '';
      if (!materi || materi.length === 0) {
        message = 'Belum ada materi yang tersedia untuk jadwal ini.';
      }
  
      res.render('mahasiswa/detail-materi', {
        data: jadwal,
        materi,
        message // Mengirimkan pesan ke view
      });
    } catch (error) {
      req.flash('error', 'Terjadi kesalahan saat mengambil data');
      res.redirect(`/mahasiswa/jadwal/${req.params.id_jadwal}`);
    }
  });
  


  router.get('/data-tugas/:id_jadwal', ensureAuthenticated, async(req, res, next) =>{
    try {
      let id = req.session.userId;
      let id_jadwal = req.params.id_jadwal;

      let id_mhs = await Model_Mahasiswa.getIdFromUserId(id);
      
      let tugas = await Model_Jadwal.getTugasByJadwal(id_jadwal);
      let jadwal = await Model_Jadwal.getJadwalById(id_jadwal)
      console.log('mahasiswa: ', id_mhs);
      console.log('tugas: ', tugas);
      console.log('Jadwal: ', jadwal);

      res.render('mahasiswa/tugas',{
        data: jadwal,
        rows: tugas,
      })
    } catch (error) {
      req.flash('error','Terjadi kesalahan saat mengambil data');
      res.redirect(`/mahasiswa/jadwal/${id_jadwal}`);
    }
  })

  router.get('/detail-tugas/:id_tugas', ensureAuthenticated, async (req, res, next) => {
    try {
        let id = req.session.userId;
        let id_tugas = req.params.id_tugas;

        // Mengambil data tugas berdasarkan id_tugas
        let tugas = await Model_Tugas.getById(id_tugas);

        if (!tugas) {
            req.flash('error', 'Tugas tidak ditemukan');
            return res.redirect('/mahasiswa/dashboard'); // Atau halaman lain yang sesuai
        }

        let id_mhs = await Model_Mahasiswa.getIdFromUserId(id)

        // Mengambil data jadwal terkait dengan tugas
        let jadwal = await Model_Jadwal.getDataJadwalByTugasId(id_tugas);
        let dataPengumpulan = await Model_Pengumpulan.getByIdMahasiswaAndIdTugas(id_mhs, tugas.id_tugas);
        
        // Inisialisasi objek pengumpulan jika belum ada
        tugas.pengumpulan = dataPengumpulan || { file_pengumpulan: null };
        console.log('Tugas Pengumpulan: ', tugas.pengumpulan);

        res.render('mahasiswa/detail-tugas', {
            tugas: tugas,
            data: jadwal,
        });
    } catch (error) {
        console.error('Error:', error);
        req.flash('error', 'Terjadi kesalahan saat mengambil data tugas');
        res.redirect('/mahasiswa/'); // Atau halaman lain yang sesuai
    }
});

  router.post('/upload-tugas/:id_tugas', upload.single('file_pengumpulan'), async (req, res, next) => {
    try {
      const id_user = req.session.userId;
      const id_tugas = req.params.id_tugas;
  
      if (!req.file) {
        throw new Error('Tidak ada file yang diunggah atau format file tidak didukung.');
      }
  
      const tugas = await Model_Tugas.getById(id_tugas);
      if (!tugas) {
        throw new Error('Tugas tidak ditemukan.');
      }
  
      const mahasiswa = await Model_Mahasiswa.getIdFromUserId(id_user);
      if (!mahasiswa) {
        throw new Error('Data mahasiswa tidak ditemukan.');
      }

      console.log('File uploaded:', req.file);
      console.log('User ID:', req.session.userId);
      console.log('Tugas ID:', req.params.id_tugas);

    
  
      const data = {
        id_mahasiswa: mahasiswa,
        id_tugas: tugas.id_tugas,
        file_pengumpulan: `/pengumpulan/${id_tugas}/${req.file.filename}`
      };
  
      console.log('Data to be stored:', data);
      await Model_Pengumpulan.Store(data);
      console.log('Data stored successfully');
  
      req.flash('success', 'Berhasil mengupload tugas');
      res.redirect(`/mahasiswa/detail-tugas/${id_tugas}`);
  
    } catch (error) {
      console.error(error);
      req.flash('error', 'Terjadi kesalahan saat mengunggah tugas: ' + error.message);
      res.redirect(`/mahasiswa/detail-tugas/${id_tugas}`);
    }
  });

  router.post('/update-pengumpulan/:id_pengumpulan', upload.single('file_pengumpulan'), async (req, res) => {
    try {
      const id_pengumpulan = req.params.id_pengumpulan;
      const id_tugas = req.body.id_tugas; // Assuming you're passing this in the form
  
      let updateData = {};
  
      if (req.file) {
        updateData.file_pengumpulan = `/pengumpulan/${id_tugas}/${req.file.filename}`;
      }
  
      // Add any other fields you want to update
      // For example: updateData.some_field = req.body.some_field;
  
      await Model_Pengumpulan.Update(id_pengumpulan, updateData);
  
      req.flash('success', 'Berhasil mengupdate pengumpulan tugas');
      res.redirect(`/mahasiswa/detail-tugas/${id_tugas}`);
    } catch (error) {
      console.error(error);
      req.flash('error', 'Terjadi kesalahan saat mengupdate pengumpulan tugas: ' + error.message);
      res.redirect(`/mahasiswa/detail-tugas/${req.body.id_tugas}`);
    }
  });


  router.get('/pengumuman/:id_jadwal', ensureAuthenticated, async(req, res, next) =>{
    try {
      let id_jadwal = req.params.id_jadwal;
      let jadwal = await Model_Jadwal.getById(id_jadwal);
      let pengumuman = await Model_Pengumuman.getByIdJadwal(jadwal.id_jadwal);
      console.log('pengumuman: ', pengumuman);

      res.render('mahasiswa/detail-pengumuman',{
        data: jadwal,
        pengumuman
      })
    } catch (error) {
      req.flash('error','Terjadi keslaahan saat mengambil data');
      res.redirect(`/mahasiswa/jadwal/${req.params.id_jadwal}`);
    }
  })


module.exports = router;