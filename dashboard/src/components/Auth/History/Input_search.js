import React, { useState, useEffect } from "react";
import env from './../../../../../env.json'
import Axios from 'axios'


function Input_search({
    handle_student_id,
    handle_student_name,
    handle_class_id,
    handle_class_name,
    handle_start_time,
    handle_end_time,
    handle_room_id,
    onClick_button
}) {

    const [room_list, setRoom_list] = useState([])
    const [class_list, setClass_list] = useState([])


    useEffect(() => {
        Axios.get(env.API + '/getroom')
            .then(res => {
                setRoom_list(res.data)
            }).catch(err => {
                console.log(err)
            })
        Axios.get(env.API + '/getClass')
            .then(res => {
                setClass_list(res.data)
            }).catch(err => {
                console.log(err)
            })
    }, [])


    const room_select_element = room_list && room_list.map(e => {
        const { room_id, room_name } = e

        return (
            <option value={room_id}>{room_name}</option>
        )
    })


    const class_select_element = class_list && class_list.map(e => {
        const { class_id, class_sect, class_name } = e

        return (
            <option value={class_id + "-" + class_sect}>{class_id+"-"+class_sect+" "+class_name}</option>
        )

    })




    return (

        <form >
            <div class="shadow rounded">
                <div class="row p-3 rounded " data-toggle="collapse" style={{ backgroundColor: "#ededeb" }} >
                    <div class="col-4 pt-1">
                        <b>1. ค้นหาด้วยนักศึกษา</b>
                    </div>
                    <div class="col-2">
                        <input type="text" class="form-control" placeholder="ใส่รหัสนักศึกษา" onChange={handle_student_id} />
                    </div>
                    <div class="col-6">
                        <input type="text" class="form-control" placeholder="ใส่ชื่อนักศึกษา" onChange={handle_student_name} />
                    </div>
                </div>



                {/* <div class="row p-3  rounded " data-toggle="collapse" style={{ backgroundColor: "#ededeb" }} >
                    <div class="col-4 pt-1">
                        <b>2. ค้นหาด้วยวิชา</b>
                    </div>
                    <div class="col-8">
                        <select class="form-control" onChange={handle_class_id}>
                            <option value="-">--กรุณาเลือกวิชา--</option>
                            {class_select_element}
                        </select>
                    </div>
                </div> */}



                <div class="row p-3 rounded " data-toggle="collapse" style={{ backgroundColor: "#ededeb" }} >
                    <div class="col-4 pt-1">
                        <b>2. ค้นหาด้วยเวลา</b>
                    </div>
                    <div class="col-4">
                        <label for="start-time">เวลาเริ่มต้น:</label>
                        <input type="date" name="start-time" onChange={handle_start_time} />
                    </div>
                    <div class="col-4">
                        <label for="end-time">เวลาสิ้นสุด:</label>
                        <input type="date" name="end-time" onChange={handle_end_time} />
                    </div>
                </div>




                <div class="row p-3  rounded " data-toggle="collapse" style={{ backgroundColor: "#ededeb" }} >
                    <div class="col-4 pt-1">
                        <b>3. ค้นหาด้วยห้อง</b>
                    </div>
                    <div class="col-2">
                        <select class="form-control" onChange={handle_room_id}>
                            <option value="">--กรุณาเลือกห้อง--</option>
                            {room_select_element}
                        </select>
                    </div>

                </div>
            </div>


            <div class="row p-3">
                <div class="col-9">
                    <small>* หากไม่ใส่ข้อมูลในช่องนั้นๆ จะถือว่าเป็นการเลือกทั้งหมด</small>
                </div>
                <div class="col-1"></div>
                <div class="col-1">
                    <button type="button" class="btn btn-outline-secondary  btn-lg" onClick={onClick_button}>ค้นหา</button>
                </div>
            </div>
        </form>
    )
}

export default Input_search;