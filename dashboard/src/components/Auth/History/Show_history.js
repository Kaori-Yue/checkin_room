import React from "react";
import { change_date_format } from '../../../Helper'


function Show_history({ history_list }) {



return (
        <div style={{ margin: "auto", textAlign: "center" }} class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr class="d-flex">
                        <th class="col-4" scope="col">จุด SU check-in</th>
                        {/* <th class="col-2" scope="col">รหัสนักศึกษา</th> */}
                        <th class="col-4 text-left" scope="col">ชื่อ-นามสกุล</th>
                        <th class="col-2" scope="col">เวลาเข้า</th>
                        <th class="col-2" scope="col">เวลาออก</th>
                        {/* <th class="col-1" scope="col">โดย</th> */}
                    </tr>
                </thead>
                <tbody>
                    {history_list && history_list.map(e => {
                        const {
                            room_name, student_id, student_name, timestamp_checkin, timestamp_checkout, role
                        } = e

                        let _role 
                        if (role ==0) {
                            _role = "ปกติ"
                        }else if (role==1){
                            _role = "บังคับ"
                        }
                        else {
                            _role = role
                        }

                        return (
                            <tr class="d-flex">
                                <td scope="row" class="col-4">{room_name}</td>
                                {/* <td class="col-2">{student_id}</td> */}
                                <td style={{ textAlign: "left" }} class="col-4">{student_name}</td>
                                <td class="col-2">{change_date_format(timestamp_checkin)}</td>
                                <td class="col-2" >{timestamp_checkout == null ? null : change_date_format(timestamp_checkout)}</td>
                                {/* <td class="col-1" >{_role}</td> */}

                            </tr >
                        )

                    })}
                </tbody>
            </table>
        </div>
    )
}

export default Show_history;