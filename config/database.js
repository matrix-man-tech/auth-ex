const mongoose = require('mongoose')

exports.connect = () =>{
    const{ MONGODB_URL} = process.env

mongoose.connect(MONGODB_URL, {
    useNewUrlParser: true
})
.then(
    console.log("db connected sucessfully")
)
.catch(error => {
    console.log("DB connection failed");
    console.log(error);
})
}

