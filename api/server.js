const express = require('express');
const app = express();
const https = require('https')
const fs = require('fs')
const bodyParser = require('body-parser');
const env = require('./../env.json');
const cors = require('cors');
const authenRoute = express.Router();
const std_controller = require('./controller/student_controller');
const checkin_controller = require('./controller/checkin_controller');
const login_controller = require('./controller/login_controller');
const class_controller = require('./controller/class_controller')
const profile_controller = require('./controller/profile_controller')
const faculty_controller = require('./controller/faculty_controller');
const suAccount_controller = require('./controller/suAccount_controller')
const guestAccount_controller = require('./controller/guestAccount_controller')
const line_middle_ware = require('./line_authen');
const helper = require('./helper');





app.use(cors({
    origin: [
        'http://jackerle.bike',
        'https://127.0.0.1:3000',
        'https://localhost:7777',
        'https://jackerle.bike',
        'https://jackerle.bike:80',
        'http://127.0.0.1',
        'http://127.0.0.1:3000',
        'http://localhost',
        'http://localhost:8181',
        'https://crossknight.com',
        'https://line.crossknight.com',
        'https://dashboard.crossknight.com',
        'https://dashboard.jackerle.bike',
        'https://qrcheck.jackerle.bike',
        'https://checkin.sc.su.ac.th',
        'https://qrcheck.sc.su.ac.th'
    ], credentials: true
}));
app.use(bodyParser.json());
app.use('/api', authenRoute)



authenRoute.use(line_middle_ware.middle_ware);




app.post('/get_history', checkin_controller.get_history);
app.get('/getClass', class_controller.getClass);
app.post('/login', login_controller.login);
app.post('/get_room_from_class', class_controller.get_room_from_class);
app.post('/register', login_controller.register);
app.post('/regis_room', std_controller.regis_room);
app.post('/get_student_status', checkin_controller.getstudent_status);
app.get('/getroom', std_controller.getroom);
app.get('/getAllTrans', checkin_controller.getAllTrans);
app.get('/getstd', std_controller.getstd);
app.get('/getCheckin', checkin_controller.getCheckin);
app.get('/getAllClass', class_controller.getAllClass);
app.post('/getSchedule', class_controller.getSchedule);
app.get('/getroom_in', checkin_controller.getroom_in);
app.post('/getReg', class_controller.getReg);
app.post('/add_class', class_controller.add_class)
app.post('/f_checkout', checkin_controller.f_checkout);
app.post('/get_regis_student', class_controller.get_regis_student)
app.post('/getClass_room', class_controller.getClass_room);
app.post('/reject_all', checkin_controller.reject_all);
app.post('/get_class', class_controller.get_class);
app.post('/get_sect', class_controller.get_sect);
app.post('/get_schedule', class_controller.get_schedule);
app.post('/add_reg_student', class_controller.add_reg_student);
app.post('/delete_class', class_controller.delete_class);
app.post('/change_class_name', class_controller.change_class_name);
app.post('/auto_reject_all', checkin_controller.auto_reject_all);
app.post('/get_term', class_controller.get_term);
app.get('/get_faculty', faculty_controller.get_faculty);
authenRoute.post('/get_profile', std_controller.get_profile);
authenRoute.get('/count_room', checkin_controller.count_room);
authenRoute.post('/rename_student', std_controller.rename_student);
authenRoute.post('/checkin', checkin_controller.checkin);
authenRoute.post('/checkout', checkin_controller.checkout);
authenRoute.post('/regis_std', std_controller.regis_std);
authenRoute.post('/removestd', std_controller.removestd);
authenRoute.post('/getInfo', checkin_controller.getInfo);
authenRoute.post('/hasAccount', std_controller.hasAccount);
authenRoute.post('/get_timeline', profile_controller.get_timeline)

authenRoute.post('/register/su', suAccount_controller.register)
authenRoute.post('/register/guest', guestAccount_controller.register)

helper.watcher_auto_reject();

if (env.DEV) {
    app.listen(env.PORT, '127.0.0.1', () => { console.log('openned on production port:' + env.PORT) })
} else {
    app.listen(env.PORT, '127.0.0.1', () => { console.log('openned on production port:' + env.PORT) })
}




