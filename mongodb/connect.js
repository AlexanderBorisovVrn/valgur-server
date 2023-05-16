import mongoose from "mongoose";


const connect = (url)=>{
    mongoose.set('strictQuery',true);
    mongoose.connect(url,{dbName:'VALGUR'})
    .then(()=>console.log('MongoDB connected'))
    .catch(e=>console.log(e))
}

export default connect;