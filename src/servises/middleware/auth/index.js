const md5 = require("md5");

const Profile = require("../../profile/schema");

module.exports = async (req, res, next) => {
  // get authorization header from req.headers
  const { authorization } = req.headers;
  if (authorization) {
    // split with empty space and get second thing in array
    const [method, base64] = authorization.split(" "); //  encoded base64 => ['Basic','a5sa4d6sa4ds6a5']
    if (method === "Basic") {
      // encode , decoded base64
      const decodedBase64 = Buffer.from(base64, "base64").toString();
      // split decoded base64 and grab username and password from splitted array
      const [username, password] = decodedBase64.split(":"); //  ['ubeyt','123']
      // hashin password with md5 alg
      const hashedPassword = md5(password);
      // find user who has this username , password as hashed
      const userExists = await Profile.findOne(
        {
          username,
          password: hashedPassword,
        },
        { password: 0 }
      );
      if (userExists) {
        // password and username is correct
        req.user = userExists;
        next();
      } else {
        res
          .status(401)
          .send({ message: "Username or password is not correct!" });
      }
    } else {
      res.status(400).send({ message: "Authorization method must be Basic" });
    }
  } else {
    res
      .status(401)
      .send({ message: "Authorization headers is not sent in request" });
  }
};
