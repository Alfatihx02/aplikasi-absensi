const connection = require('../config/database'); 

class Model_Jadwal {
    static async getAll(){
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM jadwal ORDER BY id_jadwal DESC', (err, rows) => {
                if(err){
                    reject(err);
                } else {
                    resolve(rows);
                    console.log(rows);
                }
            });
        });
    }

    static async getDetailJadwal(){
        return new Promise((resolve, reject) => {
            connection.query(`SELECT jd.*, mk.nama_matakuliah, k.nama_kelas, 
                d.Nama, r.nama_ruangan FROM jadwal jd JOIN matakuliah mk 
                ON jd.id_matakuliah = mk.id_matakuliah JOIN kelas k ON jd.id_kelas = k.id_kelas 
                JOIN dosen d ON jd.id_dosen = d.id_dosen JOIN ruangan r 
                ON jd.id_ruangan = r.id_ruangan ORDER BY id_jadwal DESC`, (err, rows) => {
                if(err){
                    reject(err);
                } else {
                    resolve(rows);
                    console.log(rows);
                }
            });
        });
    }

    static async getByIdDosen(idDosen){
        return new Promise((resolve, reject) => {
            connection.query(`SELECT jd.*, mk.nama_matakuliah, k.nama_kelas, r.nama_ruangan,
                 d.Nama as nama_dosen FROM jadwal jd JOIN matakuliah mk 
                 ON jd.id_matakuliah = mk.id_matakuliah JOIN kelas k ON jd.id_kelas = k.id_kelas
                  JOIN ruangan r ON jd.id_ruangan = r.id_ruangan JOIN dosen d 
                  ON jd.id_dosen = d.id_dosen WHERE jd.id_dosen = ?`, [idDosen], (err, rows) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(rows);
                    console.log(rows);
                }
            })
        })
    }

    static async getByIdMahasiswa(idMahasiswa){
        return new Promise((resolve, reject) => {
            connection.query(`SELECT jd.*, mk.nama_matakuliah, k.nama_kelas, r.nama_ruangan,
                d.Nama FROM jadwal jd JOIN matakuliah mk ON jd.id_matakuliah = mk.id_matakuliah
                JOIN kelas k ON jd.id_kelas = k.id_kelas JOIN ruangan r ON jd.id_ruangan = r.id_ruangan
                JOIN dosen d ON jd.id_dosen = d.id_dosen JOIN mahasiswa m 
                ON k.id_kelas = m.id_kelas WHERE m.id_mahasiswa  = ?`, [idMahasiswa], (err, rows) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(rows);
                    console.log(rows);
                }
            })
        })
    }

    static async checkJadwalExists(id_jadwal) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT COUNT(*) AS count FROM jadwal WHERE id_jadwal = ?',
                [id_jadwal], (err, rows) => {
                if (err) {
                    return reject(err);
                }
                resolve(rows[0].count > 0);
            });
        });
    }
    

    static async Store(Data){
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO jadwal SET ?', Data, function(err, result){
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
            connection.query(`SELECT j.*, mk.nama_matakuliah,  r.nama_ruangan, d.Nama, 
                d.NIP FROM jadwal j JOIN matakuliah mk ON j.id_matakuliah = mk.id_matakuliah 
                JOIN ruangan r ON r.id_ruangan = j.id_ruangan JOIN dosen d 
                ON j.id_dosen = d.id_dosen WHERE j.id_jadwal = ?`, [id], (err, rows) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(rows[0]);
                    console.log(rows);
                }
            })
        })
    }
    static async getIdJadwal(id){
        return new Promise((resolve, reject) => {
            connection.query(`SELECT j.*, mk.nama_matakuliah,  r.nama_ruangan, d.Nama, 
                d.NIP FROM jadwal j JOIN matakuliah mk ON j.id_matakuliah = mk.id_matakuliah 
                JOIN ruangan r ON r.id_ruangan = j.id_ruangan JOIN dosen d 
                ON j.id_dosen = d.id_dosen WHERE j.id_jadwal = ?`, [id], (err, rows) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(rows);
                    console.log(rows);
                }
            })
        })
    }
    
    static async getDataJadwalByTugasId(id_tugas){
        return new Promise((resolve, reject) => {
            connection.query(`SELECT j.* FROM jadwal j INNER JOIN tugas t 
                ON j.id_jadwal = t.id_jadwal WHERE t.id_tugas = ?`, [id_tugas], (err, rows) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(rows[0]);
                    console.log(rows);
                }
            })
        })
    }

    static async getById(id_j){
        return new Promise((resolve, reject) => {
            connection.query(`SELECT j.*, mk.nama_matakuliah,  r.nama_ruangan, d.Nama, 
                d.NIP FROM jadwal j JOIN matakuliah mk ON j.id_matakuliah = mk.id_matakuliah 
                JOIN ruangan r ON r.id_ruangan = j.id_ruangan JOIN dosen d 
                ON j.id_dosen = d.id_dosen WHERE j.id_jadwal = ?`, [id_j], (err, rows) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(rows[0]);
                    console.log(rows);
                }
            })
        })
    }

    static async getTugasByJadwal(id_jadwal){
        return new Promise((resolve, reject) => {
            connection.query(`SELECT j.*,  t.id_tugas, t.judul_tugas, t.file_tugas FROM jadwal j 
                JOIN tugas t ON t.id_jadwal = j.id_jadwal  WHERE j.id_jadwal = ?`, 
                [id_jadwal], (err, rows) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(rows);
                    console.log(rows);
                }
            })
        })
    }

    static async getByIdTugas(id_tugas){
        return new Promise((resolve, reject) => {
            connection.query(`SELECT j.*, t.id_tugas, t.judul_tugas, t.file_tugas FROM jadwal j 
                JOIN tugas t ON j.id_jadwal = t.id_jadwal  WHERE t.id_tugas = ?`, 
                [id_tugas], (err, rows) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(rows[0]);
                    console.log(rows[0]);
                }
            })
        })
    }

    static async getJadwalById(id_jadwal){
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM jadwal WHERE id_jadwal = ?', [id_jadwal], (err, rows) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(rows[0]);
                    console.log('Jadwal :' ,rows);
                }
            })
        })
    }

    static async Update(id, Data) {
        return new Promise((resolve, reject) => {
            connection.query('UPDATE jadwal SET ? WHERE id_jadwal = ?', [Data, id], function(err, result){
                if(err){
                    console.error('Error updating jadwal:', err);
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
            connection.query('DELETE FROM jadwal WHERE id_jadwal = ?', [id], function(err, result){
                if(err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            })
        });
    }
}

module.exports = Model_Jadwal;
