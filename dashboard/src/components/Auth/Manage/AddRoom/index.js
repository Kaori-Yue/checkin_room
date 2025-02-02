import React, { useContext, useState, useRef } from 'react'
import { FacultyContext } from '../../../../store/FacultyContext'
import { UserInfoContext } from '../../../../store/UserInfoContext'
import { AddRoom as AddRoomAPI } from '../../../../api'
import { useHistory } from 'react-router-dom'



function AddRoom() {
	console.log("add room")
	const [faculty, setFaculty] = useContext(FacultyContext)
	const [userInfo, setUserInfo] = useContext(UserInfoContext)

	const [formValidate, setFormValidate] = useState(false)

	const btnSubmit = useRef()

	const history = useHistory()


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
		if (btnSubmit.current) {
			btnSubmit.current.setAttribute("disabled", "disabled")
		}
		const form = new FormData(event.target)
		const json = Object.assign({}, ...Array.from(form.entries(), ([key, value]) => ({ [key]: value })))
		console.log(json)
		// return

		const req = await AddRoomAPI(json)

		console.log(req.data)
		if (!req.data.success) {
			// fail
			return history.push("/manage_room", {
				addRoom: {
					success: false,
					text: "เพิ่มจุด SU Check-in ไม่สำเร็จ"
				}
			})
		}
		return history.push("/manage_room", {
			addRoom: {
				success: true,
				text: `เพิ่มจุด SU Check-in (${json.room_name}) สำเร็จแล้ว`
			}
		})



	}

	const isPowerAdmin_select = (admin) => {
		if (admin === true)
			return (
				<select type="text" className="custom-select" name="faculty_id" required autofocus>
					<option selected value="" disabled>เลือกหน่วยงาน...</option>
					{
						faculty.map(fac => {
							return (<option key={fac.faculty_id} value={fac.faculty_id}>{fac.faculty_name}</option>)
						})
					}
				</select>
			)
		// 

		const f = faculty.filter(fac => fac.faculty_id === userInfo?.role).pop()
		console.log("rol:,", f)
		console.log("role:,", f?.faculty_name)
		return (
			<>
				<select disabled type="text" className="custom-select" required autofocus>
					<option selected value={f?.faculty_id ?? ""}>{f?.faculty_name || "N/A"}</option>
				</select>
				<input type='hidden' name='faculty_id' value={f?.faculty_id ?? ""} />
			</>
		)
	}


	return (
		<div className="container">
			<div className="row align-items-center pb-5">
				<div className="col-8 mt-3 mx-auto">
					<div className="">
						<form className={"card-body" + (formValidate ? " was-validated" : "")} onSubmit={handleSubmit} noValidate>
							<h3 className="text-center mb-3">เพิ่มจุด SU check-in</h3>

							<div className="form-group">
								<label for="faculty_id">หน่วยงาน</label>
								{userInfo?.role === 0 ? isPowerAdmin_select(true) : isPowerAdmin_select(false)}
								<div className="invalid-feedback">
									กรุณาเลือกหน่วยงาน
								</div>
							</div>

							<div className="form-group">
								<label for="room_name">ชื่อจุด SU check-in</label>
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

export default AddRoom
