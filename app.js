require("dotenv").config("express")
require('./config/database').connect()
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
var cookieParser = require('cookie-parser')
const swaggerUi = require('swagger-ui-express');

const User = require('./model/user')
const auth = require('./middleware/auth')

const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

const app = express()
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json())
app.use(cookieParser())

app.get('/',(req,res) =>{
    res.send("Hello user")
})

app.post('/register',async (req,res) =>{
    try {
        const{firstname,lastname,email,password} = req.body

    if(!(email&&password&&firstname&&lastname)) {
        res.status(400).send("all fields are required")
    }

    const existingUser =  await User.findOne({ email}) //promise is returning here

    if(existingUser){
        res.status(401).send("User already exists")
    }

    const myEncPassword = await bcrypt.hash(password,10)

    const user = await User.create({
        firstname,
        lastname,
        email:email.toLowerCase(),
        password: myEncPassword
    })

    //token
    const token = jwt.sign(
        {user_id: user._id, email},
        process.env.SECRET_KEY,
        {
            expiresIn: "2h"
        }

    )
    user.token = token
    
    //handle password situation --postman
     user.password = undefined

    res.status(201).json(user)
}
     catch (error) {
        console.log(error)
    }
}
)

app.post('/login',async(req,res) =>{
    try {
        const { email, password} = req.body
        if(!email && password){
            res.status(400).send("field is empty")
        }
    
        const user = await User.findOne({email})

    // if(!user){
    //     res.status(400).send("you are not registered")
    // }
    if(user && (await bcrypt.compare(password, user.password))){
        const token = jwt.sign(
            {user_id: user._id, email},
            process.env.SECRET_KEY,
            {
                expiresIn:"2h"
            }
            
        )
        // user.token = token
        // user.password = undefined
        // res.status(200).json(user)

        //for using cookies
        const option ={
            expires: new Date(Date.now() + 3 * 24 * 60 * 60* 1000),
            httpOnly: true , //only seen by backend server
        }

        res.status(200).json({
            success: true,
            token,
            user
        })
    }
    else{
    res.status(400).send("email or password is incorrect")
    }
    
   
}
     catch (error) {
        console.log(error);
    }
})

app.get('/dashboard',auth,(req,res) =>{
    res.send("Welcome to dashboard")
})

module.exports = app








