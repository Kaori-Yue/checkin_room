import React, { useContext, useState, useEffect } from 'react'
import { FacultyContext } from '../../../../store/FacultyContext'
import { UserInfoContext } from '../../../../store/UserInfoContext'
import { getRoomInfo } from '../../../../api'
import { useParams, useHistory } from 'react-router-dom'
import { editRoom } from '../../../../api'



function AddRoom() {
	const [faculty, setFaculty] = useContext(FacultyContext)
	const [userInfo, setUserInfo] = useContext(UserInfoContext)

	const [formValidate, setFormValidate] = useState(false)
	const [roomInfo, setRoomInfo] = useState(null)

	const { id } = useParams()
	const history = useHistory()

	useEffect(() => {
		getRoomInfo({ room_id: id })
			.then(res => setRoomInfo(res.data))
	}, [])

	console.log("ri", roomInfo)


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
		const req = await editRoom(json)
		console.log(req.data)

		if (!req.data.success) {
			// fail
			return history.push("/manage_room", {
				addRoom: {
					success: false,
					text: "แก้ไข SU Check-in ไม่สำเร็จ"
				}
			})
		}
		return history.push("/manage_room", {
			addRoom: {
				success: true,
				text: `แก้ไข SU Check-in (${json.room_name}) สำเร็จแล้ว`
			}
		})



	}

	const isPowerAdmin = (admin) => {
		if (admin === true)
			return (
				<select type="text" className="custom-select" name="faculty_id" required autofocus>
					{/* edit must have fac */}
					{/* <option selected value="" disabled>เลือกหน่วยงาน...</option> */}
					{
						faculty.map(fac => {
							return (<option selected={roomInfo?.data.faculty_id === fac.faculty_id} key={fac.faculty_id} value={fac.faculty_id}>{fac.faculty_name}</option>)
						})
					}
				</select>
			)
		// 

		const f = faculty.filter(fac => fac.faculty_id === roomInfo?.data.faculty_id).pop()
		return (
			<>
			<select disabled type="text" className="custom-select" required autofocus>
				<option selected value={f?.faculty_id ?? ""}>{f?.faculty_name || "N/A"}</option>
			</select>
			<input type="hidden" name="faculty_id" value={roomInfo?.data.faculty_id} />
			</>
		)
	}

	const preLoad = () => {
		if (roomInfo === null) {
			// Loading/Fetch
			return
		}


		if ((roomInfo?.data.faculty_id !== userInfo?.role) && userInfo?.role !== 0) {
			return (
				<div className="col-8 mx-auto text-center">
					<div class="alert alert-danger alert-block">
						<button type="button" class="close" data-dismiss="alert">×</button>
						<strong>Permission denied</strong>
					</div>
				</div>
			)
		}

		if (roomInfo?.data.deleted !== 0) {
			return (
				<div className="col-8 mx-auto text-center">
					<div class="alert alert-danger alert-block">
						<button type="button" class="close" data-dismiss="alert">×</button>
						<strong>Room not found</strong>
					</div>
				</div>
			)
		}

		// normal
		return (
			<>
				<div className="form-group">
					<label for="faculty_id">หน่วยงาน</label>
					
						{
							userInfo?.role === 0 ? isPowerAdmin(true) : isPowerAdmin(false)
						}

					<div className="invalid-feedback">
						กรุณาเลือกหน่วยงาน
					</div>
				</div>

				<div className="form-group">
					<label for="room_name">ID</label>
					<input readOnly type="text" className="form-control" name="room_id" required
						value={roomInfo?.data.room_id}
					/>
				</div>

				<div className="form-group">
					<label for="room_name">ชื่อจุด SU check-in</label>
					<input type="text" className="form-control" name="room_name" required
						// pattern="^[\w]{3,}$"
						pattern=".{3,}"
						defaultValue={roomInfo?.data.room_name}
					/>
					<div className="invalid-feedback">
						อย่างน้อย 3 ตัวอักษร
					</div>
				</div>

				<div className="form-group">
					<label for="capacity">จำนวนคนสูงสุด</label>
					<input type="text" className="form-control" name="capacity" required autofocus
						pattern="[1-9]\d{0,}"
						defaultValue={roomInfo?.data.capacity}
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
			</>
		)
	}


	return (
		<div className="container">
			<div className="row align-items-center pb-5">
				<div className="col-8 mt-3 mx-auto">
					<div className="">
						<form className={"card-body" + (formValidate ? " was-validated" : "")} onSubmit={handleSubmit} noValidate>
							<h3 className="text-center mb-3">แก้ไขจุด SU check-in</h3>

							{preLoad()}

						</form>
					</div>
				</div >
			</div >
		</div >
	)
}

export default AddRoom
