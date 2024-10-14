var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const Model_Users = require('../model/Model_User');
const Model_Dosen = require('../model/Model_Dosen');
const Model_Mahasiswa = require('../model/Model_Mahasiswa');

const ensureAuthenticated = async (req, res, next) => {
  if (req.session.userId && req.session.level_users == 1) {
    return next();
  } else {
    const userCount = await Model_Users.count();;
    if(userCount === 0){
      return next();
    }
    req.flash('error','Anda tidak memiliki izin ke halaman ini');
    res.redirect('/')
  }
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hautian' });
});

router.get('/register',ensureAuthenticated, function(req, res, next) {
  res.render('auth/register');
})

router.get('/login', async function(req, res, next) {
  let user = await Model_Users.count();
  res.render('auth/login',{
    rows: user
  });
})

router.post('/saveusers', async (req, res) => {
  let { email, password, level_users } = req.body;
  let enkripsi = await bcrypt.hash(password, 10);
  const existingUser = await Model_Users.findByEmail(email)
  if(existingUser){
    req.flash('error','Email sudah terdaftar');
    res.redirect('/register');
  }
  let Data = {
    email,
    password: enkripsi,
    level_users
  };
  await Model_Users.Store(Data);
  req.flash('success', 'Berhasil Register');
  res.redirect('/admin/data_user')
});


router.post('/log', async (req, res) => {
  try {
    let { email, password } = req.body;
    let Data = await Model_Users.Login(email);
    
    if (Data.length > 0) {
      let enkripsi = Data[0].password;
      let cek = await bcrypt.compare(password, enkripsi);
      
      if (cek) {
        req.session.userId = Data[0].id_users;
        req.session.level_users = Data[0].level_users;

        if (Data[0].level_users == 1) {               // admin
          req.flash('success', 'Berhasil login');
          res.redirect('/admin/data_user');
        } else if (Data[0].level_users == 2) {        // dosen
          const dataDosen = await Model_Dosen.getIdDosenFromUserId(req.session.userId);
          if (dataDosen) {
            req.session.id_dosen = dataDosen.id_dosen;
            req.flash('success', 'Berhasil login');
            res.redirect('/dosen/');
          } else {
            req.flash('error', 'Data dosen tidak ditemukan');
            res.redirect('/login');
          }
        } else if (Data[0].level_users == 3) {        // mahasiswa
          const dataMahasiswa = await Model_Mahasiswa.getIdFromUserId(req.session.userId);
          if (dataMahasiswa) {
            req.session.id_mahasiswa = dataMahasiswa.id_mahasiswa;
            req.flash('success', 'Berhasil login');
            res.redirect('/mahasiswa/');
          } else {
            req.flash('error', 'Data mahasiswa tidak ditemukan');
            res.redirect('/login');
          }
        } else {
          req.flash('error', 'Level pengguna tidak valid');
          res.redirect('/login');
        }
      } else {
        req.flash('error', 'Email atau password salah');
        res.redirect('/login');
      }
    } else {
      req.flash('error', 'Akun tidak ditemukan');
      res.redirect('/login');
    }
  } catch (err) {
    console.error(err);
    req.flash('error', 'Terjadi kesalahan saat login');
    res.redirect('/login');
  }
});

router.get('/logout', function(req, res) {
  req.session.userId = null;
  req.session.level_users = null;
  res.redirect('/login');
});

router.get('/delete/:id', ensureAuthenticated, async(req, res) => {
  try {
    let id = req.params.id
    await Model_Users.Delete(id)
  
    req.flash('success','berhasil menghapus user');
    res.redirect('/admin/data_user');
    
  } catch (error) {
    req.flash('error','Terjadi kesalahan pada fungsi');
    res.redirect('/admin/data_user');
  }
})



module.exports = router;