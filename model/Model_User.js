const connection = require('../config/database');

class Model_Users {
    static async getAll(){
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM users ORDER BY id_users DESC', (err, rows) => {
                if(err){
                    reject(err);
                } else {
                    resolve(rows);
                    console.log(rows);
                }
            });
        });
    }

    static async count(){
        return new Promise((resolve, reject) => {
            connection.query('SELECT COUNT(*) as count FROM users', (err, rows) => {
                if(err){
                    reject(err);
                } else {
                    resolve(rows[0].count);
                    console.log(rows);
                }
            });
        });
    }

    static async Store(Data){
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO users SET ?', Data, function(err, result){
                if(err){
                    reject(err);
                    console.log(err);
                } else {
                    resolve(result.insertId);
                }
            })
        });
    }

    static async Login(email) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM users WHERE email = ?', [email], function(err, result){
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            })
        })
    }

    static async findByEmail(email) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM users WHERE email = ?', [email], function(err, result){
                if (err) {
                    reject(err);
                } else {
                    resolve(result[0]);
                }
            })
        })
    }

    static async getId(id){
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM users WHERE id_users = ?', [id], (err, rows) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(rows);
                    console.log(rows);
                }
            })
        })
    }
    
    static async getIdDosen(idDosen){
        return new Promise((resolve, reject) => {
            connection.query(`SELECT u.*, d.* FROM users u JOIN dosen d ON u.id_users = d.id_users WHERE d.id_dosen = ?`, 
                [idDosen], (err, rows) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(rows);
                    console.log(rows);
                }
            })
        })
    }

    static async getOpenPresensiByDosen(id_dosen) {
        return new Promise((resolve, reject) => {
          connection.query(`SELECT p.* FROM presensi p JOIN jadwal j ON p.id_jadwal = j.id_jadwal 
            JOIN dosen d ON j.id_dosen = d.id_dosen JOIN users u ON d.id_users = u.id_users 
            WHERE p.status = 'dibuka' AND u.id_users = ?`, [id_dosen], (err, rows) => {
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
            connection.query('UPDATE users SET ? WHERE id_users = ?', [Data, id], function(err, result){
                if(err){
                    console.error('Error updating account:', err);
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
            connection.query('DELETE FROM users WHERE id_users = ?', [id], function(err, result){
                if(err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            })
        });
    }
}

module.exports = Model_Users;

