import React, { useState, useCallback, useContext } from 'react';
import Axios from 'axios'
import { useCookies } from "react-cookie";
import jwt from 'jsonwebtoken'
import { Link } from 'react-router-dom';
import env from './../../../env.json';

function Login(prop) {

	const {
		setToken, token, removeToken, isToken
	} = prop



	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');


	const onChangeUsername = function (event) {
		setUsername(event.target.value);
	}

	const onChangePassword = function (event) {
		setPassword(event.target.value);
	}


	const getLogin = (event) => {
		event.preventDefault()
		Axios({
			method: 'post',
			url: env.API + '/login',
			data: {
				username: username,
				password: password
			},
			withCredentials: true
		}).then((res) => {
			if (res.data.success) {
				console.log(res.data)
				setToken(res.data.token)
			}
			else {
				alert("Login ไม่สำเร็จ กรุณาใส่ Usename หรือ Password ให้ถูกต้อง หรือติดต่อเจ้าหน้าที่")
			}
		})
	}


	const getLogout = () => {
		removeToken()
	}



	if (isToken()) {
		console.log(isToken())
		return (
			<form class="form-inline my-2 my-lg-0" action="/" onSubmit={getLogout}>
				<li class="nav-item dropdown">
					<a style={{ color: "white" }} class="nav-link dropdown-toggle navbar-text " href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
						{jwt.decode(token).name ? jwt.decode(token).name : ""}
					</a>
					<div class="dropdown-menu " aria-labelledby="navbarDropdown">
						<button class="dropdown-item  text-danger" type="submit" >ออกจากระบบ</button>
					</div>
				</li>


			</form>
		)
	}
	else {
		return (
			<form class="form-inline my-2 my-lg-0" action="#" onSubmit={getLogin}>
				<input class="form-control mr-sm-2" type="text" placeholder="Username" value={username} onChange={onChangeUsername}></input>
				<input class="form-control mr-sm-2" type="password" id="password" placeholder="Password" value={password} onChange={onChangePassword}></input>
				<button style={{ backgroundColor: "#228763", color: "white" }} class="btn  my-2 my-sm-0" type="submit" >เข้าสู่ระบบ</button>
			</form>
		)
	}
}




function Navbar(prop) {

	const {
		setToken, token, removeToken, isToken
	} = prop;

	const showOnlyPowerAdmin = () => {
		if (jwt.decode(token).role !== 0)
			return
		return (
			<li class="nav-item dropdown">
				<a class="navbar-brand dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					Admin
				</a>
				<div style={{ backgroundColor: "white" }} class="dropdown-menu " aria-labelledby="navbarDropdown">
					<li className="dropdown-item navbar-text">
						<Link to="/groups" className="navbar-text text-dark">หน่วยงาน</Link>
					</li>

					<li class="dropdown-item navbar-text">
						<Link style={{ color: "black" }} to="/users" class="navbar-text">ผู้ดูแลระบบ</Link>
					</li>




				</div>
			</li>
		)
	}



	function hideNavbar() {
		if (isToken()) {
			return (
				<ul class="navbar-nav mr-auto">
					<li class="nav-item dropdown">
						<a class="navbar-brand dropdown-toggle " href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
							Real-Time
						</a>
						<div style={{ backgroundColor: "white" }} class="dropdown-menu " aria-labelledby="navbarDropdown">
							<li class="dropdown-item navbar-text">
								<Link style={{ color: "black" }} to="/table" class="navbar-text">จุด SU check-in</Link>
							</li>
							{/* 
              <li class="dropdown-item navbar-text">
                <Link style={{color:"black"}} to="/table_class" class="navbar-text">รายวิชา</Link>
              </li> */}
						</div>
					</li>
					<li class="nav-item active">
						<Link to="/history" class="navbar-brand">ประวัติ</Link>
					</li>
					<li class="nav-item dropdown">
						<a class="navbar-brand dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
							จัดการ
						</a>
						<div style={{ backgroundColor: "white" }} class="dropdown-menu " aria-labelledby="navbarDropdown">
							<li class="dropdown-item navbar-text">
								<Link style={{ color: "black" }} to="/manage_room" class="navbar-text">จัดการจุด SU check-in</Link>
							</li>

							{/* <li class="dropdown-item navbar-text">
                <Link style={{color:"black"}} to="/manage_class" class="navbar-text">จัดการรายวิชาเรียน</Link>
              </li> */}

							<li className="dropdown-item navbar-text">
								<Link to="/manage_room/add_room" className="navbar-text text-dark">เพิ่มจุด SU check-in</Link>
							</li>


						</div>
					</li>
					{showOnlyPowerAdmin()}
				</ul>

			)
		}
	}



	return (

		<div>
			<nav style={{ backgroundColor: "#45ab87" }} class="navbar navbar-expand-lg navbar-dark">

				<Link to="/" class="navbar-brand">หน้าแรก</Link>
				<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
					<span class="navbar-toggler-icon"></span>
				</button>
				<div class="collapse navbar-collapse" id="navbarSupportedContent">

					{hideNavbar()}


					<Login
						setToken={setToken}
						token={token}
						removeToken={removeToken}
						isToken={isToken}
					/>
				</div>
			</nav>
		</div>
	)
}

export default Navbar;