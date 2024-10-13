const connection = require('../config/database'); 

class Model_Materi {
    static async getAll(){
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM materi ORDER BY id_materi DESC', (err, rows) => {
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
            connection.query('INSERT INTO materi SET ?', Data, function(err, result){
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
            connection.query('SELECT * FROM materi WHERE id_materi = ?', [id], (err, rows) => {
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
            connection.query('SELECT * FROM materi WHERE id_materi = ?', [id], (err, rows) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(rows[0]);
                    console.log(rows[0]);
                }
            })
        })
    }
    static async getByIdJadwal(id_jadwal){
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM materi WHERE id_jadwal = ?', [id_jadwal], (err, results) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(results);
                }
              });
        })
    }

    static async getByIdMahasiswa(id_mahasiswa){
        return new Promise((resolve, reject) => {
            connection.query(`
                SELECT m.id_materi, m.file_materi, m.keterangan, mk.nama_matakuliah, j.id_jadwal, j.hari, j.waktu_mulai, j.waktu_selesai FROM materi m JOIN jadwal j ON m.id_jadwal = j.id_jadwal JOIN matakuliah mk ON j.id_matakuliah = mk.id_matakuliah JOIN kelas k ON j.id_kelas = k.id_kelas JOIN mahasiswa mhs ON k.id_kelas = mhs.id_kelas WHERE mhs.id_mahasiswa = ? ORDER BY j.id_jadwal
            `, [id_mahasiswa], (err, rows) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(rows);
                    console.log(rows);
                }
            })
        });
    }
    

    static async Update(id, Data) {
        return new Promise((resolve, reject) => {
            connection.query('UPDATE materi SET ? WHERE id_materi = ?', [Data, id], function(err, result){
                if(err){
                    console.error('Error updating materi:', err);
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
            connection.query('DELETE FROM materi WHERE id_materi = ?', [id], function(err, result){
                if(err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            })
        });
    }
}

module.exports = Model_Materi;
