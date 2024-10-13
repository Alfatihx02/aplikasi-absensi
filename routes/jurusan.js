var express = require('express');
var router = express.Router();
const Model_Jurusan = require('../model/Model_Jurusan');
const Model_Users = require('../model/Model_User');

const ensureAuthenticated = (req, res, next) => {
    if (req.session.userId && req.session.level_users == 1) {
      return next();
    } else {
      req.flash('error','Anda tida memiliki izin untuk halaman ini !!');
      res.redirect('/login')
    }
  };


router.get('/create', ensureAuthenticated, async (req, res, next) => {
    try {
        let id = req.session.userId;
        let Data = await Model_Users.getId(id);
        if(Data.length > 0){
            res.render('jurusan/create',{
                title: 'Create Jurusan',
            });
        }else{
            req.flash('error','Anda harus login terlebih dahulu');
            res.redirect('/login')
        }
    } catch (error) {
        req.flash('error','Akses Ditolak');
        res.redirect('/')
    }
})

router.post('/store', async (req, res, next) => {
    try {
        let {nama_jurusan} = req.body;
        let data = {
            nama_jurusan
        };
        await Model_Jurusan.Store(data);
        req.flash('success', 'Berhasil menambah jurusan!');
        res.redirect('/admin/data_jurusan')
    } catch (error) {
        req.flash('error', 'Terjadi kesalahan pada fungsi');
        res.redirect('/admin/data_jurusan')
    }
})

router.get('/edit/:id_j', ensureAuthenticated, async (req, res, next) => {
    try {
        let id = req.session.userId;
        let id_j = req.params.id_j;
        let Data = await Model_Users.getId(id);
        if(Data.length > 0){
            let rows = await Model_Jurusan.getId(id_j);
            res.render('jurusan/edit', {
                id_j: rows[0].id_jurusan,
                nama_jurusan: rows[0].nama_jurusan
            })
        }else{
            req.flash('error','akun tidak ditemukan');
            res.redirect('/login')
        }
    } catch (error) {
        res.status(401).json('')
    }
})

router.post('/update/:id_j', async (req, res, next) => {
    try {
        let id_j = req.params.id_j;
        const { nama_jurusan } = req.body;
        const data = { nama_jurusan };
        await Model_Jurusan.Update(id_j, data);
        req.flash('success','Berhasil Merubah Jurusan!');
        res.redirect('/admin/data_jurusan');
    } catch (error) {
        req.flash('error','Terjadi kesalahan pada fungsi');
        res.redirect('/admin/data_jurusan');
    }
})

router.get('/delete/:id_j', ensureAuthenticated, async (req, res, next) => {
    try {
        const id_j = req.params.id_j;
        await Model_Jurusan.Delete(id_j);
        
        req.flash('success','Berhasil Menghapus data Jurusan');
        res.redirect('/admin/data_jurusan');
    } catch (error) {
        req.flash('error','Terjadi kesalahan pada fungsi');
        res.redirect('/admin/data_jurusan')
    }
})

module.exports = router;