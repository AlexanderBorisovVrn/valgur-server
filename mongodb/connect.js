import mongoose from "mongoose";
import TokenModel from "./models/token.js";
import UserModel from "./models/user.js";
import PropertyModel from "./models/property.js";


const deleteMany = async (model)=>{
   const {deletedCount} =await model.deleteMany({});
    console.log(`${deletedCount} deleted`)
}

const dropAllDB= async ()=>{
  const {deletedCount:modelDeleted} =await TokenModel.deleteMany({});
  const {deletedCount:userDeleted} =await UserModel.deleteMany({});
  const {deletedCount:propertiesDeleted} =await PropertyModel.deleteMany({});
   console.dir({model:modelDeleted,user:userDeleted,properties:propertiesDeleted})
}
const connect = (url) => {
  mongoose.set("strictQuery", true);
  mongoose
    .connect(url, { dbName: "VALGUR" })
    .then(() => {
      console.log("MongoDB connected");
    })
    .catch((e) => console.log(e));
};

export default connect;
