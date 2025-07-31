const express = require('express');
const app = express();
const dbService = require('./dbService'); // Import the database service
const cors = require('cors');

app.use(cors());
app.use(express.json());

// Route to handle setting alarm
app.post('/setAlarm', async (req, res) => {
    const { date, time, levelOfAlarm, message } = req.body;
    const db = dbService.getDbServiceInstance();

    try {
        const result = await db.setAlarm(date, time, levelOfAlarm, message);
        if (result.success) {
            res.status(201).json({ success: true, message: 'Alarm set successfully' });
        } else {
            res.status(500).json({ success: false, message: 'Failed to set alarm' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error in server' });
    }
});
// Add this route to your app.js file
app.get('/getAllAlarmList/:user_ID', (request, response) => {
    const user_ID = request.params.user_ID;
    // console.log(user_ID);
    
    const db = dbService.getDbServiceInstance();
    const result = db.getAllAlarmList(user_ID);  // Call the correct method in dbservice.js

    result
        .then(data => response.json({ data: data }))
        .catch(err => {
            console.error(err);
            response.status(500).json({ error: "Failed to retrieve alarms" });
        });
});
app.patch('/deletAlarm', (request, response) => {
    // const userName = request.params.userName;
    const alarm_ID = request.body.alarm_ID;
    // console.log("app.js ");
    const db = dbService.getDbServiceInstance();

    const result = db.deletAlarm(alarm_ID);
    result
    .then(data => response.json({success: data}))
    .catch(err => console.log(err));
})

// Route to delete an alarm by P_Notified_ID
app.delete('/deleteExpiredAlarm/:P_Notified_ID', (request, response) => {
    const { P_Notified_ID } = request.params;

    const db = dbService.getDbServiceInstance();
    const result = db.deleteExpiredAlarm(P_Notified_ID);  // Assuming this method is implemented in dbservice.js

    result
        .then(data => response.json({ success: true }))
        .catch(err => {
            console.error(err);
            response.status(500).json({ success: false, error: "Failed to delete alarm" });
        });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
