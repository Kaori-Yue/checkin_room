import React, { useContext, useEffect, useState } from 'react'
import { FacultyContext } from '../../store/FacultyContext'
import Axios from 'axios'
import { getCountAdmin } from '../../api'
import { Link, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers } from '@fortawesome/free-solid-svg-icons'

function index() {
	// const [faculty] = useContext(FacultyContext)
	const [data, setData] = useState(null)
	const { state } = useLocation()

	console.log(data);

	useEffect(() => {
		getCountAdmin()
			.then(res => setData(res.data))
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
							<th>{d.role}</th>
							<td>{d.faculty_name}</td>
							<td>{d.count}</td>
							<td>
								<Link to={"/users/group/" + d.role} className="mr-3">
									<FontAwesomeIcon icon={faUsers} color='black' title="จัดการผู้ใช้" />
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
					<div className='col-9 mx-auto text-right'>
						<Link to={'/users/adduser'}>
							<button className='btn btn-primary'>เพิ่มผู้ดูแล</button>
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
									<th>จำนวนผู้ดูแล</th>
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
