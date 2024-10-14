var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const Model_Users = require('../model/Model_User');
const Model_Dosen = require('../model/Model_Dosen');
const Model_Mahasiswa = require('../model/Model_Mahasiswa');
const Model_Matakuliah = require('../model/Model_Matakuliah');
const Model_Jurusan = require('../model/Model_Jurusan');
const Model_Prodi = require('../model/Model_Prodi');
const Model_Kelas = require('../model/Model_Kelas');
const Model_Ruangan = require('../model/Model_Ruangan');
const Model_Jadwal = require('../model/Model_Jadwal');



const ensureAuthenticated = (req, res, next) => {
  if (req.session.userId && req.session.level_users == 1) {
    return next();
  } else {
    req.flash('error','Anda tida memiliki izin untuk halaman ini !!');
    res.redirect('/login')
  }
};

/* GET users listing. */
router.get('/data_user', ensureAuthenticated, async (req, res, next) => {
    try {
        let id = req.session.userId;
        
        let Data = await Model_Users.getId(id);
        let User = await Model_Users.getAll();

        if(Data.length > 0){
          res.render('admin/data_users',{
            title: 'Data User',
            rows: User
          });
        }
        else{
          res.status(401).json({error: 'user not found !'})
        res.redirect('/login')
        }
        
    } catch (error) {
        next(error);
    }
})

// Router Dosen
router.get('/data_dosen', ensureAuthenticated, async (req, res, next) => {
  try {
    let id = req.session.userId

    let Data = await Model_Users.getId(id);
    let Dosen = await Model_Dosen.getAllData();

    if(Data.length > 0){
      res.render('admin/data_dosen', {
        title: 'Data Dosen',
        rows: Dosen,
      })
    }
    else{
      res.status(401).json({error: 'user not found !'})
    res.redirect('/login')
    }
  } catch (error) {
    next(error);
  }
})

// Router Mahasiswa
router.get('/data_mahasiswa', ensureAuthenticated, async (req, res, next) => {
  try {
    let id = req.session.userId

    let Data = await Model_Users.getId(id);
    let mhs = await Model_Mahasiswa.getAllMhs();

    if(Data.length > 0){
      res.render('admin/data_mahasiswa', {
        title: 'Data Mahasiswa',
        rows: mhs,
      })
    }
    else{
      res.status(401).json({error: 'user not found !'})
    res.redirect('/login')
    }
  } catch (error) {
    next(error);
  }
})

// Router MataKuliah
router.get('/data_matakuliah', ensureAuthenticated, async (req, res, next) => {
  try {
    let id = req.session.userId

    let Data = await Model_Users.getId(id);
    let matkul = await Model_Matakuliah.getAll();

    if(Data.length > 0){
      res.render('admin/data_matakuliah', {
        title: 'Data Matakuliah',
        rows: matkul,
      })
    }
    else{
      res.status(401).json({error: 'user not found !'})
    res.redirect('/login')
    }
  } catch (error) {
    next(error);
  }
})

// Router Jurusan
router.get('/data_jurusan', ensureAuthenticated, async (req, res, next) => {
  try {
    let id = req.session.userId
    // let id_j = req.params.id

    let Data = await Model_Users.getId(id);
    let jurusan = await Model_Jurusan.getAll();

    if(Data.length > 0){
      res.render('admin/data_jurusan', {
        title: 'Data Jurusan',
        rows: jurusan,
        // id_j
      })
    }
    else{
      res.status(401).json({error: 'user not found !'})
    res.redirect('/login')
    }
  } catch (error) {
    next(error);
  }
})

// Router Prodi
router.get('/data_prodi', ensureAuthenticated, async (req, res, next) => {
  try {
    let id = req.session.userId

    let Data = await Model_Users.getId(id);
    let prodi = await Model_Prodi.getData();

    if(Data.length > 0){
      res.render('admin/data_prodi', {
        title: 'Data Prodi',
        rows: prodi,
      })
    }
    else{
      res.status(401).json({error: 'user not found !'})
    res.redirect('/login')
    }
  } catch (error) {
    next(error);
  }
})

