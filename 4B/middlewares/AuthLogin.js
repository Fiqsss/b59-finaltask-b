exports.isLogin = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  } else {
    req.session.flash = {
      message: "Please login first.",
      type: "error",
    };
    res.redirect("/login");
  }
};

exports.isAlreadyLoggedIn = (req, res, next) => {
    if (req.session && req.session.user) {
      return res.redirect("/provinsi");  
    }
    next();
  };
  