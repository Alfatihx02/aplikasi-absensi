var express = require('express');
var router = express.Router();
const Model_Users = require('../model/Model_User');

/* GET users listing. */
router.get('/', async function(req, res, next) {
  try {
    let id = req.session.userId;
    let Data = await Model_Users.getId(id);
    if(Data.length > 0) {
      // Tambahkan kondisi pengecekan level
        res.render('users/index', {
          title: 'users Home',
        });
      
      // Akhir kondisi
    } else {
      res.status(401).json({ error: 'User tidak ada' });
    }
  } catch (error) {
    console.log(error);
    res.status(501).json('Butuh akses login');
  }
});

module.exports = router;