// Router Kelas
router.get('/data_Kelas', ensureAuthenticated, async (req, res, next) => {
  try {
    let id = req.session.userId

    let Data = await Model_Users.getId(id);
    let Kelas = await Model_Kelas.getData();

    if(Data.length > 0){
      res.render('admin/data_kelas', {
        title: 'Data Kelas',
        rows: Kelas,
      })
    }
    else{
      res.status(401).json({error: 'user not found !'})
    res.redirect('/login')
    }
  } catch (error) {
    next(error);
  }
})

// Router Ruangan
router.get('/data_ruangan', ensureAuthenticated, async (req, res, next) => {
  try {
    let id = req.session.userId

    let Data = await Model_Users.getId(id);
    let ruangan = await Model_Ruangan.getAll();

    if(Data.length > 0){
      res.render('admin/data_ruangan', {
        title: 'Data Ruangan',
        rows: ruangan,
      })
    }
    else{
      res.status(401).json({error: 'user not found !'})
    res.redirect('/login')
    }
  } catch (error) {
    next(error);
  }
})

// Router Jadwal
router.get('/data_jadwal', ensureAuthenticated, async (req, res, next) => {
  try {
    let id = req.session.userId

    let Data = await Model_Users.getId(id);
    let jadwal = await Model_Jadwal.getDetailJadwal();
    console.log('jadwal: ', jadwal)

    if(Data.length > 0){
      res.render('admin/data_jadwal', {
        title: 'Data Jadwal',
        rows: jadwal,
      })
    }
    else{
      res.status(401).json({error: 'user not found !'})
    res.redirect('/login')
    }
  } catch (error) {
    next(error);
  }
})


// CRUD Dosen
router.get('/dosen_create', ensureAuthenticated, async (req, res, next) => {
  try {
      let id = req.session.userId;
      let Data = await Model_Users.getId(id);
      if(Data.length > 0){
          res.render('dosen/create', {
              title: 'Create Dosen'
          })
      } else {
          req.flash('error','Anda harus login terlebih dahulu');
          res.redirect('/login')
      }
  } catch (error) {
      req.flash('error','Akses Ditolak');
      res.redirect('/')
  }
})

router.post('/dosen_store', async (req, res, next) => {
  try {
      let {Nama, NIP, jenis_kelamin, email, password} = req.body;
      
      // Create user first
      let enkripsi = await bcrypt.hash(password, 10);
      let userData = {
          email,
          password: enkripsi,
          level_users: 2
      };
      let userId = await Model_Users.Store(userData);

      let dosenData = {
          Nama,
          NIP, 
          jenis_kelamin, 
          id_users: userId
      }
      await Model_Dosen.Store(dosenData);
      
      req.flash('success','Berhasil Menambah Data Dosen!');
      res.redirect('/admin/data_dosen');
  } catch (error) {
      console.error(error);
      req.flash('error', 'Terjadi kesalahan pada fungsi');
      res.redirect('/admin/data_dosen');
  }
});

router.get('/dosen_edit/:id_d', ensureAuthenticated, async (req, res, next) => {
    let id = req.session.userId;
    let Data = await Model_Users.getId(id);
    let allUsers = await Model_Users.getAll();
    if(Data.length > 0){
        const id_d = req.params.id_d
        let rows = await Model_Dosen.getId(id_d);
        res.render('dosen/edit', {
            id_d: rows[0].id_dosen,
            Nama: rows[0].Nama, 
            NIP: rows[0].NIP, 
            jenis_kelamin: rows[0].jenis_kelamin, 
            id_users: rows[0].id_users,
            data: allUsers
        })
    }
})

router.post('/dosen_update/:id_d', async (req, res, next) => {
    try {
        const id_d = req.params.id_d;
        const { Nama, NIP, jenis_kelamin, id_users } = req.body;
        const data = { Nama, NIP, jenis_kelamin, id_users };
        await Model_Dosen.Update(id_d, data);
        req.flash('success','Berhasil Merubah Dosen!');
        res.redirect('/admin/data_dosen');
    } catch (error) {
        req.flash('error','Terjadi kesalahan pada fungsi');
        res.redirect('/admin/data_dosen');
    }
})

