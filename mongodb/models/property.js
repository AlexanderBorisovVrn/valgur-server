import mongoose,{Schema,model}from "mongoose";

const PropertySchema = new Schema({
    title:{type:String,required:true},
    description:{type:String,required:true},
    propertyType:{type:String,required:true},
    location:{type:String,required:true},
    price:{type:Number,required:true},
    photo:{type:String},
    creator:{type:Schema.Types.ObjectId,ref:"User"},
})

const PropertyModel = model("Property",PropertySchema);
export default PropertyModel;