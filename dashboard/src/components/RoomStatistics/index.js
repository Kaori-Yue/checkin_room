import React, { useContext, useEffect, useState } from 'react'
import { FacultyContext } from '../../store/FacultyContext'
import Axios from 'axios'
import { roomStatistics } from '../../api'
import { Link, useLocation } from 'react-router-dom'

function index() {
	// const [faculty] = useContext(FacultyContext)
	const [data, setData] = useState(null)
	const [dataTotal, setDataTotal] = useState({
		totalCheckin: 0,
	})

	const { state } = useLocation()

	console.log(data);

	useEffect(() => {
		roomStatistics()
			.then(res => {
				setData(res.data)
				let total = 0
				for (const d of res.data.data) {
					total += d.count
				}
				setDataTotal({
					totalCheckin: total
				})

			})
	}, [])

	const renderFaculty = () => {
		if (!data)
			return


		return (
			data.data
				// .sort((a, b) => a.faculty_id - b.faculty_id)
				.map((d, index) => {
					return (
						<tr>
							<th>{index + 1}</th>
							<td>{d.faculty_name}</td>
							<td>{d.room_name}</td>
							<td>{d.count}</td>
						</tr>
					)
				}
				)
		)
	}

	return (
		<>

			<div className='container-fluid'>
			<h3 className="text-center mt-3"> สถิติการใช้งาน</h3>

				{/* <div className='row mt-2'>
					<div className='col-9 mx-auto text-right'>
						<Link to={'/groups/addgroup'}>
							<button className='btn btn-primary'>เพิ่มหน่วยงาน</button>
						</Link>
					</div>
				</div> */}


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
									<th>หน่วยงาน</th>
									<th>จุด SU Check-in</th>
									<th>จำนวนการ Check-in</th>
								</tr>
							</thead>
							<tbody>
								{renderFaculty()}
								<tr className='table-secondary'>
									<td className='text-center' colSpan={2}>รวม</td>
									<td>{dataTotal.totalCheckin}</td>
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
