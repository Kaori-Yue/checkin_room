const mariadb = require('mariadb');
const env = require('./../../env.json')
const helper = require('../../api/helper');
const { get_term } = require('../controller/class_controller');


var pool = mariadb.createPool({
	host: 'localhost',
	user: env.USERNAME_DB,
	password: env.PASSWORD_DB,
	database: env.DATABASE,
	connectionLimit: 20,
	connectTimeout: 15000,
	idleTimeout: 300,
	timezone: "UTC"

});


const to_query = function (sql) {
	return new Promise(async (resolve, reject) => {
		try {
			let _pool = await pool.getConnection();
			let res_query = await _pool.query(sql);
			_pool.release();
			resolve(res_query);
		}
		catch (ex) {
			await helper.send_discord(ex)
			console.log(ex)
			reject(ex)
		}
	})
}


/**
 * @param {string} u_id From LINE userid
 * @param {string} student_id Student id
 * @param {string} student_name Strudent name 
 */
exports.register_std = function (u_id, student_id, student_name) {
	let sql = `insert into student_table(u_id,student_id,student_name) 
    values ('${u_id}','${student_id}','${student_name}');`
	return to_query(sql);
}

exports.register_from_su = function (u_id, student_id, student_name, prefix_name_th, name_en, name_th, surname_en, surname_th, faculty_name, level_name) {
	let sql = `insert into student_table(u_id,student_id,student_name,prefix_name_th,name_en,name_th,surname_en, surname_th, faculty_name, level_name, accountType)
    values ('${u_id}','${student_id}','${student_name}','${prefix_name_th}','${name_en}','${name_th}','${surname_en}','${surname_th}','${faculty_name}','${level_name}', 1);`
	return to_query(sql);
}

exports.register_from_su_as_staff = function (u_id, student_id, student_name, prefix_name_th, name_en, name_th, surname_en, surname_th, faculty_name) {
	let sql = `insert into student_table(u_id,student_id,student_name,prefix_name_th,name_en,name_th,surname_en, surname_th, faculty_name, accountType)
    values ('${u_id}','${student_id}','${student_name}','${prefix_name_th}','${name_en}','${name_th}','${surname_en}','${surname_th}','${faculty_name}', 2);`
	return to_query(sql);
}

exports.register_from_guest = function (u_id, student_id, student_name, phone) {
	let sql = `insert into student_table(u_id,student_id,student_name,phone,accountType) 
    values ('${u_id}','${student_id}','${student_name}','${phone}', 3);`
	return to_query(sql);
}


exports.getAllStd = function () {
	let sql = `select * from student_table;`
	return to_query(sql);
}


/**
 * @param {string} student_id 
 */
exports.removeStd = function (student_id) {
	let sql = `delete from student_table where student_id = '${student_id}'`
	return to_query(sql);
}

/**
 * @param {string} room_name Name of room which regis
 * @param {number} capacity Maximum for room  
 */
exports.register_room = function (room_name, capacity, faculty_id) {
	let sql = `insert into room_table(room_name,capacity , faculty_id)
    values ('${room_name}',${capacity} , ${faculty_id} );`
	return to_query(sql);
}

exports.getAllRoom = function (faculty_id) {
	let sql = ''

	//power admin
	if (faculty_id == 0)
		sql = `select * from room_table;`
	else
		sql = `select * from room_table where faculty_id = ${faculty_id};`

	return to_query(sql);
}

/**
 * @param {number} room_id
 * @param {string} u_id
 */
exports.checkin = async function (room_id, u_id) {

	//เช็คว่า ห้องอื่นมีการ login ไหม
	let validate_duplicate_checkin_q = `update transaction
    set timestamp_checkout = CURRENT_TIMESTAMP,status = 0,role = 1
    where u_id = '${u_id}' and status = 1`

	await to_query(validate_duplicate_checkin_q);


	//Checkin
	let sql = `insert into transaction (room_id,u_id,timestamp_checkin,status) select ${room_id},'${u_id}',CURRENT_TIMESTAMP,1 
    from transaction
    where not exists(
        select * from transaction 
    where room_id = ${room_id}
    and u_id =  '${u_id}'
    and status = 1
    )
    and exists (
        select 'left' as a
from room_table,
(select count(room_id) as l_count from transaction where room_id=${room_id} and status =1) as c_in
where capacity - c_in.l_count  >0
and room_table.room_id = ${room_id}
    )
    group by '${u_id}'
    ;`

	return to_query(sql);
}

/**
 * @param {string} u_id
 */
