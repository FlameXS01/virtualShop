const jwt = require("jsonwebtoken");
const AppError = require("../errors/AppError")

const authenticate = (roles) => {
  return function (req, res, next){
    const authHeader = req.headers.authorization;
   // console.log("este es mi header: ", authHeader);
   // console.log("estos son los headers: ", req.headers)
    if(!authHeader){
      return next(new AppError("Necesita iniciar sesión", 403));
    }
   
    const token = authHeader.split(" ")[1];
    //console.log("token", token)
    try{
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      //console.log("este es mi token decodificado ", decodedToken)
      if(roles.includes(decodedToken.rol)){
        req.userData = { id: decodedToken.id }
        next();
      } else{
        return next(new AppError("Usted no posee el rol necesario para realizar esa acción",403));
      }
    }
    catch (error){
      return next(new AppError("Permiso denegado", 403))
    }
  };
};

module.exports = authenticate;
