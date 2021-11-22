/// <reference path="../../../@types/api.d.ts"/>

import React, { Component } from 'react'
import { Bar, HorizontalBar } from 'react-chartjs-2'
import axios from 'axios'
import env from '../../../../env.json'
import Loading from '../Loading'
import { withRouter } from 'react-router-dom'



class infoRoom extends Component {
	constructor(props) {
		super(props)

		this.state = {
			isLoading: true
		}
		this.reload

		// Binding
		this.onClickElement = this.onClickElement.bind(this)
	}

	componentDidMount() {
		this.update()
	}

	componentWillUnmount() {
		clearTimeout(this.reload)
	}

	async update(params) {
		// TODO 
		/** @type {import('axios').AxiosResponse<getRoom_in[]>} */
		const dataRoom = await axios({
			method: 'GET',
			url: env.API + '/getroom_in?faculty_id=0'
		})



		const labels = []
		// [0] use | [1] space
		const datasets = [{
			label: 'use slot',
			backgroundColor: 'rgba(8, 173, 0, 0.2)',
			borderColor: 'rgba(8, 173, 0, 1)',
			borderWidth: 1,
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
			isLoading: false
		})
		this.reload = setTimeout(this.update.bind(this), env.TIME_REFRESH)
	}

	onClickElement(_e) {
		if (_e.length < 1)
			return
		const e = _e[0]
		const index = e._index
		const datasetIndex = e._datasetIndex
		const datasets = e._chart.config.data.datasets

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
			<HorizontalBar data={this.state} getElementAtEvent={this.onClickElement} />
		)
	}
}

export default withRouter(infoRoom)