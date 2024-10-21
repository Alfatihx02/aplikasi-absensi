var express = require('express');
var router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const Model_Dosen = require('../model/Model_Dosen');
const Model_Presensi = require('../model/Model_Presensi');
const Model_Jadwal = require('../model/Model_Jadwal');
const Model_Tugas = require('../model/Model_Tugas');
const Model_Materi = require('../model/Model_Materi');
const Model_Pengumuman = require('../model/Model_Pengumuman');
const Model_Pengumpulan = require('../model/Model_Pengumpulan');
const Model_HistoriPresensi = require('../model/Model_HistoriPresensi');
const Model_Mahasiswa = require('../model/Model_Mahasiswa');

function ensureAuthenticated(req, res, next) {
  if (req.session.userId && req.session.level_users == 2) {
    return next();
  } else {
    req.flash('error', 'Anda tida memiliki izin untuk halaman ini !!');
    res.redirect('/login');
  }
}

  // Konfigurasi multer untuk penyimpanan file tugas
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const id_jadwal = req.params.id_jadwal;
      const dir = `public/pengumpulan/${id_jadwal}`;
      fs.mkdir(dir, { recursive: true }, (err) => {
        if (err) {
          console.error('Error creating directory:', err);
        }
        cb(null, dir);
      });
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  
  // File filter
  const fileFilter = (req, file, cb) => {
    // Daftar ekstensi file yang diizinkan
    const allowedExtensions = ['.doc', '.docx', '.pdf', '.png', '.jpg'];
    
    // Dapatkan ekstensi file
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
      fileSize: 5 * 1024 * 1024  // Batasan ukuran file (contoh: 5MB)
    }
  });
  

  router.get('/', ensureAuthenticated, async (req, res, next) => {
    try {
        let id = req.session.userId; 
        console.log('user Id: ', req.session.userId); 

        let idDosen = await Model_Dosen.getIdDosenFromUserId(id);
        
        let rows = await Model_Jadwal.getByIdDosen(idDosen);
        let dosen = await Model_Dosen.getId(idDosen);
        console.log('id dosen: ', idDosen);
        console.log('Data: ', rows);
        console.log('Dosen: ', dosen);
        
        res.render('dosen/index',{
          data: rows,
          dosen
        })

    } catch (err) {
        console.error(err);
        req.flash('error', 'Terjadi kesalahan saat mengambil data');
        res.redirect('/dosen/');
    }
});

router.get('/matakuliah', ensureAuthenticated, async (req, res, next) =>{
  try {
    let id = req.session.userId;
    let idDosen = await Model_Dosen.getIdDosenFromUserId(id);
  
    let rows = await Model_Jadwal.getByIdDosen(idDosen);
    let dosen = await Model_Dosen.getId(idDosen);
    
    res.render('dosen/index_matakuliah',{
      data: rows,
      dosen
    })
    
  } catch (error) {
    req.flash('error','Terjadi kesalahan saat mengambil data');
    res.redirect('/dosen/')
  }
});


router.get('/jadwal/:id_jadwal', ensureAuthenticated, async (req, res, next) => {
  try {
    let id = req.session.userId;
    let id_jadwal = req.params.id_jadwal;

    let idDosen = await Model_Dosen.getIdDosenFromUserId(id);
    let dosenJadwal = await Model_Jadwal.getId(id_jadwal);
    let dataMhs = await Model_Mahasiswa.getMhsByIdjadwal(id_jadwal);

    if (dosenJadwal.id_dosen !== idDosen) {
      req.flash('error', 'Anda tidak memiliki akses ke jadwal ini.');
      return res.redirect('/dosen/');
    }

    let openPresensi = await Model_Presensi.getOpenPresensiByJadwal(id_jadwal);
    let presensiStatus = openPresensi ? 'dibuka' : 'belum dibuka';

    // Fetch all presensi records for this jadwal
    let allPresensi = await Model_Presensi.getAllByIdJadwal(id_jadwal);

    let presensiMhs = [];
    if (openPresensi) {
      presensiMhs = await Model_HistoriPresensi.getByIdPresensi(openPresensi.id_presensi);
    } else if (allPresensi.length > 0) {
      // If no open presensi, get the latest closed presensi
      let latestPresensi = allPresensi[allPresensi.length - 1];
      presensiMhs = await Model_HistoriPresensi.getByIdPresensi(latestPresensi.id_presensi);
    }

    res.render('dosen/index_jadwal', {
      page: 'kuliah',
      data: dosenJadwal,
      presensiStatus: presensiStatus,
      id_presensi: openPresensi ? openPresensi.id_presensi : null,
      rows: presensiMhs,
      mhs: dataMhs,
      allPresensi: allPresensi,
    });

  } catch (error) {
    console.error(error);
    req.flash('error', 'Terjadi kesalahan saat mengambil data');
    res.redirect('/dosen/');
  }
});

