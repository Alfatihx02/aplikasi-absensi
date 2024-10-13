var express = require('express');
var router = express.Router();
const Model_Prodi = require('../model/Model_Prodi');
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
        let rows = await Model_Jurusan.getAll();
        if(Data.length > 0){
            res.render('prodi/create',{
                title: 'Create Prodi',
                data: rows
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
        let { nama_prodi, id_jurusan } = req.body;
        let data = {
             nama_prodi, 
             id_jurusan 
        };
        await Model_Prodi.Store(data);
        req.flash('success', 'Berhasil menambah Prodi!');
        res.redirect('/admin/data_prodi');
    } catch (error) {
        req.flash('error', 'Terjadi kesalahan pada fungsi');
        res.redirect('/admin/data_prodi');
    }
});

router.get('/edit/:id_p', ensureAuthenticated, async (req, res, next) => {
    let id = req.session.userId;
    let Data = await Model_Users.getId(id);
    let allJurusan = await Model_Jurusan.getAll();
    if(Data.length > 0){
        const id_p = req.params.id_p
        let rows = await Model_Prodi.getId(id_p);
        res.render('prodi/edit', {
             id_p: rows[0].id_prodi,
             nama_prodi: rows[0].nama_prodi, 
             id_jurusan: rows[0].id_jurusan,
             data: allJurusan
        })
    }
})

router.post('/update/:id_p', async (req, res, next) => {
    try {
        const id_p = req.params.id_p;
        const {  nama_prodi, id_jurusan  } = req.body;
        const data = {  nama_prodi, id_jurusan  };
        await Model_Prodi.Update(id_p, data);
        req.flash('success','Berhasil Merubah Prodi!');
        res.redirect('/admin/data_prodi');
    } catch (error) {
        req.flash('error','Terjadi kesalahan pada fungsi');
        res.redirect('/admin/data_prodi');
    }
});

router.get('/delete/:id_p', ensureAuthenticated, async (req, res, next) => {
    try {
        const id_p = req.params.id_p;
        await Model_Prodi.Delete(id_p);
        
        req.flash('success','Berhasil Menghapus data prodi');
        res.redirect('/admin/data_prodi');
    } catch (error) {
        req.flash('error','Terjadi kesalahan pada fungsi');
        res.redirect('/admin/data_prodi')
    }
})

module.exports = router;