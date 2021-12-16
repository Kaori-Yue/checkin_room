import React, { useEffect, useState, useContext } from "react";
import Axios from "axios";
import env from "../../../../../env.json";
import QRCode from 'qrcode'
import { useCookies } from "react-cookie";
import jwt from 'jsonwebtoken'
import { FacultyContext } from '../../../store/FacultyContext'
import { useRouteMatch, Link, useLocation, useHistory } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQrcode, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { faWindowMaximize } from '@fortawesome/free-regular-svg-icons'


const qrcode_gen = async function (room_id) {
	// console.log('here');
	let url = "https://liff.line.me/1656648913-LPnNjRg6?roomId=" + room_id;

	let image_url = await QRCode.toDataURL(url, {
		width: 512
	});
	console.log(image_url);

	let img = new Image();
	img.src = image_url;

	let w = window.open(
		'',
		'_blank'
	)
	w.document.write(img.outerHTML);
	w.document.close()

}



function Room() {
	const [faculty, setFaculty] = useContext(FacultyContext)
	console.log("context: " + JSON.stringify(faculty, null, 2))
	// const faculty = useContext(FacultyContext)

	const [room_list, setRoom_list] = useState([]);
	const [keyword, setKeyword] = useState('');
	const [cookie, setCookie, removeCookie] = useCookies(['jwt']);

	const { state } = useLocation()

	const admin_role = jwt.decode(cookie.jwt).role;
	useEffect(() => {
		// cache
		// if (faculty.length === 0)
		// Axios.get(env.API + '/get_faculty')
		// 	.then(res => {
		// 		setFaculty(res.data?.data);
		// 	})


		Axios.get(env.API + '/getroom?faculty_id=' + admin_role)
			.then(res => {
				setRoom_list(res.data);
			})
	}, [])



	const handleKeyword = (event) => {
		setKeyword(event.target.value);
	}

	const show_room_list = room_list && room_list.filter(f => f.deleted == false).map(room => {
		const { room_id, room_name, capacity, faculty_id, deleted } = room
		if (keyword == '' || room_name.indexOf(keyword) != -1) {
			return (
				<tr className="">
					{
						// power admin
						admin_role === 0 ?
							<>
								<td scope="row" className="col-1">{room_id}</td>
								<td className="col-3">{faculty.find(fac => fac.faculty_id == faculty_id)?.faculty_name ?? "N/A"}</td>
								<td className="col-4">{room_name}</td>
								<td className="col-2">{capacity}</td>
								<td className="col-2">
									{/* <a href="#" onClick={() => {
										qrcode_gen(room_id)
									}}>
										QR-CODE
									</a> */}
									<Link to={"/qrcode/" + room_id} className="mr-3">
										<FontAwesomeIcon icon={faQrcode} color='black' title="QR Code" />
									</Link>

									<Link to={"/manage_room/edit/" + room_id} className="mr-3">
										<FontAwesomeIcon icon={faEdit} title="Edit" />
									</Link>

									<Link to={{
										pathname: '/manage_room/view/' + room_id,
									}} className="mr-3">
										<FontAwesomeIcon icon={faWindowMaximize} title="Display" />
									</Link>

									<Link to={"/manage_room/delete/" + room_id} className="mr-3">
										<FontAwesomeIcon icon={faTrash} color='red' title="Delete" />
									</Link>


									{/* Rename */}
								</td>
							</>
							:
							<>
								<td scope="row" className="col-1">{room_id}</td>
								<td className="col-6">{room_name}</td>
								<td className="col-2">{capacity}</td>
								<td className="col-3">
									{/* <Link to={"/qrcode/" + room_id}>
										QR-CODE
									</Link> */}

									<Link to={"/qrcode/" + room_id} className="mr-3">
										<FontAwesomeIcon icon={faQrcode} color='black' title="QR Code" />
									</Link>

									<Link to={"/manage_room/edit/" + room_id} className="mr-3">
										<FontAwesomeIcon icon={faEdit} title="Edit" />
									</Link>

									<Link to={{
										pathname: '/manage_room/view/' + room_id,
									}} className="mr-3">
										<FontAwesomeIcon icon={faWindowMaximize} title="Display" />
									</Link>

									<Link to={"/manage_room/delete/" + room_id} className="mr-3">
										<FontAwesomeIcon icon={faTrash} color='red' title="Delete" />
									</Link>

								</td>
							</>
					}

				</tr>
			)
		}
	})



	console.log("state addroom:", JSON.stringify(state))

	const fakeStatus = () => {
		history.push("/manage_room", {
			addRoom: {
				success: true,
				text: "success"
			}
		})
	}


	return (
		<div>
			<br />
			<h2 style={{ textAlign: "center" }}>จัดการจุด SU check-in</h2>
			<br />

			<div class="input-group mb-3 col-9 mx-auto">
				<input
					className="form-control text-center"
					type="text"
					placeholder="ค้นหาจุด SU check-in"
					value={keyword}
					onChange={handleKeyword}
				/>

			</div>

			{
				state?.addRoom &&
				(
					state?.addRoom.success
						? <div className="col-9 mx-auto text-center">
							<div class="alert alert-success alert-block">
								<button type="button" class="close" data-dismiss="alert">×</button>
								<strong>{state?.addRoom.text}</strong>
							</div>
						</div>
						: <div className="col-9 mx-auto text-center">
							<div class="alert alert-danger alert-block">
								<button type="button" class="close" data-dismiss="alert">×</button>
								<strong>{state?.addRoom.text}</strong>
							</div>
						</div>
				)
			}


			<br />
			{/* <div style={{ width: "80%", margin: "auto", textAlign: "center" }} class="table-responsive"> */}

			<div class="table-responsive col-9 mx-auto table-striped">
				<table class="table">
					<thead>
						<tr className="">
							{
								admin_role === 0 ?
									<>
										<th class="col-1" scope="col">ID</th>
										<th class="col-3" scope="col">หน่วยงาน</th>
										<th class="col-4" scope="col">ชื่อจุด SU check-in</th>
										<th class="col-2" scope="col">จำนวนคนที่กำหนด</th>
										<th class="col-2" scope="col">จัดการ</th>
									</>
									:
									<>
										<th class="col-1" scope="col">ID</th>
										<th class="col-6" scope="col">ชื่อห้อง</th>
										<th class="col-2" scope="col">จำนวนคนที่กำหนด</th>
										<th class="col-3" scope="col">จัดการ</th>
									</>

							}
						</tr>
					</thead>
					<tbody>
						{show_room_list}
					</tbody>
				</table>

			</div>

		</div>
	)
}

export default Room;
