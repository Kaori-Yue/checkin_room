import React, { useState, useCallback } from 'react';
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
    Axios({
      method: 'post',
      url: env.API + '/login',
      data: {
        username: username,
        password: password
      },
      withCredentials: true
    }).then((res) => {
      console.log(res.data)
      setToken(res.data.token)
    }).then(
      event.preventDefault()
    )
  }


  const getLogout = () => {
    removeToken()
  }



  if (isToken()) {
    console.log(isToken())
    return (
      <form class="form-inline my-2 my-lg-0" action="/" onSubmit={getLogout}>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle navbar-text btn " href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            {jwt.decode(token).name ? jwt.decode(token).name : ""}
          </a>
          <div class="dropdown-menu " aria-labelledby="navbarDropdown">
            <a class="dropdown-item " href="#">แก้ไขข้อมูล</a>
            <div class="dropdown-divider"></div>
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
        <button class="btn btn-outline-success my-2 my-sm-0" type="submit" >เข้าสู่ระบบ</button>
      </form>
    )
  }
}




function Navbar(prop) {

  const {
    setToken, token, removeToken, isToken
  } = prop;

  function hideNavbar() {
    if (isToken()) {
      return (
        <ul class="navbar-nav mr-auto">
          <li class="nav-item dropdown">
            <a class="navbar-brand " href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Real-Time
        </a>
            <div style ={{backgroundColor:"white"}}class="dropdown-menu " aria-labelledby="navbarDropdown">
              <li class="dropdown-item navbar-text">
                <Link style={{color:"black"}}to="/table" class="navbar-text">ห้องเรียน</Link>
              </li>

              <li class="dropdown-item navbar-text">
                <Link style={{color:"black"}} to="/table_class" class="navbar-text">รายวิชา</Link>
              </li>
            </div>
          </li>
          <li class="nav-item active">
            <Link to="/history" class="navbar-brand">ประวัติ</Link>
          </li>
          <li class="nav-item dropdown">
            <a class="navbar-brand dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              จัดการ
        </a>
            <div style ={{backgroundColor:"white"}}class="dropdown-menu " aria-labelledby="navbarDropdown">
              <li class="dropdown-item navbar-text">
                <Link style={{color:"black"}} to="/manage_room" class="navbar-text">จัดการห้องเรียน</Link>
              </li>
              <li class="dropdown-item navbar-text">
                <Link style={{color:"black"}} to="/manage_student" class="navbar-text">จัดการรายชื่อนักศึกษา</Link>
              </li>
              <li class="dropdown-item navbar-text">
                <Link style={{color:"black"}} to="/manage_class" class="navbar-text">จัดการรายวิชาเรียน</Link>
              </li>
            </div>
          </li>
        </ul>

      )
    }
  }



  return (

    <div>
      <nav style={{backgroundColor:"#45ab87"}}class="navbar navbar-expand-lg navbar-dark">

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