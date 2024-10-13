const connection = require('../config/database'); 

class Model_Tugas {
    static async getAll(){
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM tugas ORDER BY id_tugas DESC', (err, rows) => {
                if(err){
                    reject(err);
                } else {
                    resolve(rows);
                    console.log(rows);
                }
            });
        });
    }

    static async getAllByJadwal(id_jd){
        console.log('Received id_jd:', id_jd);
        return new Promise((resolve, reject) =>{
            
            connection.query('SELECT * FROM tugas WHERE id_jadwal = ? ', [id_jd], (err, rows) =>{
                if(err){
                    reject(err);
                    console.log('all b jadwal: ', err);
                }else{
                    resolve(rows);
                    console.log('data all by jadwal: ', rows)
                }
            })
        })
    }

    static async Store(Data){
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO tugas SET ?', Data, function(err, result){
                if(err){
                    reject(err);
                    console.log(err);
                } else {
                    resolve(result);
                }
            })
        });
    }


    static async getId(id){
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM tugas WHERE id_tugas = ?', [id], (err, rows) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(rows);
                    console.log(rows);
                }
            })
        })
    }
    static async getById(id){
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM tugas WHERE id_tugas = ?', [id], (err, rows) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(rows[0]);
                    console.log(rows[0]);
                }
            })
        })
    }

    static async getByIdMahasiswa(id_mahasiswa){
        return new Promise((resolve, reject) => {
            connection.query(`SELECT t.id_tugas, t.judul_tugas, t.file_tugas, mk.nama_matakuliah, j.id_jadwal, j.hari, j.waktu_mulai, j.waktu_selesai, p.id_pengumpulan, p.file_pengumpulan FROM tugas t JOIN jadwal j ON t.id_jadwal = j.id_jadwal JOIN matakuliah mk ON j.id_matakuliah = mk.id_matakuliah JOIN kelas k ON j.id_kelas = k.id_kelas JOIN mahasiswa mhs ON k.id_kelas = mhs.id_kelas LEFT JOIN pengumpulan p ON t.id_tugas = p.id_tugas AND p.id_mahasiswa = mhs.id_mahasiswa WHERE mhs.id_mahasiswa = ? ORDER BY j.id_jadwal`, [id_mahasiswa], (err, rows) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(rows);
                    console.log(rows);
                }
            })
        })
    }

    static async getByIdJadwal(id_j){
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM tugas WHERE id_jadwal = ?', [id_j], (err, rows) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(rows);
                    console.log(rows);
                }
            })
        })
    }


    static async getTugasByIdJadwal(id_jadwal) {
        return new Promise((resolve, reject) => {
          connection.query('SELECT * FROM tugas WHERE id_jadwal = ?', [id_jadwal], (err, results) => {
            if (err) {
              reject(err);
            } else {
              resolve(results);
              console.log('Tugas Ditemukan:', results[0]);
            }
          });
        });
    }


    static async Update(id, Data) {
        return new Promise((resolve, reject) => {
            connection.query('UPDATE tugas SET ? WHERE id_tugas = ?', [Data, id], function(err, result){
                if(err){
                    console.error('Error updating tugas:', err);
                    reject(err);
                } else {
                    console.log('Update result:', result);
                    resolve(result);
                }
            })
        });
    }

    static async Delete(id) {
        return new Promise((resolve, reject) => {
            connection.query('DELETE FROM tugas WHERE id_tugas = ?', [id], function(err, result){
                if(err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            })
        });
    }
}

module.exports = Model_Tugas;
