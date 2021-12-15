import React, { useContext, useState, useEffect } from 'react'
import { FacultyContext } from '../../../store/FacultyContext'
import { UserInfoContext } from '../../../store/UserInfoContext'
import { getRoomInfo } from '../../../api'
import { useParams, useHistory, useLocation } from 'react-router-dom'
import { deleteUser } from '../../../api'


function DeleteUser() {
	const [faculty, setFaculty] = useContext(FacultyContext)
	const [userInfo, setUserInfo] = useContext(UserInfoContext)

	const [formValidate, setFormValidate] = useState(false)

	const { state } = useLocation()
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
		const form = new FormData(event.target)
		const json = Object.assign({}, ...Array.from(form.entries(), ([key, value]) => ({ [key]: value })))
		console.log(json)
		// return

		// alert('submit')
		// return

		const req = await deleteUser(json)
		console.log(req.data)

		if (!req.data.success) {
			// fail
			return history.push("/users/group/" + state.groupID, {
				dialog: {
					success: false,
					text: `ลบผู้ใช้ (${state.username}) ไม่สำเร็จ`
				}
			})
		}
		return history.push("/users/group/" + state.groupID, {
			dialog: {
				success: true,
				text: `ลบผู้ใช้ (${state.username}) สำเร็จแล้ว`
			}
		})



	}


	const preLoad = () => {
		if (!state?.username) {
			// Loading/Fetch
			return history.replace('/users')
		}

		// normal
		return (
			<>
				<div className="form-group">
					<label for="faculty_id">หน่วยงาน</label>

					<select disabled type="text" className="custom-select" name="faculty_id" required autofocus>
						<option selected value={state.groupID}>{state.groupName}</option>
					</select>
					<input type="hidden" name="faculty_id" value={state.groupID} />

					<div className="invalid-feedback">
						กรุณาเลือกหน่วยงาน
					</div>
				</div>

				{/* <div className="form-group">
					<label for="room_name">ID</label>
					<input readOnly type="text" className="form-control" name="room_id" required
						value={state.groupID}
					/>
				</div> */}

				<div className="form-group">
					<label for="room_name">ชื่อผู้ใช้</label>
					<input type="text" className="form-control" name="username" required
						// pattern="^[\w]{3,}$"
						pattern=".{3,}"
						defaultValue={state.username}
						readOnly
					/>
					<div className="invalid-feedback">
						อย่างน้อย 3 ตัวอักษร
					</div>
				</div>


				<div className="form-group mt-4">
					<button type="button" className="btn btn-danger btn-block" data-toggle="modal" data-target="#exampleModal">
						ยืนยันการลบ
					</button>
				</div>
			</>
		)
	}

	const dialogConfirm = () => {
		if (!state?.username) {
			// Loading/Fetch
			return history.replace('/users')
		}
		
		return (
			<>
				<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
					<div class="modal-dialog" role="document">
						<div class="modal-content">
							<div class="modal-header">
								<h5 class="modal-title" id="exampleModalLabel">ยืนยันการลบ</h5>
								<button type="button" class="close" data-dismiss="modal" aria-label="Close">
									<span aria-hidden="true">&times;</span>
								</button>
							</div>
							<div class="modal-body">
								ยืนยันการลบผู้ใช้งาน "{state.username}"
							</div>
							<div class="modal-footer">
								<button type="button" class="btn btn-secondary" data-dismiss="modal">ยกเลิก</button>
								<button type="submit" class="btn btn-danger" data-toggle="modal" data-target="#exampleModal" >ยืนยัน</button>
							</div>
						</div>
					</div>
				</div>
			</>
		)
	}



	return (
		<div className="container">
			<div className="row align-items-center pb-5">
				<div className="col-8 mt-3 mx-auto">
					<div className="">
						<form className={"card-body" + (formValidate ? " was-validated" : "")} onSubmit={handleSubmit} noValidate>
							<h4 className="text-center mb-3">ลบผู้ใช้งาน</h4>

							{preLoad()}
							{dialogConfirm()}

						</form>
					</div>
				</div >
			</div >
		</div >
	)
}

export default DeleteUser