router.get('/dosen_delete/:id_d', ensureAuthenticated, async (req, res, next) => {
    try {
        const id_d = req.params.id_d;
        await Model_Dosen.Delete(id_d);
        
        req.flash('success','Berhasil Menghapus data Dosen');
        res.redirect('/admin/data_dosen');
    } catch (error) {
        req.flash('error','Terjadi kesalahan pada fungsi');
        res.redirect('/admin/data_dosen')
    }
})


// CRUD Mahasiswa
router.get('/mhs_create', ensureAuthenticated, async (req, res, next) => {
  try {
      let id = req.session.userId;
      let Data = await Model_Users.getId(id);
      let kelas = await Model_Kelas.getAll();
      if(Data.length > 0){
          res.render('mahasiswa/create', {
              title: 'Create Mahasiswa',
              kelas
          })
      } else {
          req.flash('error','Anda harus login terlebih dahulu');
          res.redirect('/login')
      }
  } catch (error) {
      req.flash('error','Akses Ditolak');
      res.redirect('/')
  }
})

router.post('/mhs_store', async (req, res, next) => {
  try {
      let {Nama, NRP, jenis_kelamin, email, password, id_kelas} = req.body;
      
      // Create user first
      let enkripsi = await bcrypt.hash(password, 10);
      let userData = {
          email,
          password: enkripsi,
          level_users: 3
      };
      let userId = await Model_Users.Store(userData);

      let mahasiswaData = {
          Nama, 
          NRP, 
          jenis_kelamin, 
          id_users: userId,
          id_kelas
      }
      await Model_Mahasiswa.Store(mahasiswaData);
      
      req.flash('success','Berhasil Menambah Data Mahasiswa!');
      res.redirect('/admin/data_mahasiswa');
  } catch (error) {
      console.error(error);
      req.flash('error', 'Terjadi kesalahan pada fungsi');
      res.redirect('/admin/data_mahasiswa');
  }
});

router.get('/mhs_edit/:id_mhs', ensureAuthenticated, async (req, res, next) => {
  let id = req.session.userId;
  let Data = await Model_Users.getId(id);
  let allKelas = await Model_Kelas.getAll();
  let allUsers = await Model_Users.getAll();
  if(Data.length > 0){
      const id_mhs = req.params.id_mhs
      let rows = await Model_Mahasiswa.getId(id_mhs);
      res.render('mahasiswa/edit', {
          id_mhs: rows[0].id_mahasiswa,
          Nama: rows[0].Nama, 
          NRP: rows[0].NRP, 
          jenis_kelamin: rows[0].jenis_kelamin, 
          id_users: rows[0].id_users,
          id_kelas: rows[0].id_kelas,
          data: allUsers,
          kelas: allKelas
      })
  }
})

router.post('/mhs_update/:id_mhs', async (req, res, next) => {
  try {
      const id_mhs = req.params.id_mhs;
      const { Nama, NRP, jenis_kelamin, id_users, id_kelas } = req.body;
      const data = { Nama, NRP, jenis_kelamin, id_users, id_kelas };
      await Model_Mahasiswa.Update(id_mhs, data);
      req.flash('success','Berhasil Merubah Mahasiswa!');
      res.redirect('/admin/data_mahasiswa');
  } catch (error) {
      req.flash('error','Terjadi kesalahan pada fungsi');
      res.redirect('/admin/data_mahasiswa');
  }
})

router.get('/mhs_delete/:id_mhs', ensureAuthenticated, async (req, res, next) => {
  try {
      const id_mhs = req.params.id_mhs;
      await Model_Mahasiswa.Delete(id_mhs);
      
      req.flash('success','Berhasil Menghapus data Mahasiswa');
      res.redirect('/admin/data_mahasiswa');
  } catch (error) {
      req.flash('error','Terjadi kesalahan pada fungsi');
      res.redirect('/admin/data_mahasiswa')
  }
})

