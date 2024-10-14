const connection = require('../config/database'); 

class Model_Presensi {
    static async getAll(){
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM presensi ORDER BY id_presensi DESC', (err, rows) => {
                if(err){
                    reject(err);
                } else {
                    resolve(rows);
                    console.log(rows);
                }
            });
        });
    }

    static async Store(Data){
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO presensi SET ?', Data, function(err, result){
                if(err){
                    reject(err);
                    console.log(err);
                } else {
                    resolve(result);
                }
            })
        });
    }

    static async getByIdJadwalAndIdMahasiswa(id_j, id_mhs){
        return new promiseImpl((resolve, reject) =>{
            connection.query('SELECT p.pertemuan, hp.waktu_presensi FROM histori_presensi hp JOIN presensi p ON hp.id_presensi = p.id_presensi JOIN mahasiswa m ON hp.id_mahasiswa = m.id_mahasiswa WHERE hp.id_presensi = ? AND hp.id_mahasiswa = ? ',[id_j, id_mhs], (err, rows)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(rows)
                    console.log('data: ', rows);
                }
            } )
        })
    }

    static async getLastPertemuanByJadwal(id_jadwal) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT MAX(pertemuan) AS pertemuan_terakhir FROM presensi WHERE id_jadwal = ?', 
                [id_jadwal], 
                (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows[0].pertemuan_terakhir);
                    }
                }
            );
        });
    }
    static async getPresensiStatusByJadwal(id_jadwal) {
        return new Promise((resolve, reject) => {
            connection.query(
                'SELECT id_presensi, status FROM presensi WHERE id_jadwal = ? ORDER BY waktu_dibuka DESC LIMIT 1', 
                [id_jadwal], 
                (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        if(rows.length > 0){
                            if(rows[0].status === 'dibuka'){
                                resolve('dibuka');
                            }else{
                                resolve('ditutup');
                            }
                        }else{ resolve('belum dibuka'); }
                    }
                }
            );
        });
    }
    
    static async getActivatePresensiByJadwal(id_jadwal) {
        return new Promise((resolve, reject) => {
            connection.query(
                'SELECT * FROM presensi WHERE id_jadwal = ? AND status = ? ORDER BY waktu_dibuka DESC LIMIT 1', 
                [id_jadwal, 'dibuka'], 
                (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows.length > 0 ? rows[0] : null);
                    }
                }
            );
        });
    }



    static async getId(id){
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM presensi WHERE id_presensi = ?', [id], (err, rows) => {
                if(err) {
                    reject(err);
                }else if(rows.length === 0) {
                    resolve(null);
                } else {
                    resolve(rows);
                    console.log(rows[0]);
                }
            })
        })
    }

    static async getAllByIdJadwal(id_jadwal) {
        return new Promise((resolve, reject) => {
          connection.query(
            'SELECT * FROM presensi WHERE id_jadwal = ? ORDER BY waktu_dibuka DESC',
            [id_jadwal],
            (err, rows) => {
              if (err) {
                reject(err);
              } else {
                resolve(rows);
              }
            }
          );
        });
      }

    static async getIdByIdJadwal(id){
        return new Promise((resolve, reject) => {
            connection.query('SELECT id_presensi FROM presensi WHERE id_jadwal = ?', [id], (err, rows) => {
                if(err) {
                    reject(err);
                }else if(rows.length === 0) {
                    resolve(null);
                } else {
                    resolve(rows.length > 0 ? rows[0].id_presensi : null);
                    console.log(rows);
                }
            })
        })
    }

    static async getOpenPresensiByJadwal(id_jadwal) {
        return new Promise((resolve, reject) => {
          connection.query(
            'SELECT * FROM presensi WHERE id_jadwal = ? AND status = "dibuka" ORDER BY waktu_dibuka DESC LIMIT 1',
            [id_jadwal],
            (err, rows) => {
              if (err) {
                reject(err);
              } else {
                resolve(rows.length > 0 ? rows[0] : null);
              }
            }
          );
        });
      }

      static async Update(id, Data) {
        return new Promise((resolve, reject) => {
          connection.query('UPDATE presensi SET ? WHERE id_presensi = ?', [Data, id], function(err, result) {
            if (err) {
              reject(err);
            } else {
              resolve(result.affectedRows > 0);
            }
          });
        });
      }
    

    static async Delete(id) {
        return new Promise((resolve, reject) => {
            connection.query('DELETE FROM presensi WHERE id_presensi = ?', [id], function(err, result){
                if(err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            })
        });
    }
}

module.exports = Model_Presensi;