router.get('/histori-presensi/:id_presensi', ensureAuthenticated, async (req, res) => {
  try {
    const id_presensi = req.params.id_presensi;
    const historiPresensi = await Model_HistoriPresensi.getByIdPresensi(id_presensi);
    res.json(historiPresensi);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
});

router.post('/presensi/buka', ensureAuthenticated, async (req, res) => { ///..Routing presensi
  try {
    const { id_jadwal } = req.body;

    const jadwalExists = await Model_Jadwal.checkJadwalExists(id_jadwal);
    if (!jadwalExists) {
      req.flash('error', 'Jadwal tidak ditemukan.');
      return res.redirect(`/dosen/jadwal/${id_jadwal}`);
    }

    const lastPertemuan = await Model_Presensi.getLastPertemuanByJadwal(id_jadwal);
    const pertemuan = lastPertemuan ? lastPertemuan + 1 : 1;

    const dataPresensi = {
      id_jadwal: id_jadwal,
      pertemuan: pertemuan,
      waktu_dibuka: new Date(),
      status: 'dibuka',
    };

    const newPresensi = await Model_Presensi.Store(dataPresensi);
    
    req.flash('success', 'Presensi dibuka!');
    req.flash('presensiStatus', 'dibuka');
    req.flash('id_presensi', newPresensi.insertId); // Set flash message
    req.session.id_presensi = newPresensi.insertId; // Set session value


    return res.redirect(`/dosen/jadwal/${id_jadwal}`);
  } catch (error) {
    console.error(error);
    req.flash('error', 'Terjadi kesalahan saat membuka presensi.');
    return res.redirect(`/dosen/jadwal/${id_jadwal}`);
  }
});
// Routing untuk tutup presensi
router.post('/presensi/tutup/:id_jadwal', ensureAuthenticated, async (req, res) => {
  try {
    const id_jadwal = req.params.id_jadwal;
    
    // Dapatkan presensi yang masih terbuka untuk jadwal ini
    const openPresensi = await Model_Presensi.getOpenPresensiByJadwal(id_jadwal);
    
    if (!openPresensi) {
      req.flash('error', 'Tidak ada presensi aktif untuk jadwal ini.');
      return res.redirect(`/dosen/jadwal/${id_jadwal}`);
    }
    
    const updateData = {
      waktu_ditutup: new Date(),
      status: 'ditutup'
    };
    
    const result = await Model_Presensi.Update(openPresensi.id_presensi, updateData);
    
    if (!result) {
      req.flash('error', 'Gagal menutup presensi.');
      return res.redirect(`/dosen/jadwal/${id_jadwal}`);
    }
    
    req.flash('success', 'Berhasil menutup presensi!');
    return res.redirect(`/dosen/jadwal/${id_jadwal}`);
  } catch (error) {
    console.error(error);
    req.flash('error', 'Terjadi kesalahan saat menutup presensi.');
    return res.redirect('/dosen/');
  }
});



// Routing Membuat Tugas
router.get('/detail_tugas/:id_jadwal', ensureAuthenticated, async (req, res, next) => {
  try {
    let id_jadwal = req.params.id_jadwal;

    // Ambil jadwal berdasarkan id_jadwal
    let jadwal = await Model_Jadwal.getById(id_jadwal);
    
    if (!jadwal) {
      req.flash('error', 'Jadwal tidak ditemukan');
      return res.redirect('/dosen/');
    }

    // Ambil tugas yang terkait dengan id_jadwal
    let tugas = await Model_Tugas.getTugasByIdJadwal(id_jadwal);

    // Jika tidak ada tugas, set tugas ke null
    if (!tugas || tugas.length === 0) {
      tugas = null;
    }

    // Render halaman dengan data jadwal dan tugas
    res.render('dosen/create_tugas', {
      data: jadwal,
      tugas: tugas
    });
  } catch (error) {
    console.error('Error:', error);
    req.flash('error', 'Terjadi kesalahan saat mengambil data');
    res.redirect('/dosen/');
  }
});
// Endpoint untuk upload tugas
router.post('/upload_tugas/:id_jadwal', upload.single('file_tugas'), async (req, res, next) => {
  try {
    const id_jadwal = req.params.id_jadwal;
    const { judul_tugas } = req.body;

    // Pastikan judul tugas tidak kosong
    if (!judul_tugas || judul_tugas.trim() === '') {
      req.flash('error', 'Judul tugas tidak boleh kosong.');
      return res.redirect(`/dosen/detail_tugas/${id_jadwal}`);
    }

    // Ambil jadwal untuk validasi
    const jadwal = await Model_Jadwal.getById(id_jadwal);
    if (!jadwal) {
      req.flash('error', 'Jadwal tidak ditemukan.');
      return res.redirect(`/dosen/detail_tugas/${id_jadwal}`);
    }

    // Siapkan data tugas
    const data = {
      judul_tugas,
      file_tugas: req.file ? `/pengumpulan/${id_jadwal}/${req.file.filename}` : null, 
      id_jadwal: id_jadwal,
    };

    // Simpan data tugas
    await Model_Tugas.Store(data);
    req.flash('success', 'Berhasil mengupload tugas.');
    res.redirect(`/dosen/detail_tugas/${id_jadwal}`);
  } catch (error) {
    console.error('Error uploading task:', error);
    req.flash('error', 'Terjadi kesalahan saat mengupload tugas.');
    res.redirect(`/dosen/detail_tugas/${req.params.id_jadwal}`);
  }
});

// Update Tugas
router.post('/update_tugas', upload.single('file_tugas'), async (req, res, next) => {
  try {
    const { id_tugas, judul_tugas } = req.body;

    // Pastikan input valid
    if (!id_tugas || !judul_tugas || judul_tugas.trim() === '') {
      req.flash('error', 'Data tugas tidak valid.');
      return res.redirect('back');
    }

    // Ambil data tugas lama
    const existingTask = await Model_Tugas.getById(id_tugas);
    if (!existingTask) {
      req.flash('error', 'Tugas tidak ditemukan.');
      return res.redirect('back');
    }

    // Update data tugas
    const updateData = {
      judul_tugas: judul_tugas,
      file_tugas: existingTask.file_tugas // Tetap gunakan file lama jika tidak ada file baru
    };

    // Jika ada file baru, ganti file lama
    if (req.file) {
      // Hapus file lama jika ada
      if (existingTask.file_tugas) {
        const oldFilePath = `./public${existingTask.file_tugas}`; // Sesuaikan path file
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      // Ganti dengan file baru
      updateData.file_tugas = `/pengumpulan/${existingTask.id_jadwal}/${req.file.filename}`;
    }

    // Update ke database
    await Model_Tugas.Update(id_tugas, updateData);
    req.flash('success', 'Tugas berhasil diperbarui.');
    res.redirect(`/dosen/detail_tugas/${existingTask.id_jadwal}`);
  } catch (error) {
    console.error('Error updating task:', error);
    req.flash('error', 'Terjadi kesalahan saat memperbarui tugas.');
    res.redirect('back');
  }
});

// Delete Tugas
router.get('/delete_tugas/:id_tugas', ensureAuthenticated, async (req, res, next) => {
  try {
    const { id_tugas } = req.params;
    const tugas = await Model_Tugas.getId(id_tugas);

    if (!tugas || tugas.length === 0) {
      req.flash('error', 'Tugas tidak ditemukan');
      return res.redirect('/dosen/');
    }

    // Ambil id_jadwal dari tugas yang ditemukan
    const id_jadwal = tugas[0].id_jadwal;

    // Hapus tugas
    await Model_Tugas.Delete(id_tugas);
    req.flash('success', 'Berhasil menghapus tugas.');

    // Redirect ke halaman create_tugas dengan id_jadwal yang sesuai
    res.redirect(`/dosen/detail_tugas/${id_jadwal}`);
  } catch (error) {
    console.error('Error:', error);
    req.flash('error', 'Terjadi kesalahan saat menghapus tugas');
    res.redirect('/dosen/');
  }
});

router.get('/info-tugas/:id_tugas', ensureAuthenticated, async (req, res, next) => {
  try {
      const id_tugas = req.params.id_tugas;

      // Ambil data tugas berdasarkan id_tugas
      const tugas = await Model_Tugas.getById(id_tugas);
      if (!tugas) {
          req.flash('error', 'Tugas tidak ditemukan.');
          return res.redirect('/dosen/');
      }

      const jadwal = await Model_Jadwal.getByIdTugas(id_tugas);
      console.log('data: ',jadwal);

      // Ambil data pengumpulan tugas mahasiswa berdasarkan id_tugas
      const pengumpulanTugas = await Model_Pengumpulan.getByIdTugas(id_tugas);

      // Render halaman info tugas dengan data tugas dan pengumpulan tugas mahasiswa
      res.render('dosen/info-tugas', {
          data: jadwal,
          tugas: tugas,
          pengumpulanTugas: pengumpulanTugas
      });
  } catch (error) {
      console.error('Error:', error);
      req.flash('error', 'Terjadi kesalahan saat mengambil data tugas.');
      res.redirect('/dosen/');
  }
});



// Router Materi
router.get('/materi/:id_jadwal', ensureAuthenticated, async (req, res) => {
  try {
    const id_jadwal = req.params.id_jadwal;
    const jadwal = await Model_Jadwal.getById(id_jadwal);
    if (!jadwal) {
      req.flash('error', 'Jadwal tidak ditemukan');
      return res.redirect('/dosen');
    }
    console.log('PPP: ',jadwal);
    const materi = await Model_Materi.getByIdJadwal(id_jadwal);
    console.log('mmm: ', materi);
    res.render('dosen/detail_materi', { data: jadwal, materi });
  } catch (error) {
    console.error('Error:', error);
    req.flash('error', 'Terjadi kesalahan saat mengambil data materi');
    res.redirect('/dosen');
  }
});

// Create materi process
router.post('/upload_materi/:id_jadwal', upload.single('file_materi'), async (req, res) => {
  try {
    const id_jadwal = req.params.id_jadwal;
    const { keterangan } = req.body;

    if (!req.file) {
      req.flash('error', 'File materi tidak ditemukan.');
      return res.redirect(`/dosen/materi/${id_jadwal}`);
    }

    // Pastikan ada judul tugas yang diinputkan
    if (!keterangan || keterangan.trim() === '') {
      req.flash('error', 'Keterangan tidak boleh kosong.');
      return res.redirect(`/dosen/create_tugas/${id_jadwal}`);
    }

    // Ambil data jadwal dari database untuk verifikasi
    const jadwal = await Model_Jadwal.getById(id_jadwal);
    if (!jadwal) {
      req.flash('error', 'Jadwal tidak ditemukan.');
      return res.redirect(`/dosen/create_tugas/${id_jadwal}`);
    }

    const data = {
      file_materi: `/pengumpulan/${id_jadwal}/${req.file.filename}`,
      keterangan,
      id_jadwal
    };

    await Model_Materi.Store(data);
    req.flash('success', 'Berhasil menambahkan materi.');
    res.redirect(`/dosen/materi/${id_jadwal}`);
  } catch (error) {
    console.error('Error:', error);
    req.flash('error', 'Terjadi kesalahan saat menambahkan materi');
    res.redirect(`/dosen/materi/${req.params.id_jadwal}`);
  }
});


// Update materi process
router.post('/materi/update/:id_materi', upload.single('file_materi'), async (req, res, next) => {
  try {
    const { id_materi } = req.params;
    const { keterangan } = req.body;

    // Pastikan input valid
    if (!id_materi || !keterangan || keterangan.trim() === '') {
      req.flash('error', 'Data materi tidak valid.');
      return res.redirect('back');
    }

    // Ambil data materi lama
    const existingMateri = await Model_Materi.getById(id_materi);
    if (!existingMateri) {
      req.flash('error', 'Materi tidak ditemukan.');
      return res.redirect('back');
    }

    // Siapkan data untuk diupdate
    const updateData = {
      keterangan: keterangan,
      file_materi: existingMateri.file_materi // Tetap gunakan file lama jika tidak ada file baru
    };

    // Jika ada file baru, ganti file lama
    if (req.file) {
      // Hapus file lama jika ada
      if (existingMateri.file_materi) {
        const oldFilePath = `./public${existingMateri.file_materi}`; // Sesuaikan path file
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath); // Hapus file lama
        }
      }
      // Ganti dengan file baru
      updateData.file_materi = `/uploads/${req.file.filename}`; // Path file baru
    }

    // Update ke database
    await Model_Materi.Update(id_materi, updateData);
    req.flash('success', 'Materi berhasil diperbarui.');
    res.redirect(`/dosen/materi/${existingMateri.id_jadwal}`);
  } catch (error) {
    console.error('Error updating materi:', error);
    req.flash('error', 'Terjadi kesalahan saat memperbarui materi.');
    res.redirect('back');
  }
});

