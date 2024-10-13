var express = require('express');
var router = express.Router();
const Model_Kelas = require('../model/Model_Kelas.js');
const Model_Users = require('../model/Model_User');
const Model_Prodi = require('../model/Model_Prodi');

const ensureAuthenticated = (req, res, next) => {
    if (req.session.userId && req.session.level_users == 1) {
      return next();
    } else {
      req.flash('error','Anda tida memiliki izin untuk halaman ini !!');
      res.redirect('/login')
    }
  };

router.get('/create',ensureAuthenticated, async (req, res, next) => {
    try {
        let id = req.session.userId;
        let Data = await Model_Users.getId(id);
        let rows = await Model_Prodi.getAll();
        if(Data.length > 0){
            res.render('kelas/create',{
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
        let { nama_kelas, id_prodi } = req.body;
        let data = {
             nama_kelas, 
             id_prodi
        };
        await Model_Kelas.Store(data);
        req.flash('success', 'Berhasil menambah Prodi!');
        res.redirect('/admin/data_kelas');
    } catch (error) {
        req.flash('error', 'Terjadi kesalahan pada fungsi');
        res.redirect('/admin/data_kelas');
    }
});

router.get('/edit/:id_k', ensureAuthenticated, async (req, res, next) => {
    let id = req.session.userId;
    let Data = await Model_Users.getId(id);
    let allProdi = await Model_Prodi.getAll(); 
    if(Data.length > 0){
        const id_k = req.params.id_k
        let rows = await Model_Kelas.getId(id_k);
        res.render('kelas/edit', {
             id_k: rows[0].id_kelas,
             nama_kelas: rows[0].nama_kelas, 
             id_prodi: rows[0].id_prodi,
             data: allProdi
        })
    }
})

router.post('/update/:id_k', async (req, res, next) => {
    try {
        const id_k = req.params.id_k;
        const {  nama_kelas, id_prodi  } = req.body;
        const data = {  nama_kelas, id_prodi  };
        await Model_Kelas.Update(id_k, data);
        req.flash('success','Berhasil Merubah Prodi!');
        res.redirect('/admin/data_kelas');
    } catch (error) {
        req.flash('error','Terjadi kesalahan pada fungsi');
        res.redirect('/admin/data_kelas');
    }
});

router.get('/delete/:id_k', ensureAuthenticated, async (req, res, next) => {
    try {
        const id_k = req.params.id_k;
        await Model_Kelas.Delete(id_k);
        
        req.flash('success','Berhasil Menghapus data prodi');
        res.redirect('/admin/data_kelas');
    } catch (error) {
        req.flash('error','Terjadi kesalahan pada fungsi');
        res.redirect('/admin/data_kelas')
    }
})

module.exports = router;