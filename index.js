const app = require('./app')
const {PORT} = process.env


app.listen(PORT,() =>{
    console.log(`server running at port ${PORT}`);
})