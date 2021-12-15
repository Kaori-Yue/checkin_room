const std_repo = require('./../../api/repository_db/student_repo');
const env = require('./../../env.json')


exports.getCountAdmin = async (req, res) => {
	try {
		let data = await std_repo.getCountAdmin();
		res.send({
			"success": true,
			"data": data
		})
	}
	catch (ex) {
		console.log(ex)
		res.send({
			"success": false
		})
	}
}


exports.getUsersByGroupID = async (req, res) => {
	try {
		const groupID = Number(req.query.groupID)
		if (Number.isNaN(groupID)) {
			return res.send({
				"success": false
			})
		}

		let data = await std_repo.getUsersByGroupID(groupID);
		res.send({
			"success": true,
			"data": data
		})
	}
	catch (ex) {
		console.log(ex)
		res.send({
			"success": false
		})
	}
}

exports.getUserByUsername = async (req, res) => {
	try {
		const username = req.query.username
		let data = await std_repo.getUserByUsername(username);
		res.send({
			"success": true,
			"data": data
		})
	}
	catch (ex) {
		console.log(ex)
		res.send({
			"success": false
		})
	}
}


exports.deleteUserByUsername = async (req, res) => {
	try {
		const username = req.body.username
		let data = await std_repo.deleteUserByUsername(username);
		res.send({
			"success": true,
			"data": data
		})
	}
	catch (ex) {
		console.log(ex)
		res.send({
			"success": false
		})
	}
}

exports.roomStatistics = async (req, res) => {
	try {
		let data = await std_repo.roomStatistics();
		res.send({
			"success": true,
			"data": data
		})
	}
	catch (ex) {
		console.log(ex)
		res.send({
			"success": false
		})
	}
}

exports.getUsedSlotRoom = async (req, res) => {
	try {
		const roomID = Number(req.query.roomID)
		if (Number.isNaN(roomID)) {
			return res.send({
				"success": false
			})
		}

		let data = await std_repo.getUsedSlotRoom(roomID);
		if (!data[0]) {
			return res.send({
				"success": false
			})
		}
		res.send({
			"success": true,
			"data": data[0]
		})
	}
	catch (ex) {
		console.log(ex)
		res.send({
			"success": false
		})
	}
}

exports.getNow = async(req, res) => {
	const data = await std_repo.getNow()
	return res.send(data)
}

exports.getTimeZone = async(req, res) => {
	const data = await std_repo.getTimeZone()
	return res.send(data)
}