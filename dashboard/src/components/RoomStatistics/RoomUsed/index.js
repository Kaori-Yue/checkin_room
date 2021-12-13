import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { roomStats } from '../../../api'

function index() {
	const { id } = useParams()
	const [data, setData] = useState()
	/** @typedef {NodeJS.Timer} */
	let intervalId = null

	const fetchData = async () => {
		return roomStats({ roomID: id })
			.then(res => {
				setData(res.data)
				intervalId = setTimeout(async() => {
					await fetchData()
				}, 5000);
			})
	}

	useEffect(() => {
		fetchData()

		return () => {
			clearTimeout(intervalId)
		}
	}, [])

	console.log(data);

	return (
		<div className="container-fluid">
			<div className='row' style={{ backgroundColor: '#45ab87' }}>
				<Link className="mx-auto" to={'/'}>
					<img width={120} className='' src={'/logo.png'} />
				</Link>
			</div>

			<div className='row mt-5'>
				<div className='col text-center'>
					<h2>{data?.data?.room_name ?? "N/A"}</h2>
				</div>
			</div>

			<div className='row mt-5'>
				<div className='col text-center'>
					<h3 className='text-danger'>จำนวนคนสูงสุด: {data?.data?.capacity ?? "N/A"}</h3>
				</div>
			</div>



			<div className='row mt-5'>
				<div className='col text-center'>
					<h3>ขณะนี้มีผู้ใช้งาน</h3>
				</div>
			</div>
			<div className='row mt-5'>
				<div className='col mt-5 text-center'>
					<h2 className='display-1'>{data?.data?.count ?? "N/A"}</h2>
				</div>
			</div>



		</div>

	)
}

export default index
