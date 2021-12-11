import React, { useContext, useState, useRef } from 'react'
import { FacultyContext } from '../../../store/FacultyContext'
import { UserInfoContext } from '../../../store/UserInfoContext'
import { createGroup } from '../../../api'
import { useHistory } from 'react-router-dom'



function AddGroup() {
	const [faculty, setFaculty] = useContext(FacultyContext)
	const [userInfo, setUserInfo] = useContext(UserInfoContext)

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

		// validate success
		if (btnSubmit.current) {
			btnSubmit.current.setAttribute("disabled", "disabled")
		}
		const form = new FormData(event.target)
		const json = Object.assign({}, ...Array.from(form.entries(), ([key, value]) => ({ [key]: value })))
		console.log(json)
		// return
		
		const req = await createGroup(json)

		console.log(req.data)
		if (!req.data.success) {
			// fail
			return history.push("/groups", {
				dialog: {
					success: false,
					text: "เพิ่มหน่วยงาน SU Check-in ไม่สำเร็จ"
				}
			})
		}
		return history.push("/groups", {
			dialog: {
				success: true,
				text: `เพิ่มหน่วยงาน SU Check-in (${json.groupName}) สำเร็จแล้ว`
			}
		})
		
		

	}


	return (
		<div className="container">
			<div className="row align-items-center pb-5">
				<div className="col-8 mt-3 mx-auto">
					<div className="">
						<form className={"card-body" + (formValidate ? " was-validated" : "")} onSubmit={handleSubmit} noValidate>
							<h3 className="text-center mb-3">เพิ่มหน่วยงาน SU check-in</h3>

							<div className="form-group">
								<label for="room_name">ชื่อหน่วยงาน</label>
								<input type="text" className="form-control" name="groupName" required
									// pattern="^[\w]{3,}$"
									pattern=".{3,}"
								/>
								<div className="invalid-feedback">
									อย่างน้อย 3 ตัวอักษร
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

export default AddGroup
