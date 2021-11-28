const axios = require('axios').default
const env = require('../../env.json')
const { register_std } = require('../repository_db/student_repo')

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
			register_std(u_id, dataStaff.STAFFID, fullname)

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
			register_std(u_id, dataStd.STUDENTCODE, fullname)

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