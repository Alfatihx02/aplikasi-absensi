const connection = require('../config/database'); 

class Model_Prodi {
    static async getAll(){
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM prodi ORDER BY id_prodi DESC', (err, rows) => {
                if(err){
                    reject(err);
                } else {
                    resolve(rows);
                    console.log(rows);
                }
            });
        });
    }
    static async getData(){
        return new Promise((resolve, reject) => {
            connection.query(`SELECT p.*, j.nama_jurusan FROM prodi p JOIN jurusan j 
                ON p.id_jurusan = j.id_jurusan ORDER BY id_prodi DESC`, (err, rows) => {
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
            connection.query('INSERT INTO prodi SET ?', Data, function(err, result){
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
            connection.query('SELECT * FROM prodi WHERE id_prodi = ?', [id], (err, rows) => {
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
            connection.query('UPDATE prodi SET ? WHERE id_prodi = ?', 
                [Data, id], function(err, result){
                if(err){
                    console.error('Error updating prodi:', err);
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
            connection.query('DELETE FROM prodi WHERE id_prodi = ?', 
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

module.exports = Model_Prodi;
