import React, { useContext, useEffect, useState } from 'react'
import { FacultyContext } from '../../store/FacultyContext'
import Axios from 'axios'
import { getRoomCreatedInfo } from '../../api'
import { Link, useLocation } from 'react-router-dom'

function index() {
	// const [faculty] = useContext(FacultyContext)
	const [data, setData] = useState(null)
	const [dataTotal, setDataTotal] = useState({
		created: 0,
		available: 0,
		deleted: 0
	})

	const { state } = useLocation()

	console.log(data);

	useEffect(() => {
		getRoomCreatedInfo()
			.then(res => {
				setData(res.data)
				let created = 0
				let available = 0
				let deleted = 0
				for (const d of res.data.data) {
					created += d.created
					available += d.available
					deleted += d.deleted
				}
				setDataTotal({
					created, available, deleted
				})

			})
	}, [])

	const renderFaculty = () => {
		if (!data)
			return


		return (
			data.data
				// .sort((a, b) => a.faculty_id - b.faculty_id)
				.map(d => {
					return (
						<tr>
							<th>{d.faculty_id}</th>
							<td>{d.faculty_name}</td>
							<td>{d.created}</td>
							<td>{d.available}</td>
							<td>{d.deleted}</td>
						</tr>
					)
				}
				)
		)
	}

	return (
		<>

			<div className='container-fluid'>
				<div className='row mt-2'>
					<div className='col-9 mx-auto text-right'>
						<Link to={'/groups/addgroup'}>
							<button className='btn btn-primary'>เพิ่มหน่วยงาน</button>
						</Link>
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
									<th>ID</th>
									<th>หน่วยงาน</th>
									<th>จำนวนห้องที่สร้างทั้งหมด</th>
									<th>จำนวนห้องที่ใช้งาน</th>
									<th>จำนวนห้องที่ไม่ได้ใช้งาน</th>
								</tr>
							</thead>
							<tbody>
								{renderFaculty()}
								<tr className='table-secondary'>
									<td className='text-center' colSpan={2}>รวม {data?.data.length || 0} หน่วยงาน</td>
									<td>{dataTotal.created}</td>
									<td>{dataTotal.available}</td>
									<td>{dataTotal.deleted}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</>
	)
}

export default index
