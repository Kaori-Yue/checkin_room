const std_repo = require('./../../api/repository_db/student_repo');
const env = require('./../../env.json')


exports.get_faculty = async (req, res) => {

	try {
		let data = await std_repo.get_faculty();
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



exports.getRoomCreatedInfo = async (req, res) => {
	try {
		let data = await std_repo.getRoomCreatedInfo();
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

exports.createNewGroup = async (req, res) => {
	try {
		const groupName = req.body.groupName
		let data = await std_repo.createGroup(groupName);
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