exports.checkout = function (u_id, room_id) {
	let sql = `update transaction
    set timestamp_checkout = CURRENT_TIMESTAMP,status = 0,role = 0
    where u_id = '${u_id}' and status = 1 and room_id = ${room_id};`
	return to_query(sql);
}


exports.f_checkout = function (student_id, room_id) {
	let sql = `update transaction,student_table
    set transaction.timestamp_checkout = CURRENT_TIMESTAMP,transaction.status = 0,transaction.role = 1
    where transaction.status = 1 and transaction.room_id = ${room_id} and transaction.u_id = student_table.u_id
    and student_table.student_id = '${student_id}'
    ;`
	return to_query(sql)
}



exports.getAllTrans = function () {
	let sql = `select * from transaction`
	return to_query(sql);
}


/**
 * 
 * @param {string} u_id 
 * @param {number} room_id 
 */
exports.getInfo = function (u_id, room_id) {
	let sql = `select 
    case when exists(
        select * 
        from transaction
        where u_id = '${u_id}'
        and room_id = ${room_id}
        and status = 1	
    ) and exists(
        select * 
        from student_table
        where u_id = '${u_id}'
    )
      then 'has account and checkin'
    when exists(
        select * 
        from student_table
        where u_id = '${u_id}'
    )
    then 'has account no checkin'
    else 'no account'
    end as msg,
    student_table.student_id as student_id,
    student_table.student_name as student_name,
    room_table.room_name as room_name,
    room_table.capacity as capacity
    from student_table,room_table
    where student_table.u_id = '${u_id}'
    and room_table.room_id = ${room_id}`
	return to_query(sql)
}


/**
 * 
 * @param {string} u_id 
 */
exports.getTran = function (u_id, room_id) {
	let sql = `select * from transaction where u_id = '${u_id}' and status = 1 and room_id = ${room_id}`;
	return to_query(sql);
}

/**
 * @param {string} u_id
 */
exports.hasAccount = function (u_id) {
	let sql = `select * from student_table where u_id = '${u_id}';`
	return to_query(sql);
}

/**
 * 
 * @param {string} username 
 * @param {string} password 
 */
exports.login = function (username, hash_password) {
	let sql = `select * from admin where username = '${username}' and  hash_password = '${hash_password}'`
	return to_query(sql);
}


/**
 * 
 * @param {string} username 
 * @param {string} hash_password 
 * @param {string} name 
 * @param {string} about 
 */
exports.register = function (username, hash_password, name, role, about) {
	let sql = `insert into admin (username,hash_password,name,role,about)
    values ('${username}','${hash_password}','${name}',${role},'${about}');`
	return to_query(sql);
}


/**
 * @param {string} room_id
 */
exports.getCheckin = function (room_id) {
	let sql = `select student_table.u_id as u_id ,student_table.student_name as student_name,student_table.student_id as student_id,transaction.timestamp_checkin as timestamp_checkin from transaction,student_table
    where transaction.room_id = ${room_id} and transaction.status = 1 and transaction.u_id = student_table.u_id;`
	return to_query(sql);
}



exports.getAllClass = function () {
	let sql = `select * from class_table;`
	return to_query(sql);
}

exports.getSchedule = function (class_id, class_sect) {
	let sql = `select 
    class_table.class_id as class_id,
    class_table.class_name as class_name,
    class_schedule.class_day as class_day,
    class_schedule.class_start_time as class_start_time,
    class_schedule.class_end_time as class_end_time,
    room_table.room_name as room_name
    from class_table,class_schedule,room_table
    where class_schedule.room_id = room_table.room_id
    and class_schedule.class_id = class_table.class_id
    and class_schedule.class_sect = class_table.class_sect
    and class_table.class_id = '${class_id}'
    and class_table.class_sect = '${class_sect}';
    `
	return to_query(sql);
}

exports.getReg = function (class_id, class_sect) {
	let sql = `select 
    student_table.student_id as student_id,
    student_table.student_name as student_name
    from reg_class,student_table
    where reg_class.class_id = '${class_id}'
    and reg_class.class_sect = '${class_sect}'
    and reg_class.student_id = student_table.student_id;`
	return to_query(sql);
}


exports.getClass_room = function (room_id, day) {
	let sql = `select class_table.class_id as class_id,
    class_table.class_sect as class_sect,
    class_schedule.class_start_time as class_start_time,
    class_schedule.class_end_time as class_end_time,
    class_table.class_name as class_name,
    room_table.room_id as room_id,
    room_table.room_name as room_name,
    room_table.capacity as capacity
    from 
    class_schedule,class_table,room_table
    where class_schedule.class_day = ${day}
    and class_schedule.room_id = ${room_id}
    and class_schedule.room_id = room_table.room_id
    and class_table.class_sect = class_schedule.class_sect
    and class_table.class_id = class_schedule.class_id
    order by class_schedule.class_start_time;`
	return to_query(sql)
}


