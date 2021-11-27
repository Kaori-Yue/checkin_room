const std_repo = require('./../../api/repository_db/student_repo');
const jwt = require('jsonwebtoken');
const env = require('./../../env.json')
const crypto = require('crypto');


exports.login = async (req,res)=>{
    let username = req.body.username;
    let password = req.body.password;
    let hash_password = crypto.createHash('sha256').update(password).digest('hex');
    try {
        let data = await std_repo.login(username,hash_password);
        if(data[0]){
            let _token = {
                username:data[0].username,
                name:data[0].name,
                role:data[0].role,
                about:data[0].about
            }
            let token = jwt.sign(_token,env.JWT_SECRET);
            res.cookie('jwt',token,{maxAge: 3600000})
            res.send({
                "success":true,
                "token":token,
                "data":data[0]
            })
        }else{
            res.send({
                "success":false
            })
        }
    }
    catch(ex){
        console.log(ex)
        res.send({
            "success":false
        })
    }
}


exports.register = async (req,res)=>{
    let username = req.body.username;
    let password = req.body.password;
    let name = req.body.name;
    let about = req.body.about;
	let role = req.body.role;
    let hash_password = crypto.createHash('sha256').update(password).digest('hex');
    try {
        let data = await std_repo.register(username,hash_password,name,role,about);
        res.send({
            "success":true
        })
    }
    catch(ex){
        console.log(ex);
        res.send({
            "success":false
        })
    }
}