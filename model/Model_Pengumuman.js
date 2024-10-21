const connection = require('../config/database'); 

class Model_Pengumuman {
    static async getAll(){
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM pengumuman ORDER BY id_pengumuman DESC', (err, rows) => {
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
            connection.query('INSERT INTO pengumuman SET ?', Data, function(err, result){
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
            connection.query('SELECT * FROM pengumuman WHERE id_pengumuman = ?', [id], (err, rows) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(rows);
                    console.log(rows);
                }
            })
        })
    }
    static async getByIdJadwal(id_jadwal){
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM pengumuman WHERE id_jadwal = ?', [id_jadwal], (err, result) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(result);
                    console.log(result);
                }
            })
        })
    }

    static async getByIdMahasiswa(id_mahasiswa) {
        return new Promise((resolve, reject) => {
            connection.query(`
                SELECT p.id_pengumuman, p.judul, p.keterangan, j.id_jadwal, mk.nama_matakuliah
                FROM pengumuman p
                JOIN jadwal j ON p.id_jadwal = j.id_jadwal
                JOIN matakuliah mk ON j.id_matakuliah = mk.id_matakuliah
                JOIN kelas k ON j.id_kelas = k.id_kelas
                JOIN mahasiswa mhs ON k.id_kelas = mhs.id_kelas
                WHERE mhs.id_mahasiswa = ?
                ORDER BY j.hari, j.waktu_mulai
            `, [id_mahasiswa], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
    
    static async Update(id, Data) {
        return new Promise((resolve, reject) => {
            connection.query('UPDATE pengumuman SET ? WHERE id_pengumuman = ?', [Data, id], function(err, result){
                if(err){
                    console.error('Error updating pengumuman:', err);
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
            connection.query('DELETE FROM pengumuman WHERE id_pengumuman = ?', [id], function(err, result){
                if(err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            })
        });
    }
}

module.exports = Model_Pengumuman;