// Delete materi
router.get('/materi/delete/:id_materi', ensureAuthenticated, async (req, res) => {
  try {
    const id_materi = req.params.id_materi;
    const materi = await Model_Materi.getId(id_materi);
    if (!materi) {
      req.flash('error', 'Materi tidak ditemukan');
      return res.redirect('/dosen');
    }

    const id_jadwal = materi[0].id_jadwal;

    await Model_Materi.Delete(id_materi);
    req.flash('success', 'Berhasil menghapus materi.');
    res.redirect(`/dosen/materi/${id_jadwal}`);
  } catch (error) {
    console.error('Error:', error);
    req.flash('error', 'Terjadi kesalahan saat menghapus materi');
    res.redirect('/dosen');
  }
});

//membuat pengumuman
router.get('/pengumuman/:id_jadwal', ensureAuthenticated, async (req, res) => {
  try {
    const id_jadwal = req.params.id_jadwal;
    const jadwal = await Model_Jadwal.getById(id_jadwal);
    if (!jadwal) {
      req.flash('error', 'Jadwal tidak ditemukan');
      return res.redirect('/dosen');
    }
    const pengumuman = await Model_Pengumuman.getByIdJadwal(id_jadwal);
    res.render('dosen/pengumuman', { data: jadwal, pengumuman });
  } catch (error) {
    console.error('Error:', error);
    req.flash('error', 'Terjadi kesalahan saat mengambil data pengumuman');
    res.redirect('/dosen');
  }
});


