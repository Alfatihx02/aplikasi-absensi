const { promiseImpl, resolveInclude } = require('ejs');
const connection = require('../config/database'); 

class Model_HistoriPresensi {
    static async getAll(){
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM histori_presensi ORDER BY id_histori_presensi DESC', (err, rows) => {
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
            connection.query('INSERT INTO histori_presensi SET ?', Data, function(err, result){
                if(err){
                    reject(err);
                    console.log(err);
                } else {
                    resolve(result);
                }
            })
        });
    }

    static async getRiwayatPresensi(id_mhs){
        return new Promise((resolve, reject) =>{
            connection.query('SELECT hp.id_histori_presensi, hp.id_presensi, hp.waktu_presensi, m.nama_matkul, j.hari, j.waktu_mulai, j.waktu_selesai FROM histori_presensi hp JOIN presensi p ON hp.id_presensi = p.id_presensi JOIN jadwal j ON p.id_jadwal = j.id_jadwal JOIN matakuliah m ON j.id_matkul = m.id_matkulWHERE hp.id_mahasiswa = ?ORDER BY hp.waktu_presensi DESC')
        })
    }

    static async getByMahasiswaAndPresensi(id_mahasiswa, id_presensi){
        return new Promise((resolve, reject)=>{
            connection.query('SELECT * FROM histori_presensi WHERE id_mahasiswa = ? AND id_presensi = ? LIMIT 1', [id_mahasiswa, id_presensi], (err, result) =>{
                if(err){
                    reject(err);
                    console.log(err);
                }else{
                    resolve(result.length > 0 ? result[0] : null)
                }
            })
        })
    }

    static async getId(id){
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM histori_presensi WHERE id_histori_presensi = ?', [id], (err, rows) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(rows);
                    console.log(rows);
                }
            })
        })
    }
    static async getByMahasiswaAndJadwal(id_mahasiswa, id_jadwal){
        return new Promise((resolve, reject) => {
            connection.query('SELECT hp.*, p.pertemuan FROM histori_presensi hp JOIN presensi p ON hp.id_presensi = p.id_presensi WHERE hp.id_mahasiswa = ? AND p.id_jadwal = ? ORDER BY p.pertemuan ASC', [id_mahasiswa, id_jadwal], (err, result) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(result);
                    console.log(result);
                }
            })
        })
    }
    static async getByIdPresensi(id){
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM histori_presensi WHERE id_presensi = ?', [id], (err, rows) => {
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
            connection.query('UPDATE histori_presensi SET ? WHERE id_histori_presensi = ?', [Data, id], function(err, result){
                if(err){
                    console.error('Error updating histori_presensi:', err);
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
            connection.query('DELETE FROM histori_presensi WHERE id_histori_presensi = ?', [id], function(err, result){
                if(err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            })
        });
    }
}

module.exports = Model_HistoriPresensi;
