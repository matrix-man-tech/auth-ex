const jwt = require('jsonwebtoken')

//model

const auth = (req,res,next) =>{
    //try to find expire cookies
    console.log(req.cookies)
    const token =
    
    
    req.header('Authorization').replace("Bearer","") 
    console.log(token);
    if(!token) {
        return res.status(403).send("token is missing")
    }

    try {
        const decode = jwt.verify(token, process.env.SECRET_KEY)
        console.log(decode);
    } catch (error) {
        return res.status(401).send("invalid token")
    }
    return next()
}
module.exports = auth