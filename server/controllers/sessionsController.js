import { User } from "../db/dbConnection.js";
import bcrypt from "bcryptjs";

export async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body;
    console.log("req.body ", req.body);
    if (email && password) {
      const user = await User.findOne({ email: email });
      //const userId = ObjectId(user._id).valueOf();
      //console.log("user ", user);
      if (user) {
        const isPasswordvalid = await bcrypt.compare(password, user.password);
        if (isPasswordvalid) {
          req.session.regenerate(async function (err) {
            if (err) next(err);
            // store user information in session, typically a user id
            const sessionUser = {
              id: user._id.toString(),
              email: user.email,
              role: user.role,
            };
            req.session.user = sessionUser;
            console.log("AT LOGIN req.session.user", req.session.user);
            // save the session before redirection to ensure page
            // load does not happen before session is saved
            await req.session.save(function (err) {
              if (err) return next(err);
              console.log("User logged in, cookie sent"); //load FE in http://localhost:5173/, not http://127.0.0.1:5173/
              //res.redirect("/"); //redirects here after login
              res.status(200).send({ session: req.sessionID });
            });
          });
        } else {
          res.status(401).send({ error: "Wrong password" });
        }
      } else {
        res.status(404).send({ error: "User does not exist" });
      }
    } else {
      res.status(411).send({ error: "Email or password field empty" });
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
}

export async function logoutUser(req, res, next) {
  req.session.user = null;
  req.session.save(function (err) {
    if (err) next(err);

    // regenerate the session, which is good practice to help
    // guard against forms of session fixation
    req.session.regenerate(function (err) {
      if (err) next(err);
      //res.redirect("/");
    });
  });
  console.log({ message: "User logged out" });
  return res.clearCookie("connect.sid").send({ message: "User logged out" });
}

export async function sessionInfo(req, res, next) {
  console.log("BE req.params.id ", req.params.id);

  //console.log('PD req.session.cookie ', req.session.cookie);
  console.log("BE req.sessionID ", req.sessionID);
  console.log("BE req.session.user ", req.session.user); //Could send this as well
  //console.log('PD req.session ', req.session);
  if (req.params.id === req.sessionID) {
    //STRAIGHTEN THIS OUT
    //res.status(200).send({ isUserInSession: true });
    res.status(200).send({ sessionUser: req.session.user });
  } else {
    //res.status(200).send({ isUserInSession: false });
    res.status(200).send({ sessionUser: "user not logged in" });
  }
}

export async function sessionReturn(req, res, next) {
  console.log("BE req.session.cookie ", req.session.cookie);
  console.log("BE req.sessionID ", req.sessionID);
  console.log("BE req.session.user ", req.session.user); //Could send this as well
  if (req.session.user) {
    res.status(200).send({ sessionUser: req.session.user });
  } else {
    res.status(200).send({ sessionUser: "nobody home" });
  }
}

//:TODO
//user patch self (user)
//user patch any (admin)

//delete self (user)
//delete any (admin)