router.post('/upload_pengumuman/:id_jadwal', async (req, res) => {
  try {
    const id_jadwal = req.params.id_jadwal;
    const { judul, keterangan } = req.body;

    if (!judul || judul.trim() === '' || !keterangan || keterangan.trim() === '') {
      req.flash('error', 'Judul dan keterangan tidak boleh kosong.');
      return res.redirect(`/dosen/create_pengumuman/${id_jadwal}`);
    }

    const jadwal = await Model_Jadwal.getById(id_jadwal);
    if (!jadwal) {
      req.flash('error', 'Jadwal tidak ditemukan.');
      return res.redirect('/dosen');
    }

    const data = {
      judul,
      keterangan,
      id_jadwal
    };

    await Model_Pengumuman.Store(data);
    req.flash('success', 'Berhasil menambahkan pengumuman.');
    res.redirect(`/dosen/pengumuman/${id_jadwal}`);
  } catch (error) {
    console.error('Error:', error);
    req.flash('error', 'Terjadi kesalahan saat menambahkan pengumuman');
    res.redirect(`/dosen/pengumuman/${req.params.id_jadwal}`);
  }
});

router.get('/delete_pengumuman/:id_pengumuman', ensureAuthenticated, async (req, res) => {
  try {
    const id_pengumuman = req.params.id_pengumuman;
    const pengumuman = await Model_Pengumuman.getId(id_pengumuman);

    if (!pengumuman || pengumuman.length === 0) {
      console.log('Pengumuman not found');
      req.flash('error', 'Pengumuman tidak ditemukan.');
      return res.redirect('/dosen');
    }

    const id_jadwal = pengumuman[0].id_jadwal;


    await Model_Pengumuman.Delete(id_pengumuman);
    req.flash('success', 'Berhasil menghapus pengumuman.');
    res.redirect(`/dosen/pengumuman/${id_jadwal}`);
  } catch (error) {
    console.error('Error:', error);
    req.flash('error', 'Terjadi kesalahan saat menghapus pengumuman');
    res.redirect('/dosen');
  }
});
module.exports = router;