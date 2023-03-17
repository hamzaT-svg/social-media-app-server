import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const isOurToken = token.length < 500;
  try {
    let decodedData;
    if (token && isOurToken) {
      decodedData = jwt.verify(token, "testedSecret");
      req.userId = decodedData?.id;
    } else {
      decodedData = jwt.decode(token);
      req.userId = decodedData?.sub;
    }
    next();
  } catch (err) {
    console.log(err);
  }
};

export default auth;