// CRUD JADWAL
router.get('/jadwal_create', ensureAuthenticated, async (req, res, next) =>{
  try {
    let id = req.session.userId
    let Data = await Model_Users.getId(id)
    let allMatkul = await Model_Matakuliah.getAll();
    let allKelas = await Model_Kelas.getAll();
    let allDosen = await Model_Dosen.getAll();
    let allRuangan = await Model_Ruangan.getAll();
    if(Data.length > 0){
      res.render('jadwal/create',{
        title: 'Create Jadwal',
        matakuliah: allMatkul,
        kelas: allKelas,
        dosen: allDosen,
        ruangan: allRuangan
      })
    }else{
      req.flash('error','User tidak ditemukan !!');
      res.redirect('/login')
    }
  } catch (error) {
    req.flash('error','Anda tidak bisa mengakses halaman ini');
    res.redirect('/') 
  }
})

router.post('/jadwal_store', async (req, res, next) => {
  try {
      let {hari, waktu_mulai, waktu_selesai, id_matakuliah, id_kelas, id_dosen, id_ruangan} = req.body;
      let data = {
          hari, waktu_mulai, waktu_selesai, id_matakuliah, id_kelas, id_dosen, id_ruangan
      }
      await Model_Jadwal.Store(data);
      req.flash('success','Berhasil Menambah Data!');
      res.redirect('/admin/data_jadwal');
  } catch (error) {
      req.flash('error', 'Terjadi kesalahan pada fungsi');
      res.redirect('/admin/data_jadwal');
  }
});

router.get('/jadwal_edit/:id_jd', ensureAuthenticated, async (req, res, next) =>{
  try {
    let id = req.session.userId
    let Data = await Model_Users.getId(id)
    let allMatkul = await Model_Matakuliah.getAll();
    let allKelas = await Model_Kelas.getAll();
    let allDosen = await Model_Dosen.getAll();
    let allRuangan = await Model_Ruangan.getAll();
    if(Data.length > 0){
      const id_jd = req.params.id_jd;
      let rows = await Model_Jadwal.getIdJadwal(id_jd);
      res.render('jadwal/edit',{
        title: 'Edit Jadwal',
        id_jd: rows[0].id_jadwal,
        hari: rows[0].hari,
        waktu_mulai: rows[0].waktu_mulai,
        waktu_selesai: rows[0].waktu_selesai,
        id_matakuliah: rows[0].id_matakuliah,
        id_kelas: rows[0].id_kelas,
        id_dosen: rows[0].id_dosen,
        id_ruangan: rows[0].id_ruangan,
        matakuliah: allMatkul,
        kelas: allKelas,
        dosen: allDosen,
        ruangan: allRuangan
      })
    }else{
      req.flash('error','User tidak ditemukan !!');
      res.redirect('/login')
    }
  } catch (error) {
    req.flash('error','Anda tidak bisa mengakses halaman ini');
    res.redirect('/') 
  }
})

router.post('/jadwal_update/:id_jd', async (req, res, next) => {
  try {
      const id_jd = req.params.id_jd;
      const { hari, waktu_mulai, waktu_selesai, id_matakuliah, id_kelas, id_dosen, id_ruangan } = req.body;
      const data = { hari, waktu_mulai, waktu_selesai, id_matakuliah, id_kelas, id_dosen, id_ruangan };
      await Model_Jadwal.Update(id_jd, data);
      req.flash('success','Berhasil Merubah Jadwal!');
      res.redirect('/admin/data_jadwal');
  } catch (error) {
      req.flash('error','Terjadi kesalahan pada fungsi');
      res.redirect('/admin/data_jadwal');
  }
})

router.get('/jadwal_delete/:id_jd', ensureAuthenticated, async (req, res, next) => {
  try {
      const id_jd = req.params.id_jd;
      await Model_Jadwal.Delete(id_jd);
      req.flash('success','Berhasil Menghapus data Jadwal');
      res.redirect('/admin/data_jadwal');
  } catch (error) {
      req.flash('error','Terjadi kesalahan pada fungsi');
      res.redirect('/admin/data_jadwal')
  }
})

module.exports = router;

