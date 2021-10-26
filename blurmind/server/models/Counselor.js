// 상담사 DB
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10; //10자리인 salt
const jwt1 = require('jsonwebtoken');


const counselorSchema = mongoose.Schema({
    name:{
        type:String,
        maxlength: 20,
        unique:1 //똑같은 이름을 쓰지 못하도록 하는 것
    },
    id:{
        type:String,
        minlength: 5,
        trim:true, // 작성자가 공백을 써도 공백을 없애줌
        unique:1 //똑같은 아이디를 쓰지 못하도록 하는 것
    },
    email:{
        type:String,
        trim:true, // 작성자가 공백을 써도 공백을 없애줌
        unique:1 //똑같은 아이디를 쓰지 못하도록 하는 것
    },
    password:{
        type: String,
        minlength: 5
    },
    token:{
        type:String
    },
    tokenExp:{
        type:Number
    },//토큰을 사용할 수 있는 유효기간
    image:String,
    career:{
        type:String,
        minlength: 5,
    }
})

counselorSchema.pre('save', function(next){
    //비밀번호 암호화
    var counselor = this; //counselorSchema 가리킴

    // 비밀번호를 바꿀때만 암호화를 하게끔 조건을 걸어줌
    if(counselor.isModified('password')){
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err)

            //counselor.password => counselorSchema의 패스워드
            bcrypt.hash(counselor.password ,salt, function(err, hash){
                if(err) return next(err)
                counselor.password = hash
                next()
            })
        })
    }else{
        next()
    }
    
})

counselorSchema.methods.comparePassword = function(plainPassword, cb){
    //Plain Password와 암호화된 패스워드가 같은지 확인
    bcrypt.compare(plainPassword, this.password, function(err, ismatch){
        if(err) return cb(err);
        cb(null, ismatch)
    })  
}

counselorSchema.methods.generateToken = function(cb){
    //counselorSchema를 가리킴
    var counselor = this;
    //jsonwebtoken을 이용해 토큰 생성

    var token = jwt1.sign(counselor._id.toHexString(), 'secretToken1')

    counselor.token = token
    counselor.save(function(err, counselor){
        if(err) return cb(err)
        cb(null, counselor)
    })
}

//auth로 인증 시 토큰이 맞는지 복호화하는 작업
counselorSchema.statics.findByToken = function(token, cb){
    //counselorSchema를 가리킴
    var counselor = this;

    //토큰을 decode
    jwt1.verify(token, 'secretToken1', function(err, decoded){
        //상담사 아이디를 이용해 상담사를 찾고 클라이언트에서 가져온 토큰과 데베에 보관된 토큰이 일치하는지 확인
        counselor.findOne({"_id": decoded, "token": token}, function(err,counselor){
            if(err) return cb(err);
            cb(null,counselor)
        })
    })
}


const Counselor = mongoose.model('Counselor', counselorSchema)

module.exports = {Counselor}// 모델을 다른 곳에서도 사용할 수 있도록 해줌