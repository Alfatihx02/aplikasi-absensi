const connection = require('../config/database'); 

class Model_Mahasiswa {
    static async getAll(){
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM mahasiswa ORDER BY id_mahasiswa DESC', (err, rows) => {
                if(err){
                    reject(err);
                } else {
                    resolve(rows);
                    console.log(rows);
                }
            });
        });
    }

    static async getAllMhs(){
        return new Promise((resolve, reject) => {
            connection.query('SELECT m.*, k.nama_kelas, u.email FROM mahasiswa m JOIN kelas k ON m.id_kelas = k.id_kelas JOIN users u ON m.id_users = u.id_users ORDER BY id_mahasiswa DESC', (err, rows) => {
                if(err){
                    reject(err);
                } else {
                    resolve(rows);
                    console.log(rows);
                }
            });
        });
    }

    static async getMhsByIdjadwal(id_jadwal){
        return new Promise((resolve, reject) => {
            connection.query(`SELECT DISTINCT m.Nama as nama_mahasiswa, m.Nrp, m.jenis_kelamin 
                FROM mahasiswa m 
                JOIN kelas k ON m.id_kelas = k.id_kelas 
                JOIN jadwal j ON j.id_kelas = k.id_kelas 
                WHERE j.id_jadwal = ?`,[id_jadwal], (err, rows) => {
                if(err){
                    reject(err);
                } else {
                    resolve(rows);
                    console.log('Data mahasiswa: ',rows);
                }
            });
        });
    }


    static async getAllPresensiMhs(){
        return new Promise((resolve, reject) => {
            connection.query('SELECT m.Nama, m.NRP, hp.waktu_presensi FROM mahasiswa m JOIN histori_presensi hp ON m.id_mahasiswa = hp.id_mahasiswa JOIN presensi p WHERE hp.id_presensi = p.id_presensi', (err, rows) => {
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
            connection.query('INSERT INTO mahasiswa SET ?', Data, function(err, result){
                if(err){
                    reject(err);
                    console.log(err);
                } else {
                    resolve(result);
                }
            })
        });
    }



    static async getByNRP(nrp) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM mahasiswa WHERE NRP = ?', [nrp], function(err, result){
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            })
        })
    }
    static async getIdFromUserId(idUser) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT id_mahasiswa FROM mahasiswa WHERE id_users = ?', [idUser], (err, rows) => {
                if (err) {
                    reject(err);
                } else if (rows.length === 0) {
                    reject(new Error('Mahasiswa not found'));
                } else {
                    resolve(rows[0].id_mahasiswa); // return id_Mahasiswa
                }
            });
        });
    }

    static async getId(id){
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM mahasiswa WHERE id_mahasiswa = ?', [id], (err, rows) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(rows);
                    console.log(rows);
                }
            })
        })
    }

    static async Update(id, Data) {
        return new Promise((resolve, reject) => {
            connection.query('UPDATE mahasiswa SET ? WHERE id_mahasiswa = ?', [Data, id], function(err, result){
                if(err){
                    console.error('Error updating Mahasiswa:', err);
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
            connection.query('DELETE FROM mahasiswa WHERE id_mahasiswa = ?', [id], function(err, result){
                if(err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            })
        });
    }
}

module.exports = Model_Mahasiswa;