/**
 * 
 * @param {string} class_id 
 * @param {number} class_sect 
 * @param {string} class_name 
 * @param {Array} schedule 
 */
exports.add_class = function (class_id, class_sect, class_name, term, schedule) {
	let sql_1 = `insert into class_table (class_id,class_sect,class_name,term)
    values ('${class_id}','${class_sect}','${class_name}','${term}')`
	to_query(sql_1)
	schedule.map(e => {
		let sql = `insert into class_schedule (class_id,class_sect,class_day,class_start_time,class_end_time,room_id) values('${class_id}','${class_sect}',${e.day},'${e.start_time}:00','${e.end_time}:00',${e.room_id});`
		to_query(sql)
	})
	return ({
		"success": true
	})

}


exports.getroom_in = function (faculty_id) {

	let sql = ''

	if (faculty_id == 0)
		sql = `select room_table.room_id as room_id,
    room_table.room_name as room_name,
    room_table.capacity as capacity,
    count(*) as count
    
    
    from  room_table,transaction
    where room_table.room_id = transaction.room_id
    and transaction.status = 1
    group by room_table.room_id`;

	else {
		sql = `select room_table.room_id as room_id,
    room_table.room_name as room_name,
    room_table.capacity as capacity,
    count(*) as count
    
    
    from  room_table,transaction
    where room_table.room_id = transaction.room_id
    and transaction.status = 1
    and faculty_id = ${faculty_id}
    group by room_table.room_id`;
	}


	return to_query(sql);
}


exports.getClass = function () {
	let sql = `select * from class_table`
	return to_query(sql)
}


exports.get_room_from_class = function (class_id, class_sect) {
	let sql = `select 
    room_table.room_id as room_id,
    room_table.room_name as room_name,
    room_table.capacity as capacity
    from class_schedule,room_table
    where class_id = '${class_id}'
    and class_sect = '${class_sect}'
    and class_schedule.room_id = room_table.room_id
    group by room_table.room_id;`;
	return to_query(sql)
}

exports.get_student_status = function (room) {
	let sql = `select student_table.student_id as student_id from 
    transaction,student_table
    where transaction.u_id = student_table.u_id and (`
	room.map(e => {
		sql += `transaction.room_id = ${e.room_id} or `
	})
	sql += `1!=1) and status = 1;`
	return to_query(sql)
}


exports.get_history = function (student_id, student_name, class_id, class_sect, start_time, end_time, room_id, page, role_id) {
	let per_page = 15
	let sql = `select room_table.room_name as room_name ,student_table.student_id ,student_table.student_name,transaction.timestamp_checkin as timestamp_checkin , transaction.timestamp_checkout as timestamp_checkout, transaction.role
    from transaction,student_table,room_table
    where transaction.u_id = student_table.u_id
    and transaction.room_id = room_table.room_id
    and student_table.student_id like '%${student_id}%'
    and student_table.student_name like '%${student_name}%'
    and transaction.timestamp_checkin > "${start_time} 00:00:00"
    and transaction.timestamp_checkin < "${end_time} 23:59:00"
    `
	if (+role_id !== 0)
		sql = sql + ` and room_table.faculty_id = '${role_id}'`

	if (class_id == '' && class_sect == '') {
		if (room_id == '') {
			return to_query(sql + `order by transaction.timestamp_checkin DESC 
            limit ${page * per_page},${per_page};`)
		}
		else {
			sql += `and room_table.room_id = ${room_id}
            order by transaction.timestamp_checkin DESC`
			return to_query(sql + ` limit ${page * per_page},${per_page};`)
		}
	}
	else {
		sql = `select room_table.room_name as room_name ,student_table.student_id ,student_table.student_name,transaction.timestamp_checkin as timestamp_checkin , transaction.timestamp_checkout as timestamp_checkout, transaction.role
        from transaction,student_table,room_table,class_schedule,reg_class
        where transaction.u_id = student_table.u_id
        and transaction.room_id = room_table.room_id
        and student_table.student_id like '%${student_id}%'
        and student_table.student_name like '%${student_name}%'
        and transaction.timestamp_checkin > "${start_time} 00:00:00"
        and transaction.timestamp_checkin < "${end_time} 23:59:00"
        and dayofweek(transaction.timestamp_checkin)-1 = class_schedule.class_day
        and transaction.room_id = class_schedule.room_id
        and abs(hour(transaction.timestamp_checkin) -hour(class_schedule.class_start_time)) <=1
        and hour(transaction.timestamp_checkin) - hour(class_schedule.class_end_time) <= 0
        and class_schedule.class_id = '${class_id}'
        and class_schedule.class_sect = '${class_sect}'
        and class_schedule.class_id = reg_class.class_id
        and class_schedule.class_sect = reg_class.class_sect
        and student_table.student_id = reg_class.student_id
        `
		if (room_id == '') {
			return to_query(sql + `order by transaction.timestamp_checkin DESC
            limit ${page * per_page},${per_page};`)
		}
		else {
			sql += `and room_table.room_id = ${room_id}
            order by transaction.timestamp_checkin DESC`
			return to_query(sql + ` limit ${page * per_page},${per_page};`)
		}

	}

}


