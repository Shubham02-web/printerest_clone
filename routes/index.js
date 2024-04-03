var express = require("express");
var router = express.Router();
let userModule = require("../modules/user");
let postModule = require("../modules/post");
let passport = require("passport");
let passportLocal = require("passport-local");
passport.authenticate(new passportLocal(userModule.authenticate()));
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/profile", isLoggedIn, function (req, res, next) {
  res.send("profile");
});

router.post("/register", function (req, res, next) {
  const { username, email, fullName } = req.body;
  const userData = new userModule({ username, email, fullName });

  userModule.register(userData, req.body.password).then(function () {
    passport.authenticate("local")(req, res, function () {
      res.redirect("/profile");
    });
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/",
  }),
  function (req, res) {}
);

router.get("/logout", function (req, res) {
  req.logOut(function (err) {
    if (err) return next(err);
    res.redirect("/");
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/");
}
module.exports = router;
