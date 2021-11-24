import React, { useContext, useState } from 'react'
import { FacultyContext } from '../../../../store/FacultyContext'
import { UserInfoContext } from '../../../../store/UserInfoContext'
import { AddRoom as AddRoomAPI } from '../../../../api'



function AddRoom() {
	console.log("add room")
	const [faculty, setFaculty] = useContext(FacultyContext)
	const [userInfo, setUserInfo] = useContext(UserInfoContext)

	const [formValidate, setFormValidate] = useState(false)


	console.log("context addroom: " + JSON.stringify(userInfo, null, 2))

	const handleSubmit = async (event) => {
		event.preventDefault()
		event.stopPropagation()

		setFormValidate(true)
		const inputs = Array.prototype.filter.call(event.target, function (input) {
			if (input.checkValidity() === false) {
				return input
			}
		})

		if (inputs.length !== 0)
			return

		// validate success
		const form = new FormData(event.target)
		const json = Object.assign({}, ...Array.from(form.entries(), ([key, value]) => ({ [key]: value })))
		console.log(json)
		// return
		const req = await AddRoomAPI(json)
		console.log(req.data)
		// const req = await Register({
		// 	invite_code: json.invite,
		// 	name: json.name,
		// 	username: json.username,
		// 	password: json.password
		// })

	}

	const isPowerAdmin = (admin) => {
		if (admin === true)
			return (
				<>
					<option selected value="" disabled>เลือกคณะ...</option>
					{
						faculty.map(fac => {
							return (<option key={fac.faculty_id} value={fac.faculty_id}>{fac.faculty_name}</option>)
						})
					}
				</>
			)
		// 

		const f = faculty.filter(fac => fac.faculty_id === userInfo?.role).pop()
		console.log("rol:,", f)
		console.log("role:,", f?.faculty_name)
		return (
			<>
				<option selected value={f?.faculty_id ?? ""}>{ f?.faculty_name || "N/A" }</option>
			</>
		)
	}


	return (
		<div className="container">
			<div className="row align-items-center pb-5">
				<div className="col-8 mt-3 mx-auto">
					<div className="">
						<form className={"card-body" + (formValidate ? " was-validated" : "")} onSubmit={handleSubmit} noValidate>
							<h3 className="text-center mb-3">เพิ่มห้อง</h3>

							<div className="form-group">
								<label for="faculty_id">คณะ</label>
								<select type="text" className="custom-select" name="faculty_id" required autofocus>
									{
										userInfo?.role === 0 ? isPowerAdmin(true) : isPowerAdmin(false)
									}
								</select>
								<div className="invalid-feedback">
									กรุณาเลือกคณะ
								</div>
							</div>

							<div className="form-group">
								<label for="room_name">ชื่อห้อง</label>
								<input type="text" className="form-control" name="room_name" required
									// pattern="^[\w]{3,}$"
									pattern=".{3,}"
								/>
								<div className="invalid-feedback">
									อย่างน้อย 3 ตัวอักษร
								</div>
							</div>

							<div className="form-group">
								<label for="capacity">จำนวนคนสูงสุด</label>
								<input type="text" className="form-control" name="capacity" required autofocus
									pattern="[1-9]\d{0,}"
								/>
								<div className="invalid-feedback">
									เฉพาะตัวเลขและมากกว่า 0
								</div>
							</div>

							<div className="form-group mt-4">
								<button type="submit" className="btn btn-primary btn-block">
									ยืนยัน
								</button>
							</div>

						</form>
					</div>
				</div>
			</div>
		</div>
	)
}

export default AddRoom
