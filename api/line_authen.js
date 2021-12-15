const { stat } = require('fs');

const axios = require('axios').default;


/**
 * 
 * @param {string} access_token 
 */
const authentication = async function(access_token){
    let status
    let req = await axios.get('https://api.line.me/v2/profile',{
        headers: {
            Authorization : 'Bearer '+access_token
        }
    })
    .catch(err=>{
        console.log(err)
        //status = err.response.status
    })
    status = req?.status;
    return status == 200? req.data : undefined
}


exports.middle_ware = async (req,res,next)=>{
    let access_token = req.headers.linetoken;
    let res_line_verify = (await authentication(access_token))

    if(res_line_verify!=undefined){
        req.body.u_id = res_line_verify.userId;
        next();
    }
    else{
        res.send({
            "success" : false,
            "error": "in middle ware"
        })
    }

}
