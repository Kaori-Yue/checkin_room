import React, { useState, useCallback, useEffect, useContext } from 'react'
import { useCookies } from "react-cookie";
import Navbar from './components/Navbar'
import {
	Switch,
	Route,
	Redirect
} from "react-router-dom";
import Home from './components/Home';
import Table from './components/Auth/Table/Table';
import History from './components/Auth/History/History';
import Room from './components/Auth/Manage/Room';
import Class from './components/Auth/Manage/Class/Class';
import Class_schedule from './components/Auth/Manage/Class/Class_schedule';
import Table_class from './components/Auth/Table/Table_class';
import Register from './components/Register'
import Class_student from "./components/Auth/Manage/Class/Class_student";

import { FacultyContext, FacultyProvider } from './store/FacultyContext'
import ContextProvider from './store/providerComposer'
import AddRoom from './components/Auth/Manage/AddRoom'
import { UserInfoContext } from './store/UserInfoContext'
import jwt from 'jsonwebtoken'
import QRcode from './components/QRcode'

function App() {

	document.body.style.fontFamily = "Kanit, sans-serif"

	const [cookie, setCookie, removeCookie] = useCookies(['jwt']);



	const isToken = () => {
		return (cookie.jwt != 'undefined' && cookie.jwt != undefined)
	}


	const setToken = (token) => {
		setCookie('jwt', token, { path: '/' });
		console.log('setCookie success')
	}


	const removeToken = () => {
		console.log("remove success");
		removeCookie('jwt', { path: '/' });
	}

	//Autherication
	const [userInfo, setUserInfo] = useContext(UserInfoContext)


	useEffect(() => {
		const decode = jwt.decode(cookie.jwt)
		setUserInfo(decode)
	}, [cookie])

	const checkLogin = () => {
		if (isToken()) {



			return (
				<React.Fragment>

					<Navbar
						setToken={setToken}
						token={cookie.jwt}
						removeToken={removeToken}
						isToken={isToken}>
					</Navbar>
					<div className="AuthRoute">
						<Route exact path="/table">
							<Table />
						</Route>
						<Route exact path="/table_class">
							<Table_class />
						</Route>
						<Route exact path="/history">
							<History />
						</Route>
						<Route exact path="/manage_room">
							<Room />
						</Route>
						<Route exact path="/manage_class">
							<Class />
						</Route>
						<Route exact path="/class_schedule">
							<Class_schedule />
						</Route>
						<Route exact path="/class_student">
							<Class_student />
						</Route>

						<Route exact path="/manage_room/add_room">
							<AddRoom />
						</Route>

						<Route exact path="/qrcode/:id">
							<QRcode />
						</Route>


					</div>
				</React.Fragment>
			)
		}
		else {
			return (
				<Redirect to={{ pathname: '/' }} />
			)
		}
	}



	return (
		<div className="App">

			<Switch>

				<Route exact path="/">
					<Navbar
						setToken={setToken}
						token={cookie.jwt}
						removeToken={removeToken}
						isToken={isToken}>
					</Navbar>
					<Home isToken={isToken} />
				</Route>

				{/* <Route exact path="/register">
					<Register />
				</Route> */}

				{checkLogin()}
			</Switch>
		</div>

	)






}




export default App;




//Day = ['Monday,Tuesday']

//hour = [1,2,3,4,5,6,7]

/*
	1 = 8.30-9.20
	2 = 9.25 - 10.40
	3 = 10.50 - 12.05
*/


//Date.now  => Day? hour?


//select from Class_table
//where day = day_input and hour = hour_input
//and room_id = room_id


/*
Class Table
-class_name
-Day_
-Hour = [1,2,3,4,5,6,7]
-class_id

Regis_Class_Tran
-class_id
-student_id

send_checkin(room_id){
	Date=>{Day,hour} -->Class Table --> Checkin

}




*/