import React, { createRef, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import QRCode from 'qrcode'
import axios from 'axios'
import env from '../../../../env.json'

function index() {
	const { id } = useParams()
	const qrCodeRef = createRef();

	const [qrcode, setQRcode] = useState()
	const [room, setRoom] = useState()

	// https://checkin.su.ac.th/api/getroom?faculty_id=0

	useEffect(() => {

		// axios.get('https://checkin.su.ac.th/api/getroom?faculty_id=0').then(res => {
		// 	setRoom(res.data)
		// })

		// QRCode.toDataURL("https://liff.line.me/1656648913-LPnNjRg6?roomId=" + id, {
		// 	width: 384
		// }).then(data => {
		// 	setQRcode(data)
		// })

		Promise.all([
			axios.get(env.API + '/getroom?faculty_id=0'),
			QRCode.toDataURL("https://liff.line.me/1656648913-LPnNjRg6?roomId=" + id, { width: 384 })
		]).then(([res, qr]) => {
			const currentRoom = res.data.find(r => r.room_id == id)
			console.log(currentRoom)

			setRoom(currentRoom)
			setQRcode(qr)
		})


	}, [])

	const renderName = () => {
		console.log("y", room)
		const x = room.find(f => f.room_id == id)
		console.log("x", x)
		return ""
	}

	// useEffect(() => {
	// 	effect
	// 	return () => {
	// 		cleanup
	// 	}
	// }, [qrcode])

	// QRCode.toDataURL(data, {
	// 	width: 512
	// }).then(data => {

	// })

	return (
		<div>

			<div className="container">
				<div className="row mt-4">
					<div className="col text-center">
						<h3>{room?.room_name ?? "N/A"}</h3>
						<h4>{room?.room_name ? `จำนวนคนสูงสุด: ${room.capacity}` : "N/A"}</h4>
					</div>
				</div>
				<div className="row">
					<div className="col text-center">
						{room?.room_name ? <img src={qrcode}></img> : "No Room"}
					</div>
				</div>
			</div>




		</div>
	)
}

export default index
