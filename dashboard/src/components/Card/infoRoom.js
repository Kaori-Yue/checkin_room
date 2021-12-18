/// <reference path="../../../@types/api.d.ts"/>

import React, { Component, createRef } from 'react'
import { Bar, getElementAtEvent } from 'react-chartjs-2'
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,

} from 'chart.js';
import axios from 'axios'
import env from '../../../../env.json'
import Loading from '../Loading'
import { withRouter } from 'react-router-dom'
import { withCookies } from "react-cookie";
import jwt from 'jsonwebtoken'


class infoRoom extends Component {
	constructor(props) {
		super(props)
		ChartJS.register(
			CategoryScale,
			LinearScale,
			BarElement,
			Title,
			Tooltip,
			Legend
		);

		const { allCookies } = props
		this.chartRef = createRef()
		this.state = {
			isLoading: true,
			role: jwt.decode(allCookies.jwt)?.role,
		}
		this.reload

		// Binding
		this.onClickElement = this.onClickElement.bind(this)

	}

	componentDidMount() {
		this.update()
		console.log(this.props)
	}

	componentWillUnmount() {
		clearTimeout(this.reload)
	}

	async update(params) {
		// TODO 
		/** @type {import('axios').AxiosResponse<getRoom_in[]>} */
		const dataRoom = await axios({
			method: 'GET',
			url: env.API + '/getroom_in?faculty_id=' + this.state.role
		})



		const labels = []
		// [0] use | [1] space
		const datasets = [{
			label: 'used slot',
			backgroundColor: 'rgba(8, 173, 0, 0.2)',
			borderColor: 'rgba(8, 173, 0, 1)',
			borderWidth: 1,
			// barThickness: 15,
			hoverBackgroundColor: 'rgba(8, 173, 0, 0.4)',
			hoverBorderColor: 'rgba(8, 173, 0, 1)',
			data: [],
			roomIds: [],
			stack: 'stack1'
		},
		{
			label: 'free slot',
			backgroundColor: 'rgba(78, 242, 229, 0.2)',
			borderColor: 'rgba(78, 242, 229, 1)',
			borderWidth: 1,
			// barThickness: 15,
			hoverBackgroundColor: 'rgba(78, 242, 229, 0.4)',
			hoverBorderColor: 'rgba(78, 242, 229, 1)',
			data: [],
			roomIds: [],
			stack: 'stack1'
		}]

		for (const room of dataRoom.data) {
			labels.push(room.room_name)
			datasets[0].data.push(room.count)
			datasets[1].data.push(room.capacity - room.count)

			datasets[0].roomIds.push(room.room_id)
			datasets[1].roomIds.push(room.room_id)
			// datasets[0].data.push(room.capacity)
		}
		this.setState({
			labels,
			datasets,
			isLoading: false,
			totalRoom: dataRoom.data.length
			// RoomsData: dataRoom.data
		})
		this.reload = setTimeout(this.update.bind(this), env.TIME_REFRESH)
	}

	onClickElement(_e) {
		if (_e.length < 1)
			return
		const e = _e[0]
		const { datasetIndex, index } = _e[0];
		const datasets = this.chartRef.current.config.data.datasets
		const selectDatasets = datasets[datasetIndex]
		const roomIds = selectDatasets.roomIds
		const roomId = roomIds[index]
		this.props.history.push('table?room_id=' + roomId)

	}


	render() {
		if (this.state.isLoading)
			return <Loading custom={{ width: '3rem', height: '3rem' }} />

		return (
			// options={{ onClick:(e, i)=> {console.log('c ',i)} }}

			<div className='col-9 mx-auto' style={{ height: ((this.state.totalRoom * 25 ) > 200) ? this.state.totalRoom * 25 : 200  + 'px' }}>
				{/* <Bar data={this.state} getElementAtEvent={this.onClickElement} /> */}
				{/* <Bar options={this.options} data={this.state} /> */}
				<Bar
					ref={this.chartRef}
					options={{

						responsive: true,
						indexAxis: 'y',
						maintainAspectRatio: false,

						// plugins: {
						// 	title: {
						// 		display: true,
						// 		text: 'สถานะการใช้งานปัจจุบัน',
						// 	},
						// },

					}}
					data={this.state}
					onClick={(e) => {
						// const dataset = getDatasetAtEvent(this.chartRef.current, e);
						const element = getElementAtEvent(this.chartRef.current, e);
						// const elements = getElementsAtEvent(this.chartRef.current, e);
						//
						this.onClickElement(element)
					}}
				/>

				{/* <ChartJS ></ChartJS> */}
			</div>
		)
	}
}

export default withCookies(withRouter(infoRoom))
// export default withRouter(infoRoom)