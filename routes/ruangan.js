var express = require('express');
var router = express.Router();
const Model_Ruangan = require('../model/Model_Ruangan');
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
            res.render('ruangan/create',{
                title: 'Create Ruangan',
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
        let {nama_ruangan} = req.body;
        let data = {
            nama_ruangan
        };
        await Model_Ruangan.Store(data);
        req.flash('success', 'Berhasil menambah ruangan!');
        res.redirect('/admin/data_ruangan')
    } catch (error) {
        req.flash('error', 'Terjadi kesalahan pada fungsi');
        res.redirect('/admin/data_ruangan')
    }
})

router.get('/edit/:id_r', ensureAuthenticated, async (req, res, next) => {
    let id = req.session.userId;
    let id_r = req.params.id_r
    let Data = await Model_Users.getId(id);
    if(Data.length > 0){
        
        let rows = await Model_Ruangan.getId(id_r);
        res.render('ruangan/edit', {
            id_r: rows[0].id_ruangan,
            nama_ruangan: rows[0].nama_ruangan
        })
    }
})

router.post('/update/:id_r', ensureAuthenticated, async (req, res, next) => {
    try {
        const id_r = req.params.id_r;
        const { nama_ruangan } = req.body;
        const data = { nama_ruangan };
        await Model_Ruangan.Update(id_r, data);
        req.flash('success','Berhasil Merubah ruangan!');
        res.redirect('/admin/data_ruangan');
    } catch (error) {
        req.flash('error','Terjadi kesalahan pada fungsi');
        res.redirect('/admin/data_ruangan');
    }
})

router.get('/delete/:id_r', ensureAuthenticated, async (req, res, next) => {
    try {
        const id_r = req.params.id_r;
        await Model_Ruangan.Delete(id_r);
        
        req.flash('success','Berhasil Menghapus data ruangan');
        res.redirect('/admin/data_ruangan');
    } catch (error) {
        req.flash('error','Terjadi kesalahan pada fungsi');
        res.redirect('/admin/data_ruangan')
    }
})

module.exports = router;