exports.count_room = function (room_id) {
	let sql = `select count(transaction.room_id) as count_in,
    room_table.capacity-count(transaction.room_id) as count_left,
    room_table.capacity as capacity
    
    from transaction,room_table
    where transaction.room_id = ${room_id}
    and transaction.room_id = room_table.room_id
    and transaction.status = 1`
	return to_query(sql)
}


exports.get_regis_student = function (class_id, class_sect) {
	let sql = `select * from reg_class 
    where class_id = '${class_id}'
    and class_sect = '${class_sect}';`
	return to_query(sql);
}



exports.reject_all = function (room_id) {
	let sql = `update transaction
    set timestamp_checkout = CURRENT_TIMESTAMP,status = 0,role = 1
    where room_id = ${room_id} and status = 1;`
	return to_query(sql)
}


exports.get_class = function (term) {
	let sql = `select class_id as class_id ,class_name as class_name 
    from class_table 
    where term = '${term}'
    group by class_id;`
	return to_query(sql);
}

exports.get_sect = function (class_id) {
	let sql = `select * from class_table where class_id = '${class_id}'; `
	return to_query(sql)
}

exports.get_schedule = function (class_id) {
	let sql = `select * from class_schedule where class_id = '${class_id}';`
	return to_query(sql);
}

exports.add_reg_student = function (msg) {
	let sql = `insert into reg_class values` + msg + ';'
	return to_query(sql);
}


exports.rename_student = function (u_id, student_name) {
	let sql = `update student_table set student_name = '${student_name}' where u_id = '${u_id}';`
	return to_query(sql);
}

exports.delete_class = function (class_id, class_sect) {
	let sql = `delete from reg_class where class_id = '${class_id}' and class_sect = '${class_sect}';`
	to_query(sql).then(res => {
		to_query(`delete from class_schedule where class_id = '${class_id}' and class_sect = '${class_sect}';`).then(res => {
			return to_query(`delete from class_table where class_id ='${class_id}' and class_sect = '${class_sect}';`)
		})
	})
}


exports.get_timeline = function (u_id) {
	let sql = `select * from student_table where u_id = '${u_id}'`
	return to_query(sql);
}


exports.change_class_name = function (class_id, class_sect, new_name) {
	let sql = `update class_table set class_name = '${new_name}' where class_id = '${class_id}' and class_sect = '${class_sect}';`
	return to_query(sql)
}

exports.auto_reject_all = function (room_id) {
	let sql = `update transaction
    set timestamp_checkout = CURRENT_TIMESTAMP,status = 0,role = 1
    where status = 1;`
	return to_query(sql)
}

exports.get_term = function () {
	let sql = `select * from term_table;`
	return to_query(sql);
}





exports.get_timeline = async function (student_id, u_id) {

	let q_student_info = `select * from student_table where u_id = '${u_id}' `
	let student_info = await to_query(q_student_info)

	let q_device_list = `select u_id , student_name from student_table where student_id = '${student_id}'`
	let device_list = await to_query(q_device_list)

	let q_get_timeline = `select student_table.u_id , transaction.timestamp_checkin , transaction.timestamp_checkout , transaction.role , student_table.student_name , room_table.room_name
    from transaction ,student_table , room_table
    where student_table.student_id = '${student_id}'
    and transaction.u_id = student_table.u_id
    and transaction.room_id = room_table.room_id
    order by timestamp_checkin asc;`
	let timeline = await to_query(q_get_timeline)


	return ({
		"success": true,
		"student_info": student_info[0],
		"device_list": device_list,
		"timeline": timeline
	})

}



exports.get_faculty = function () {

	let sql = `select * from faculty_table;`

	return to_query(sql);


}
