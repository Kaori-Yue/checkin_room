import React, { useEffect, useState } from "react";
import Axios from "axios";
import env from "./../../../../../env.json";
import QRCode from 'qrcode'

const qrcode_gen = async function (room_id) {
    // console.log('here');
    let url = "https://liff.line.me/1656648913-LPnNjRg6?roomId=" + room_id;

    let image_url = await QRCode.toDataURL(url, {
        width: 512
    });
    console.log(image_url);

    let img = new Image();
    img.src = image_url;

    let w = window.open(
        '',
        '_blank'
    )
    w.document.write(img.outerHTML);
    w.document.close()

}



function Room() {


    const [room_list, setRoom_list] = useState([]);
    const [keyword, setKeyword] = useState('');



    useEffect(() => {
        Axios.get(env.API + '/getroom')
            .then(res => {
                setRoom_list(res.data);
            })
    }, [])



    const handleKeyword = (event) => {
        setKeyword(event.target.value);
    }

    const show_room_list = room_list && room_list.map(room => {
        const { room_id, room_name, capacity } = room
        if (keyword == '' || room_name.indexOf(keyword) != -1) {
            return (
                <tr class="d-flex">
                    <th scope="row" class="col-1">{room_id}</th>
                    <td class="col-6">{room_name}</td>
                    <td class="col-2">{capacity}</td>
                    <td class="col-3">
                        <a onClick={() => {
                            qrcode_gen(room_id)
                        }}>
                            QR-CODE
                        </a>
                    </td>
                </tr>
            )
        }
    })







    return (
        <div>
            <br />
            <h2 style={{ textAlign: "center" }}>จัดการรายชื่อห้องเรียน</h2>
            <br />
            <input style={{ width: "50%", margin: "auto", textAlign: "center" }} class="form-control" type="text" placeholder="ค้นหาห้องที่นี่" value={keyword} onChange={handleKeyword} />
            <br />
            <div style={{ width: "80%", margin: "auto", textAlign: "center" }} class="table-responsive">
                <table class="table">
                    <thead>
                        <tr class="d-flex">
                            <th class="col-1" scope="col">ID</th>
                            <th class="col-6" scope="col">ชื่อห้อง</th>
                            <th class="col-2" scope="col">จำนวนคนที่กำหนด</th>
                            <th class="col-3" scope="col">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {show_room_list}
                    </tbody>
                </table>
            </div>

        </div>
    )
}

export default Room;