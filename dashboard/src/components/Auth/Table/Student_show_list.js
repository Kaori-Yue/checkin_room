import React, { useEffect, useState } from 'react'
import Axios from 'axios'
import env from './../../../../../env.json'
import { change_date_format } from '../../../Helper'
//const helper = require('./../../../Helper')
import { useHistory } from "react-router";



function Student_show_list(prop) {


    const { student_in, current_class, room_select } = prop
    const [student_reg, setStudent] = useState([])
    const [kick_id,set_kick_form] = useState('')

    useEffect(() => {
        if (current_class.class_id != undefined) {
            Axios({
                method: 'post',
                url: env.API + '/getReg',
                data: {
                    class_id: current_class.class_id,
                    class_sect: current_class.class_sect
                },
            }).then(res => {
                setStudent(res.data)
            }).catch(err => {
                console.log(err)
            })
        }

    }, [current_class])



    const kick_button = async function (event) {
        Axios({
            method: 'post',
            url: env.API + '/f_checkout',
            data: {
                student_id: event.target.value,
                room_id: room_select
            },
        }).then(res => {

        }).catch(err => {
            console.log(err)
        })
    }


   





    const _create_student_list = student_in && student_in.map((student, i) => {
        const { student_name, student_id, timestamp_checkin } = student
        let isReg = student_reg.filter(e => e.student_id == student_id).length > 0
        return (
            <tr class="d-flex">
                <th scope="row" class="col-1">{i + 1}</th>
                {/* <td class="col-2">{student_id}</td> */}
                <td class="col-5" stlye={{textAlign:"start"}} >{student_name}</td>
                <td class="col-4" >{change_date_format(timestamp_checkin)}</td>
                {/* <td class="col-1">
                    {isReg ? <button disabled={true} title="ลงทะเบียน" type="button" class="btn btn-success"></button> : <button disabled={true} type="button" title="ยังไม่ลงทะเบียน" class="btn btn-secondary"></button>}
                </td> */}
                <td class="col-2">
                    <a role="button"  href="#" data-toggle="modal" data-target={"#std-modal"+room_select} onClick={()=>{set_kick_form(student_id)}}>
                        Reject
                        </a>
                </td>
            </tr>

        )
    })

    return (


        <div style={{ width: "90%", margin: "auto", textAlign: "center" }} class="table-responsive" >
            <table class="table">
                <thead>
                    <tr class="d-flex">
                        <th class="col-1" scope="col">#</th>
                        {/* <th class="col-2" scope="col">รหัสนักศึกษา</th> */}
                        <th class="col-5" scope="col">ชื่อ-นามสกุล</th>
                        <th class="col-4" scope="col">เวลาที่ลงชื่อ</th>
                        {/* <th class="col-1" scope="col">สถานะ</th> */}
                        <th class="col-2" scope="col">จัดการ</th>
                    </tr>
                </thead>
                <tbody>
                    {_create_student_list}
                </tbody>
            </table>
            <div class="modal fade" id={"std-modal"+room_select} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                                ต้องการที่จะบังคับ {kick_id} ลงชื่อออกใช่หรือไม่?
                        </h5>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">ยกเลิก</button>
                            <button type="button" class="btn btn-danger" value={kick_id} onClick={kick_button} data-dismiss="modal">ยืนยัน</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}


export default Student_show_list;