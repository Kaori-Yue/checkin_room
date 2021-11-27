import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useLocation } from "react-router-dom";
import env from "../../../../../env.json";
import Student_show_list from './Student_show_list'
import Class_show_list from "./Class_show_list";
import jwt from 'jsonwebtoken'
import { useCookies } from "react-cookie";



function Table() {

    function useQuery() {
        return new URLSearchParams(useLocation().search);
    }


    let query = useQuery();

    const [room_list, setRoom_list] = useState([]);
    const [student_in, setStudent] = useState([]);
    const [room_select, setRoom_Select] = useState(0);
    const [current_class, setCurrent_class] = useState({})
    const [time_now, setTimeNow] = useState({
        hours: new Date().getHours(),
        minute: new Date().getMinutes()
    });
    const [room_select_data, set_room_select_data] = useState({})













    const set_current_class = function (obj) {
        setCurrent_class(obj)
    }



    function fetch_student(room_id) {
        return new Promise((resolve,reject)=>{
            Axios.get(env.API + '/getCheckin?room_id=' + room_id)
            .then(res => {
                setStudent(res.data);
                resolve(res.data)
            })
        })
        
    }


    useEffect(() => {
        fetch_student(room_select).then(res=>{
            setTimeout(()=>{
                setTimeNow({
                    hours: new Date().getHours(),
                    minute: new Date().getMinutes()
                })
            },env.TIME_REFRESH)
        })
    }, [time_now])



    useEffect(()=>{
        fetch_student(room_select)
        let t = room_list.filter(e => e.room_id == room_select)
        set_room_select_data(t)
    },[room_select])


    const [cookie, setCookie, removeCookie] = useCookies(['jwt']);


    useEffect(() => {


        setTimeout(() => {
            setTimeNow({
                hours: new Date().getHours(),
                minute: new Date().getMinutes()
            })

        }, env.TIME_REFRESH)

        let admin_role = jwt.decode(cookie.jwt).role;

        Axios.get(env.API + '/getroom?faculty_id='+admin_role)
            .then(res => {
                setRoom_list(res.data)
                setRoom_Select(query.get('room_id')?parseInt(query.get('room_id')):0)
            }).catch(err => {
                console.log(err)
            })

    }, [])





    const handleSelect = function (event) {
            let target = event.target.value;
            setRoom_Select(target);
    }


    const reject_all_button = function () {
        Axios({
            method: 'post',
            url: env.API + '/reject_all',
            data: {
                room_id: room_select
            },
        }).then(res => {

        }).catch(err => {
            console.log(err)
        })
    }







    return (
        <div class="container">
            <br />
            <h2 style={{ textAlign: "center" }}>บันทึกการใช้งาน SU Check-in</h2>
            <br />
            <select style={{ width: "50%", margin: "auto", textAlign: "center" }} class="form-control" id="room_select" value={room_select}onChange={handleSelect}>
                <option value={0} >-- กรุณาเลือกจุด SU Check-in --</option>
                {room_list && room_list.map(room => {
                    return (
                        <option value={room.room_id} key={room.room_id}>{room.room_name}</option>
                    )
                })}
            </select>
            <br />
            {/* <Class_show_list room_select={room_select} current_class={current_class} set_current_class={set_current_class} time_now={time_now} /> */}
            <br />
            <div class="row">
                <div class="col-4">
                </div>
                <div class="col-2">
                    {/* <button class="btn btn-success" disabled={true}>
                    </button>
                    <small> : ลงทะเบียนในวิชานี้</small> */}
                </div>
                <div class="col-2">
                    {/* <button class="btn btn-secondary" disabled={true}>
                    </button>
                    <small> : ไม่ได้ลงทะเบียนในวิชานี้</small> */}
                </div>
                <div class="col-1">
                </div>
                <div class="col-1">
                    <b title="จำนวนคนใช้ห้องตอนนี้">{room_select_data[0] ? student_in.length + "/" + room_select_data[0].capacity : "-"}</b>
                </div>
                <div class="col-2">
                    <button type="button" class="btn btn-outline-secondary" data-toggle="modal" data-target="#clear-all">Reject-All</button>
                </div>
            </div>
            <div class="row pb-2">
                <div class="col text-center" >
                    {/* <button style={{float:"right"}} class="btn btn-outline-secondary" onClick={refresh_button_active}><span class="glyphicon glyphicon-refresh"></span> Refresh</button> */}
                </div>

            </div>

            <Student_show_list student_in={student_in} current_class={current_class} room_select={room_select} />
            <div class="modal fade" id={"clear-all"} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div style={{ backgroundColor: "red" }} class="modal-header">
                            <h5 class="modal-title text-white" id="exampleModalLabel">ยืนยันการบังคับลงชื่อออก</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <h5>
                                ต้องการที่จะล้างการลงชื่อทั้งหมดในห้องนี้หรือไม่?
                        </h5>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">ยกเลิก</button>
                            <button type="button" class="btn btn-danger" onClick={reject_all_button} data-dismiss="modal">ยืนยัน</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}









export default Table;