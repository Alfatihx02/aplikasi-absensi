const connection = require(`../config/database`); 

class Model_Pengumpulan {
    static async getAll(){
        return new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM pengumpulan ORDER BY id_pengumpulan DESC`, (err, rows) => {
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
            connection.query(`INSERT INTO pengumpulan SET ?`, Data, function(err, result){
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
            connection.query(`SELECT * FROM pengumpulan WHERE id_pengumpulan = ?`, [id], (err, rows) => {
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
            connection.query(`SELECT p.*, m.Nama as nama_mahasiswa FROM pengumpulan p
                   JOIN mahasiswa m ON p.id_mahasiswa = m.id_mahasiswa
                   WHERE p.id_tugas = ?`, [id_tugas], (err, rows) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(rows);
                    console.log(rows);
                }
            })
        })
    }

    static async getByIdMahasiswaAndIdTugas(id_mahasiswa, id_tugas){
        return new Promise((resolve, reject) =>{
            connection.query(`SELECT p.*, m.Nama, t.judul_tugas FROM pengumpulan p JOIN mahasiswa m 
                ON p.id_mahasiswa = m.id_mahasiswa JOIN tugas t ON p.id_tugas = t.id_tugas 
                WHERE p.id_mahasiswa = ? AND p.id_tugas = ? `, [id_mahasiswa, id_tugas], (err, rows) =>{
                if(err){
                    reject(err)
                    console.log(`error:`, err);
                }else{
                    resolve(rows[0]);
                    console.log(rows[0]);
                }
            })
        })
    }

    static async getByIdTugasAndIdJadwal(id_tugas, id_jadwal){
        return new Promise((resolve, reject) =>{
            connection.query(`SELECT p.id_pengumpulan, p.file_pengumpulan, t.judul_tugas, j.hari, 
                j.waktu_mulai, j.waktu_selesai FROM pengumpulan p JOIN tugas t ON p.id_tugas = t.id_tugas 
                JOIN jadwal j ON t.id_jadwal = j.id_jadwal WHERE   t.id_jadwal = ?   AND t.id_tugas = ? `, 
                [id_tugas, id_jadwal], (err, rows)=>{
                if(err){
                    reject(err);
                    console.log(`error pengumpulan: `, err);
                }else{
                    resolve(`Query tugas jadwal: `, rows);
                    console.log(rows);
                }
            })
        })
    }
    
    static async Update(id, Data) {
        return new Promise((resolve, reject) => {
            connection.query(`UPDATE pengumpulan SET ? WHERE id_pengumpulan = ?`, 
                [Data, id], function(err, result){
                if(err){
                    console.error(`Error updating pengumpulan:`, err);
                    reject(err);
                } else {
                    console.log(`Update result:`, result);
                    resolve(result);
                }
            })
        });
    }

    static async Delete(id) {
        return new Promise((resolve, reject) => {
            connection.query(`DELETE FROM pengumpulan WHERE id_pengumpulan = ?`, 
                [id], function(err, result){
                if(err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            })
        });
    }
}

module.exports = Model_Pengumpulan;
