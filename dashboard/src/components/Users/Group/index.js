import React, { useContext, useEffect, useState } from 'react'
import { FacultyContext } from '../../../store/FacultyContext'
import Axios from 'axios'
import { getUsersByGroupID } from '../../../api'
import { Link, useLocation, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faUsers } from '@fortawesome/free-solid-svg-icons'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

function index() {
	const [faculty] = useContext(FacultyContext)
	const [data, setData] = useState(null)
	const { state } = useLocation()
	const { id } = useParams()
	dayjs.extend(utc)

	const fac_name = faculty.find(f => f.faculty_id == id)?.faculty_name || "N/A"

	console.log(data);

	useEffect(() => {
		getUsersByGroupID({ groupID: id })
			.then(res => setData(res.data))
	}, [])
	const renderFaculty = () => {
		if (!data || data?.success === false)
			return

		return (
			data.data
				// .sort((a, b) => a.faculty_id - b.faculty_id)
				.map((d, index) => {
					const time = dayjs.utc(d.created_at)
					return (
						<tr>
							<th>{index + 1}</th>
							<td>{d.username}</td>
							<td title={time.format('HH:mm:ss')}>{time.format('DD-MM-YYYY')}</td>
							<td>
								<Link to={{
									pathname: '/users/delete',
									state: {
										username: d.username,
										groupID: id,
										groupName: fac_name

									}
								}} className="mr-3">
									<FontAwesomeIcon style={{ color: 'red' }} icon={faTrash} color='black' title="QR Code" />
								</Link>
							</td>
						</tr>
					)
				})
		)
	}

	return (
		<>

			<div className='container-fluid'>
				<div className='row mt-2'>
					<div className='col-9 mx-auto text-center'>
						<h4>รายชื่อผู้ดูแลระบบ</h4>
						<h4>{fac_name}</h4>
					</div>
				</div>


				{
					state?.dialog &&
					(
						state?.dialog.success
							? <div className='row mt-1'>
								<div className="col-9 mx-auto text-center">
									<div class="alert alert-success alert-block">
										<button type="button" class="close" data-dismiss="alert">×</button>
										<strong>{state?.dialog.text}</strong>
									</div>
								</div>
							</div>
							: <div className='row mt-1'>
								<div className="col-9 mx-auto text-center">
									<div class="alert alert-danger alert-block">
										<button type="button" class="close" data-dismiss="alert">×</button>
										<strong>{state?.dialog.text}</strong>
									</div>
								</div>
							</div>
					)
				}

				<div className='row mt-2'>
					<div className='col-9 mx-auto'>
						<table class="table table-striped">
							<thead>
								<tr>
									<th>#</th>
									<th>ชื่อผู้ใช้งาน</th>
									<th>เวลาที่สร้าง</th>
									<th>จัดการ</th>
								</tr>
							</thead>
							<tbody>
								{renderFaculty()}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</>
	)
}

export default index
