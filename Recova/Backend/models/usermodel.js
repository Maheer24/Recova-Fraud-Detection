import mongoose from "mongoose"
import bcrypt from 'bcrypt'

import jwt from "jsonwebtoken"
const usermodel =new mongoose.Schema({

    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        minlength:[6,"Email should not be less than 5 letters"],
        maxlength:[20,"Email should not be more than 20 letters"]

    },
    password:{
        type:String,
        required:true,
        select:false,   //it will not show password in response
       
        

    }
    
})


usermodel.statics.hashpassword = async function(password){
    return await bcrypt.hash(password,10);

}
usermodel.methods.comparepassword = async function (password) {
    return await bcrypt.compare(password, this.password);

    
}
usermodel.methods.generatetoken = function () {
    return jwt.sign({email:this.email}, process.env.JWT_SECRET,  { expiresIn: "24h" })
}

const user = mongoose.model("user",usermodel);

export default user;