const express = require("express");
const jwt = require("jsonwebtoken");
const secretKey = "abcd12345gugug";
const { users } = require("./users-data");
const { allPosts } = require("./posts");
const app = express();
const port = 3000;
app.use(express.json());
app.post("/login", (req, res) => {
  const userEmail = req.body.email;
  const userPhone = req.body.phone;
  if (!userEmail || !userPhone) {
    return res.status(400).json({ message: "Email and Phone are required" });
  }
  let currentUser;
  for (let i = 0; i < users.length; i++) {
    if (userEmail === users[i].email && userPhone === users[i].phone) {
      currentUser = users[i];
      break;
    }
  }
  if (currentUser) {
    const token = jwt.sign({ id: currentUser.id }, secretKey);
    console.log("Generated Token:", token);
    // console.log(currentUser.id);
    return res.status(200).json({
      message: "Login Successful",
      token,
    });
  } else {
    res.status(401).json({
      message: "Email or phone is incorrect!",
    });
  }
});

app.get("/islogin", authenticate, (req, res) => {
  let user = req.user;
  // console.log(user);
  return res.status(200).json({
    message: "is logged in",
    user,
  });
});

// profile.........................
app.get("/profile", authenticate, (req, res) => {
  let uId = req.user;
  // console.log(userid);
  let userPosts = [];
  for (let i = 0; i < allPosts.length; i++) {
    if (uId.id === allPosts[i].userId) {
      userPosts.push(allPosts[i]);
    }
  }
  if (userPosts) {
    return res.status(200).json({
      userPosts,
    });
  } else {
    return res.status(404).json({
      message: "User have no post yet!",
    });
  }
});

//timeline..........................................
app.get("/timeline", authenticate, (req, res) => {
  let uId = req.user;
  // console.log(userid);
  let userPosts = [];
  for (let i = 0; i < allPosts.length; i++) {
    if (uId.id !== allPosts[i].userId) {
      userPosts.push(allPosts[i]);
    }
  }
  if (userPosts) {
    return res.status(200).json({
      userPosts,
    });
  } else {
    return res.status(404).json({
      message: "No post added yet!",
    });
  }
});

function authenticate(req, res, next) {
  if (req.headers.token) {
    try {
      var decoded = jwt.verify(req.headers.token, secretKey);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({
        message: "Invalid Token",
      });
    }
  } else {
    return res.status(401).json({
      message: "Not Logged in",
    });
  }
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
