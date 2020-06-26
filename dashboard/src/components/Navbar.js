import React ,{useState, useCallback}from 'react';
import Axios from 'axios'
import { useCookies } from "react-cookie";
import jwt from 'jsonwebtoken'
import { Link } from 'react-router-dom';



function Login(prop){

  const {
    setToken,token,removeToken,isToken
  } = prop



    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');


    const onChangeUsername = function(event){
      setUsername(event.target.value);
    }

    const onChangePassword = function(event){
      setPassword(event.target.value);
    }


    const getLogin = ()=>{
        Axios({
          method:'post',
          url:'https://jackerle.bike:8888/login',
          data:{
            username:username,
            password:password
          },
        }).then((res)=>{
          console.log(res)
          setToken(res.data.token)
      })
    }

    const getLogout = ()=>{
        removeToken()
    }



      if(isToken()){
        console.log(isToken())
        return(
          <form class="form-inline my-2 my-lg-0"   onSubmit= {getLogout}>
            <button class="btn btn-secondary" disabled={true}>{jwt.decode(token).name}</button>
            <button class="btn btn-outline-secondary my-2 my-sm-0" type="submit" >ออกจากระบบ</button>
          </form>
        )
      }
      else{
        return(
          <form class="form-inline my-2 my-lg-0"  action="#" onSubmit= {getLogin}>
          <input class="form-control mr-sm-2" type="text"  placeholder="Username" value={username} onChange={onChangeUsername}></input>
          <input class="form-control mr-sm-2" type="password" id = "password" placeholder="Password" value={password} onChange={onChangePassword}></input>
          <button class="btn btn-outline-success my-2 my-sm-0" type="submit" >เข้าสู่ระบบ</button>
        </form>
        )
      }
  }




function Navbar(prop) {

  const {
    setToken,token,removeToken,isToken
  } = prop;




  return (

    <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      
      <Link to="/" class="navbar-brand">หน้าแรก</Link>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
          <Link to="/table" class="navbar-brand">การใช้ห้อง</Link>
          </li>
        </ul>
        <Login
        setToken = {setToken}
        token = {token}
        removeToken = {removeToken}
        isToken = {isToken}
        />
      </div>
    </nav>
    </div>
  )
}

export default Navbar;