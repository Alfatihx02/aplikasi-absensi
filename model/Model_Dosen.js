const connection = require('../config/database'); 

class Model_Dosen {
    static async getAll(){
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM dosen ORDER BY id_dosen DESC', (err, rows) => {
                if(err){
                    reject(err);
                } else {
                    resolve(rows);
                    console.log(rows);
                }
            });
        });
    }
    static async getAllData(){
        return new Promise((resolve, reject) => {
            connection.query('SELECT d.*, u.email FROM dosen d JOIN users u ON d.id_users = u.id_users ORDER BY id_dosen DESC', (err, rows) => {
                if(err){
                    reject(err);
                } else {
                    resolve(rows);
                    console.log(rows);
                }
            });
        });
    }

    static async getIdDosenFromUserId(idUser) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT id_dosen FROM dosen WHERE id_users = ?', [idUser], (err, rows) => {
                if (err) {
                    reject(err);
                } else if (rows.length === 0) {
                    reject(new Error('Dosen not found'));
                } else {
                    resolve(rows[0].id_dosen);
                }
            });
        });
    }

    static async Store(Data){
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO dosen SET ?', Data, function(err, result){
                if(err){
                    reject(err);
                    console.log(err);
                } else {
                    resolve(result);
                }
            })
        });
    }

    static async getByName(nama) {          //mengambil data dosen berdasarkan nama
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM dosen WHERE nama = ?', [nama], function(err, result){
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            })
        })
    }

    static async getId(id){                    //mengambil data dosen berdasarkan id
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM dosen WHERE id_dosen = ?', [id], (err, rows) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(rows);
                    console.log('Cihuy: ',rows);
                }
            })
        })
    }

    static async Update(id, Data) {                //memperbarui data dosen
        return new Promise((resolve, reject) => {
            connection.query('UPDATE dosen SET ? WHERE id_dosen = ?', [Data, id], function(err, result){
                if(err){
                    console.error('Error updating dosen:', err);
                    reject(err);
                } else {
                    console.log('Update result:', result);
                    resolve(result);
                }
            })
        });
    }

    static async Delete(id) {                       //menghapus data dosen berdasarkan id_dosen
        return new Promise((resolve, reject) => {
            connection.query('DELETE FROM dosen WHERE id_dosen = ?', [id], function(err, result){
                if(err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            })
        });
    }
}

module.exports = Model_Dosen;
