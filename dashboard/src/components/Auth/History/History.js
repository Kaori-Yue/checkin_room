import React, { useState, useEffect, useContext } from "react";
import Input_search from "./Input_search";
import Axios from "axios";
import env from './../../../../../env.json'
import Show_history from "./Show_history";
import { UserInfoContext } from '../../../store/UserInfoContext'

function History() {

	const [input_student_id, set_input_student_id] = useState('')
	const [input_student_name, set_input_student_name] = useState('')
	const [input_class_id, set_input_class_id] = useState('')
	const [input_class_sect, set_input_class_sect] = useState('')
	const [input_start_time, set_input_start_time] = useState('2020-01-25')
	const [input_end_time, set_input_end_time] = useState('2029-01-25')
	const [input_room_id, set_input_room_id] = useState('')
	const [search_button, set_search_button] = useState(0);
	const [history_list, setHistory] = useState([])
	const [current_page, set_current_page] = useState(null)
	const [userInfo] = useContext(UserInfoContext)


	useEffect(() => {

	}, [search_button])

	const handle_student_id = (event) => {
		set_input_student_id(event.target.value);
	}

	const handle_student_name = (event) => {
		set_input_student_name(event.target.value);
	}

	const handle_class_id = (event) => {
		if (event.target.value == '_') {
			set_input_class_id('')
			set_input_class_sect('')
		}
		else {
			set_input_class_id(event.target.value.split('-')[0])
			set_input_class_sect(event.target.value.split('-')[1])
		}

	}


	const handle_start_time = (event) => {
		set_input_start_time(event.target.value);
	}

	const handle_end_time = (event) => {
		set_input_end_time(event.target.value);
	}

	const handle_room_id = (event) => {
		set_input_room_id(event.target.value)
	}


	const fetch_history = (page) => {
		if (page != null) {
			Axios({
				method: 'post',
				url: env.API + '/get_history',
				data: {
					student_id: input_student_id,
					student_name: input_student_name,
					class_id: input_class_id,
					class_sect: input_class_sect,
					start_time: input_start_time,
					end_time: input_end_time,
					room_id: input_room_id,
					page: page,
					role_id: userInfo.role
				},
			}).then(res => {
				setHistory(res.data)
			}).catch(err => {
				console.log(err)
			})
		}

	}

	const onClick_button = () => {
		set_current_page(0)
		fetch_history(0)
	}


	const next_page_handle = () => {

		fetch_history(current_page + 1)
		set_current_page(current_page + 1)

	}


	const previous_page_handle = () => {
		fetch_history(current_page - 1)
		set_current_page(current_page - 1)
	}







	return (
		<div class="container">
			<br />
			<h2 style={{ textAlign: "center" }}>ประวัติการใช้งาน</h2>
			<br />
			<Input_search
				handle_student_id={handle_student_id}
				handle_student_name={handle_student_name}
				handle_class_id={handle_class_id}
				handle_start_time={handle_start_time}
				handle_end_time={handle_end_time}
				handle_room_id={handle_room_id}
				onClick_button={onClick_button}
			/>
			<Show_history history_list={history_list} />
			{
				(() => {
					if (current_page != null) {
						return (
							<nav aria-label="Page navigation" >
								<div class="row">
									<div class="col-2">
										{current_page == 0 ? <div></div> : <div role="button" class="pt-3 pb-1 rounded " style={{ backgroundColor: "#45AB87", textAlign: "center", color: "white" }} onClick={previous_page_handle} >
											<p>{"ก่อนหน้า"}</p>
										</div>}
									</div>
									<div class="col-8"></div>
									<div class="col-2">
										{
											(() => {
												if (history_list.length >= 15) {
													return (
														<div class="pt-3 pb-1 rounded " role="button" style={{ backgroundColor: "#45AB87", textAlign: "center", color: "white" }} onClick={next_page_handle}>
															<p>{"ถัดไป"}</p>
														</div>
													)
												}
											})()
										}
									</div>
								</div>
							</nav>

						)
					}
				})()
			}
			<br />
			<br />

		</div>
	)
}

export default History;