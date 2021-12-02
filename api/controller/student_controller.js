const std_repo = require('./../../api/repository_db/student_repo')

exports.getstd = async (req, res) => {
	try {
		let data = await std_repo.getAllStd();
		res.send(data);
	}
	catch (ex) {
		console.log(ex)
	}
}

exports.regis_std = async (req, res) => {
	let u_id = req.body.u_id;
	let student_id = req.body.student_id;
	let student_name = req.body.student_name;
	try {
		let data = await std_repo.register_std(u_id, student_id, student_name);
		res.send({
			"success": true,
		})
	}
	catch (ex) {
		console.log(ex)
		res.send({
			"success": false
		})
	}
}

exports.removestd = async (req, res) => {
	let student_id = req.body.student_id;
	try {
		let data = await std_repo.removeStd(student_id);
		res.sendStatus(200)
	}
	catch (ex) {
		console.log(ex)
		res.sendStatus(404)
	}
}

exports.regis_room = async (req, res) => {
	let room_name = req.body.room_name;
	let capacity = req.body.capacity;
	let faculty_id = req.body.faculty_id;

	try {
		let data = await std_repo.register_room(room_name, capacity, faculty_id);
		res.send({
			"success": true
		})
	}
	catch (ex) {
		console.log(ex)
		res.send({
			"success": false
		})
	}
}

exports.getroom = async (req, res) => {
	let faculty_id = req.query.faculty_id;
	try {
		let data = await std_repo.getAllRoom(faculty_id);
		res.send(data);
	}
	catch (ex) {
		console.log(ex)
	}
}

exports.hasAccount = async (req, res) => {
	let u_id = req.body.u_id;
	try {
		let data = await std_repo.hasAccount(u_id);
		res.send({
			"success": data[0] ? true : false,
			"data": data[0] ? data[0] : {}
		})
	}
	catch (ex) {
		console.log(ex);
		res.sendStatus(404);
	}
}

exports.rename_student = async (req, res) => {
	let u_id = req.body.u_id;
	let student_name = req.body.student_name;
	try {
		let data = await std_repo.rename_student(u_id, student_name);
		res.send({
			"success": true
		})
	}
	catch (ex) {
		console.log(ex);
	}
}


exports.get_profile = async (req, res) => {
	let u_id = req.body.u_id;
	try {
		let data = await std_repo.get_timeline(u_id);
		res.send(data[0].student_name ? {
			"success": true,
			"hasAccount": true,
			"u_id": data[0].u_id,
			"student_id": data[0].student_id,
			"student_name": data[0].student_name
		} : {
			"success": false,
			"hasAccount": false
		})

	}
	catch (ex) {
		console.log(ex);
		res.send({
			"success": false,
			"hasAccount": false
		})
	}
}

exports.getRoomInfo = async (req, res) => {
	try {
		const room_id = req.query.room_id
		const data = await std_repo.get_roomInfo(room_id)
		if (data?.length > 0)
			return res.send({
				success: true,
				data: data[0]
			})
		return res.send({
			"success": false,
		})
	}
	catch (ex) {
		console.log(ex);
		res.send({
			"success": false,
		})
	}
}

exports.setRoomInfo = async (req, res) => {
	try {
		const room_id = req.body.room_id
		const room_name = req.body.room_name
		const capacity = req.body.capacity
		const faculty_id = req.body.faculty_id
		const data = await std_repo.editRoom(room_id, room_name, capacity, faculty_id)
		return res.send({
			"success": true,
		})
	}
	catch (ex) {
		console.log(ex);
		res.send({
			"success": false,
		})
	}
}

exports.setRoomDelete = async (req, res) => {
	try {
		const room_id = req.body.room_id
		const data = await std_repo.setFlagDelete(room_id)
		return res.send({
			"success": true,
		})
	}
	catch (ex) {
		console.log(ex);
		res.send({
			"success": false,
		})
	}
}