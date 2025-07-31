const mysql = require('mysql');
let instance = null;
// require('dotenv').config();

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'socialMedia'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database.');
});

class DbService {
    static getDbServiceInstance(){
        return instance ? instance : new DbService();
    }

    async setAlarm(date, time, levelOfAlarm, message) {
        try {
            const result = await new Promise((resolve, reject) => {
                const query = 'INSERT INTO personalized_notification (Notify_Time,Created_Date,Content,alarm_level,user_ID	) VALUES (?, ?, ?, ?, ?)';
                connection.query(query, [time, date, message, levelOfAlarm, 3], (err, results) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve({ success: true, id: results.insertId });
                    }
                });
            });
            return result;
        } catch (error) {
            console.error('Database error:', error);
            return { success: false };
        }
    }
    async getAllAlarmList(userID) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'SELECT * FROM personalized_notification WHERE user_ID = ?';  // Use ? for parameterized query
                connection.query(query, [userID], (err, results) => {
                    if (err) {
                        reject(new Error(err.message));
                    }
                    resolve(results);
                });
            });
            return response;
        } catch (error) {
            console.log(error);
            throw new Error("Database query failed");  // Throw error so it can be caught in app.js
        }
    }
    async deletAlarm(alarmID) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'DELETE FROM personalized_notification WHERE P_Notified_ID = ?;';  // Use ? for parameterized query
                connection.query(query, [alarmID], (err, results) => {
                    if (err) {
                        reject(new Error(err.message));
                    }
                    resolve(results);
                });
            });
            return response;
        } catch (error) {
            console.log(error);
            throw new Error("Database query failed");  // Throw error so it can be caught in app.js
        }
    }
    async deleteExpiredAlarm(P_Notified_ID) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'DELETE FROM personalized_notification WHERE P_Notified_ID = ?';
                connection.query(query, [P_Notified_ID], (err, result) => {
                    if (err) {
                        reject(new Error(err.message));
                    }
                    resolve(result);
                });
            });
            return response;
        } catch (error) {
            console.error(error);
            throw new Error("Database deletion failed");
        }
    }
    
    
}

module.exports = DbService;
