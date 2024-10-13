var express = require('express');
var router = express.Router();
const Model_Matakuliah = require('../model/Model_Matakuliah');
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
            res.render('matakuliah/create',{
                title: 'Create Matakuliah',
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
        let {nama_matakuliah} = req.body;
        let data = {
            nama_matakuliah
        };
        await Model_Matakuliah.Store(data);
        req.flash('success', 'Berhasil menambah matakuliah!');
        res.redirect('/admin/data_matakuliah')
    } catch (error) {
        req.flash('error', 'Terjadi kesalahan pada fungsi');
        res.redirect('/admin/data_matakuliah')
    }
})

router.get('/edit/:id_mk', ensureAuthenticated, async (req, res, next) => {
    let id = req.session.userId;
    let Data = await Model_Users.getId(id);
    if(Data.length > 0){
        const id_mk = req.params.id_mk
        let rows = await Model_Matakuliah.getId(id_mk);
        res.render('matakuliah/edit', {
            id_mk: rows[0].id_matakuliah,
            nama_matakuliah: rows[0].nama_matakuliah
        })
    }
})

router.post('/update/:id_mk', async (req, res, next) => {
    try {
        const id_mk = req.params.id_mk;
        const { nama_matakuliah } = req.body;
        const data = { nama_matakuliah };
        await Model_Matakuliah.Update(id_mk, data);
        req.flash('success','Berhasil Merubah matakuliah!');
        res.redirect('/admin/data_matakuliah');
    } catch (error) {
        req.flash('error','Terjadi kesalahan pada fungsi');
        res.redirect('/admin/data_matakuliah');
    }
})

router.get('/delete/:id_mk', ensureAuthenticated, async (req, res, next) => {
    try {
        const id_mk = req.params.id_mk;
        await Model_Matakuliah.Delete(id_mk);
        
        req.flash('success','Berhasil Menghapus data matakuliah');
        res.redirect('/admin/data_matakuliah');
    } catch (error) {
        req.flash('error','Terjadi kesalahan pada fungsi');
        res.redirect('/admin/data_matakuliah')
    }
})

module.exports = router;