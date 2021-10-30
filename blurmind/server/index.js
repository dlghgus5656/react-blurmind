const express = require('express')
const app = express()

//mongodb+srv://hohyeon:<password>@blurmind.k70z2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

const Bodyparser = require('body-parser');
const cookieParser = require('cookie-parser')

const config = require('./config/key');

app.use(Bodyparser.urlencoded({extended:true}));
app.use(Bodyparser.json()); //json 분석

app.use(cookieParser());

const {User} = require("./models/User");
const {Counselor} = require("./models/Counselor");
const {auth} = require('./middleware/auth');
const {auth2} = require('./middleware/auth2');


const mongoose = require('mongoose');
const {userInfo} = require('os')
const {counselorInfo} = require('os')
mongoose.connect(config.mongoURI
).then(()=> console.log('MongoDB Connected..')).catch(err => console.log(err))




//내담자 회원가입 부분
app.post('/api/users/register', (req, res) => {
    //회원가입시 필요한 정보들을 데에터베이스에 저장
    const user = new User(req.body)
    user.save((err,userInfo) => {
        if(err) return res.json({success:false, err})
        return res.status(200).json({
            success:true
        })
    }) //정보들이 user 모델에 저장
})

//내담자 로그인 부분
app.post('/api/users/login', (req,res) => {

    //요청된 id가 데이터베이스에 있는지 찾음  
    User.findOne({id: req.body.id}, (err, user) => {
        if(!user){
            return res.json({
                loginSuccess: false,
                message: "id에 해당하는 유저가 없습니다."
            })
        }
            //요청된 id가 데이터베이스에 있을 때 비밀번호가 맞는지 확인
        user.comparePassword( req.body.password , (err, isMatch) => {
            if (!isMatch)
                return res.json({loginSuccess: false, message:"비밀번호가 틀렸습니다."})

            //비밀번호가 맞으면 토큰 생성
            user.generateToken((err, user) => {
                if(err) return res.status(400).send(err);

                //토큰을 쿠키에 저장
                res.cookie("x_auth",user.token)
                    .status(200)
                    .json({loginSuccess: true, userId:user._id})
            })
        })
    })
})

//내담자가 auth를 통해 인증이 되어야 게시글 쓰기 가능하도록 한 것
app.get('/api/users/auth', auth , (req,res) => {
    res.status(200).json({
        //client에 유저 정보를 제공
        _id: req.user._id,
        isAuth: true,
        id: req.user.id,
        nickname: req.user.nickname
    })
})

// 내담자 logout 부분
app.get('/api/users/logout', auth , (req,res) => {
    //유저를 찾아서 업데이트 시켜줌
    User.findOneAndUpdate({_id: req.user._id},
        {token: ""},//토큰을 지워줌
        (err, user) => {
            if(err) return res.json({success:false, err});
            return res.json({message: 'logout:success'})
        })
})




//상담사 회원가입 부분
app.post('/api/counselors/register', (req, res) => {
    //회원가입시 필요한 정보들을 데에터베이스에 저장
    const counselor = new Counselor(req.body)
    counselor.save((err,counselorInfo) => {
        if(err) return res.json({success:false, err})
        return res.status(200).json({
            success:true
        })
    }) //정보들이 counselor 모델에 저장
})

//상담사 로그인 부분
app.post('/api/counselors/login', (req,res) => {

    //요청된 email이 데이터베이스에 있는지 찾음  
    Counselor.findOne({email: req.body.email}, (err, counselor) => {
        if(!counselor){
            return res.json({
                loginSuccess: false,
                message: "email에 해당하는 상담사가 없습니다."
            })
        }
            //요청된 email이 데이터베이스에 있을 때 비밀번호가 맞는지 확인
        counselor.comparePassword( req.body.password , (err, isMatch) => {
            if (!isMatch)
                return res.json({loginSuccess: false, message:"비밀번호가 틀렸습니다."})

            //비밀번호가 맞으면 토큰 생성
            counselor.generateToken((err, counselor) => {
                if(err) return res.status(400).send(err);

                //토큰을 쿠키에 저장
                res.cookie("x_auth2",counselor.token)
                    .status(200)
                    .json({loginSuccess: true, counselorId:counselor._id})
            })
        })
    })
})

//상담사가 auth를 통해 인증이 되어야 상담이 가능하도록 한 것
app.get('/api/counselors/auth', auth2 , (req,res) => {
    res.status(200).json({
        //client에 상담사 정보를 제공
        _id: req.counselor._id,
        isAuth: true,
        id: req.counselor.id,
        name: req.counselor.name,
        email: req.counselor.email,
        career: req.counselor.career,
        image: req.counselor.image
    })
})



// 상담사 logout 부분
app.get('/api/counselors/logout', auth2 , (req,res) => {
    //상담사를 찾아서 업데이트 시켜줌
    Counselor.findOneAndUpdate({_id: req.counselor._id},
        {token: ""},//토큰을 지워줌
        (err, counselor) => {
            if(err) return res.json({success:false, err});
            return res.status(200).send({
                success:true
            })
        })
})



const port = 4000
app.listen(port, () => console.log('Example app listening on port!!'))
