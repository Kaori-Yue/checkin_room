const axios = require('axios').default
const env = require('../../backend.json')
const { register_std, register_from_su, register_from_su_as_staff } = require('../repository_db/student_repo')
const { loginWithSSO } = require('../repository_db/student_repo')
const jwt = require('jsonwebtoken')

exports.loginWithSSO = async (req, res) => {
	try {
		const code = req.body.code
		const reqString = `?grant_type=authorization_code&client_id=${env.CLIENT_ID}&redirect_uri=${env.REDIRECT_URI_DASHBOARD}&client_secret=${env.CLIENT_SECRET}&code=${code}`
		const reqToken = await axios.post("https://nidp.su.ac.th/nidp/oauth/nam/token" + reqString)
		const { access_token, token_type } = reqToken.data

		const reqUserInfo = await axios("https://nidp.su.ac.th/nidp/oauth/nam/userinfo", {
			method: "GET",
			headers: {
				Authorization: token_type + " " + access_token
			}
		})

		const email = reqUserInfo.data.website
		const login = await loginWithSSO(email)
		if (!login[0]) {
			return res.send({
				success: false
			})
		}
		const loginData = login[0]
		const data = {
			username: loginData.username,
			name: loginData.name,
			role: loginData.role,
			about: loginData.about
		}
		const token = jwt.sign(data, env.JWT_SECRET)
		// 43200 seconds = 12 hours
		res.cookie('jwt', token, { maxAge: 43200})
		res.send({
			success: true,
			token
		})

	} catch (ex) {
		console.log(ex)
		res.send({
			success: false
		})
	}
}

exports.register = async (req, res) => {
	const code = req.body.code
	const u_id = req.body.u_id

	console.log(u_id)

	// const reqToken = await axios.post("https://nidp.su.ac.th/nidp/oauth/nam/token", {
	// 	grant_type: "authorization_code",
	// 	client_id: env.CLIENT_ID,
	// 	redirect_uri: env.REDIRECT_URI,
	// 	client_secret: env.CLIENT_SECRET,
	// 	code
	// })

	try {
		const reqString = `?grant_type=authorization_code&client_id=${env.CLIENT_ID}&redirect_uri=${env.REDIRECT_URI}&client_secret=${env.CLIENT_SECRET}&code=${code}`
		const reqToken = await axios.post("https://nidp.su.ac.th/nidp/oauth/nam/token" + reqString)
		const { access_token, token_type } = reqToken.data

		const reqUserInfo = await axios("https://nidp.su.ac.th/nidp/oauth/nam/userinfo", {
			method: "GET",
			headers: {
				Authorization: token_type + " " + access_token
			}
		})

		const email = reqUserInfo.data.website
		// console.log(reqUserInfo.data)

		console.log(email)

		// const reqStaff =  await axios("https://eassess.su.ac.th/web1/WebService/api_checkin_std_getdata.php?u=" + email, {
		// 	method: "GET",
		// 	headers: {
		// 		Authorization: `Basic ${env.API_USERNAME}:${env.API_PASSWORD}`
		// 	}
		// })


		// 
		// 

		const reqStaff = await axios("https://eassess.su.ac.th/web1/WebService/api_checkin_staff_getdata.php?u=" + email, {
			auth: {
				username: env.API_USERNAME,
				password: env.API_PASSWORD
			}
		})

		const dataStaff = reqStaff.data.pop()
		if (dataStaff.STAFFSTATUS === "1") {
			// Then Staff
			console.log("STAFF")

			const fullname = dataStaff.STAFFNAME + " " + dataStaff.STAFFSURNAME
			register_from_su_as_staff(
				u_id,
				dataStaff.STAFFID,
				fullname,
				dataStaff.PREFIXNAMEACAD,
				dataStaff.STAFFNAMEENG,
				dataStaff.STAFFNAME,
				dataStaff.STAFFSURNAMEENG,
				dataStaff.STAFFSURNAME,
				dataStaff?.DEPTNAMELEVEL1,
			)

			res.send({
				"success": true
			})
			return
		}

		// 

		const reqStd = await axios("https://eassess.su.ac.th/web1/WebService/api_checkin_std_getdata.php?u=" + email, {
			auth: {
				username: env.API_USERNAME,
				password: env.API_PASSWORD
			}
		})

		const dataStd = reqStd.data.pop()
		if (dataStd.STDSTATUS === "1") {
			// Then Std
			console.log("STD")
			const fullname = dataStd.STUDENTNAME + " " + dataStd.STUDENTSURNAME
			// register_std(u_id, dataStd.STUDENTCODE, fullname)

			register_from_su(
				u_id,
				dataStd.STUDENTCODE,
				fullname,
				dataStd.PREFIXNAME,
				dataStd.STUDENTNAMEENG,
				dataStd.STUDENTNAME,
				dataStd.STUDENTSURNAMEENG,
				dataStd.STUDENTSURNAME,
				dataStd.FACULTYNAME,
				dataStd.LEVELNAME,
			)

			res.send({
				"success": true
			})
			return
		}


		console.log("NOT STD && NOT STAFF")
		res.send({
			"success": false
		})


	} catch (ex) {
		// Handle error
		console.log("Error", ex)
		res.send({
			"success": false
		})
	}

}