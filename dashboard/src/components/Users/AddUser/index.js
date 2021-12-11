import React, { useContext, useState, useRef } from 'react'
import { FacultyContext } from '../../../store/FacultyContext'
import { UserInfoContext } from '../../../store/UserInfoContext'
import { createUser } from '../../../api'
import { useHistory } from 'react-router-dom'


function AddUser() {
	const [faculty, setFaculty] = useContext(FacultyContext)
	// const [userInfo, setUserInfo] = useContext(UserInfoContext)

	const [formValidate, setFormValidate] = useState(false)

	const btnSubmit = useRef()

	const history = useHistory()

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


		const form = new FormData(event.target)
		const json = Object.assign({}, ...Array.from(form.entries(), ([key, value]) => ({ [key]: value })))

		const faculty_name = faculty.find(f => f.faculty_id === +json.role)
		console.log(json)
		if (!faculty_name) {
			console.log("faculty_name is null")
			return
		}
		json.name = faculty_name.faculty_name
		// validate success
		if (btnSubmit.current) {
			btnSubmit.current.setAttribute("disabled", "disabled")
		}

		const req = await createUser(json)

		console.log(req.data)
		if (!req.data.success) {
			// fail
			return history.push("/users", {
				dialog: {
					success: false,
					text: "เพิ่มผู้ดูแลระบบ SU Check-in ไม่สำเร็จ"
				}
			})
		}
		return history.push("/users", {
			dialog: {
				success: true,
				text: `เพิ่มผู้ดูแลระบบ SU Check-in (${json.username}) สำเร็จแล้ว`
			}
		})



	}


	return (
		<div className="container">
			<div className="row align-items-center pb-5">
				<div className="col-8 mt-3 mx-auto">
					<div className="">
						<form className={"card-body" + (formValidate ? " was-validated" : "")} onSubmit={handleSubmit} noValidate>
							<h3 className="text-center mb-3">เพิ่มผู้ดูแลระบบ SU check-in</h3>


							<div className="form-group">
								<label for="faculty_id">หน่วยงาน</label>
								<select type="text" className="custom-select" name="role" required autofocus>
									<option selected value="" disabled>เลือกหน่วยงาน...</option>
									{
										faculty.map(fac => {
											return (<option key={fac.faculty_id} value={fac.faculty_id}>{fac.faculty_name}</option>)
										})
									}
								</select>
								<div className="invalid-feedback">
									กรุณาเลือกหน่วยงาน
								</div>
							</div>


							<div className="form-group">
								<label for="room_name">Email / Username</label>
								<input type="text" className="form-control" name="username" required
									// pattern="^[\w]{3,}$"
									pattern=".{3,}"
								/>
								<div className="invalid-feedback">
									อย่างน้อย 3 ตัวอักษร
								</div>
							</div>

							<div className="form-group">
								<label for="room_name">Password</label>
								<input type="password" className="form-control" name="password" required
									// pattern="^[\w]{3,}$"
									pattern=".{8,}"
								/>
								<div className="invalid-feedback">
									อย่างน้อย 8 ตัวอักษร
								</div>
							</div>

							<div className="form-group mt-4">
								<button ref={btnSubmit} type="submit" className="btn btn-primary btn-block">
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

export default AddUser
