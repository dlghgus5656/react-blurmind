//내담자 -> User 모델을 가져옴
const { User } = require("../models/User");

//상담사 -> Counselor 모델을 가져옴
const { Counselor } = require("../models/Counselor");

let auth = (req,res, next) => {
    //인증 처리를 하는 곳

    //client 쿠키에서 토큰 가져오기
    let token = req.cookies.x_auth;

    //토큰을 복호화 한 후 유저를 찾음
    User.findByToken(token, (err, user) => {
        if(err) throw err;
        if(!user) return res.json({isAuth: false, error: true})

        req.token = token;
        req.user = user;
        next();
    })
/** 
    let token2 = req.cookies.x_auth2;

        //토큰을 복호화 한 후 상담사를 찾음
    Counselor.findByToken(token2, (err, counselor) => {
        if(err) throw err;
        if(!counselor) return res.json({isAuth: false, error: true})

        req.token = token2;
        req.counselor = counselor;
        next();
}) **/

}





module.exports = {auth};
//module.exports = {auth2};