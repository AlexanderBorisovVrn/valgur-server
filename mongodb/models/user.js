import mongoose, { Schema,model } from "mongoose";


const UserSchema = new Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    avatar:{type:String},
    pass:{type:String,required:true},
    allProperties:[{type:Schema.Types.ObjectId,ref:"Property"}]
})

const UserModel = model("User",UserSchema);

export default UserModel;