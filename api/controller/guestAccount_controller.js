const axios = require('axios').default
const env = require('../../env.json')
const { register_std, register_from_guest } = require('../repository_db/student_repo')

exports.register = async (req, res) => {
	const u_id = req.body.u_id;
	const student_id = req.body.student_id;
	const student_name = req.body.student_name;
	const phone = req.body.phone;

	try {
		register_from_guest(u_id, student_id, student_name, phone)
		res.send({
			"success": true
		})
		return
	}
	catch (er) {
		res.send({
			"success": false
		})
		return
	}


}