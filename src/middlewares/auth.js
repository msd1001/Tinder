const adminAuth = (req, res, next) => {
  console.log("Admin Auth is getting checked");
  const token = "xyz";
  const isAuthenticated = token === "xyz";
  if (!isAuthenticated) {
    res.status(401).send("unauthorized Request");
  } else {
    next();
  }
};
const userAuth = (req, res, next) => {
  console.log("userAuth Auth is getting checked");
  const token = "xyz";
  const isAuthenticated = token === "xyz";
  if (!isAuthenticated) {
    res.status(401).send("unauthorized Request");
  } else {
    next();
  }
};

module.exports = {
  adminAuth,
  userAuth,
};
