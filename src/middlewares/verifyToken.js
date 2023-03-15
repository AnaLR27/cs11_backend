const jwt = require("jsonwebtoken");


//Funcion de Alina que terminó dándome problemas.

// const verifyToken = (req, res, next) => {
//   const authHeader = req.headers.authorization || req.headers.Authorization;

//   if (!authHeader?.startsWith("Bearer ")) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
//       if (err) return res.status(403).json({ message: "Forbidden" });
//       req.user = decoded.UserInfo.email;
//       req.role = decoded.UserInfo.role;
//       req.id = decoded.UserInfo.id;
//       next();
//     });
//   } catch (error) {
//     try {
//       jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
//         if (err) return res.status(403).json({ message: "Forbidden" });
//         req.user = decoded.UserInfo.email;
//         next();
//       });
//     } catch (error) {
//       res.status(400).send("Expired Token");
//     }
//   }
// };

const verifyToken = (req, res, next) => {
  const token = req.header("auth-token") || req.header("Auth-token");
  if (!token) {
    return res.status(401).send("Access denied");
  }
  try {
    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    try {
      const verified = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
      req.user = verified;
      next();
    } catch (error) {
      res.status(400).send("Expired token");
    }
  }
};

module.exports = verifyToken;
