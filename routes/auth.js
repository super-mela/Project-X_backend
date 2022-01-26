const route = require("express").Router();
// const Joi = require("@hapi/joi");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const User = require("../model/user");
const jwt = require("jsonwebtoken");
const accountsid = process.env.TWILIO_ACCOUNT_SID;
const authtoken = process.env.TWILIO_AITH_TOKEN;
const cliant = require("twilio")(accountsid, authtoken);
const {
  registerValidation,
  loginValidation,
  varifyValidation,
} = require("../validation");
const SMS = require("../SMS_serial");
var serialport = require("serialport");

const schema = Joi.object({
  user: Joi.string().min(6).required(),
  phone: Joi.string()
    .min(10)
    .required()
    .pattern(/^[0-9]+$/),
  password: Joi.string().min(6).required(),
});

route.post("/register", async (req, res) => {
  let inputdata = { ...req.body };

  // validation state
  const { error } = registerValidation(inputdata);
  if (error) return res.status(400).send(error.details[0].message);

  // check if the user exist

  const phoneExist = await User.findOne({ phone: inputdata.phone });
  if (phoneExist) return res.status(400).send("phone already exist");

  //hash a password
  //   const salt = await bcrypt.genSalt(10);
  //   inputdata.password = await bcrypt.hash(inputdata.password, salt);
  // add the user in db
  try {
    User.addUser(inputdata).then((result) => {
      res.status(201).json(result[0]);
    });
  } catch {
    res.status(400).send(error);
  }
});

//login route
route.post("/login", async (req, res) => {
  let inputdata = { ...req.body };

  //validation data that cames from user

  const { error } = loginValidation(inputdata);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ phone: inputdata.phone });
  if (!user) {
    //if not registerd add user to database
    try {
      User.addUser(inputdata).then(async (result) => {
        // res.status(201).json(result[0]);
        if (result) {
          //create 4 digit random number

          var randomnumber = Math.floor(1000 + Math.random() * 9000);
          console.log(randomnumber);

          /// send a message to a given number using twilito ///

          cliant.messages
            .create({
              body: JSON.stringify(randomnumber),
              from: "+19152219296",
              to: "+251922492205",
            })
            .then((message) => console.log(message))
            .catch((error) => console.log(error));

          const verifyobj = { Phone: inputdata.phone, verifyKey: "" };

          // hash a verify key

          const salt = await bcrypt.genSalt(10);
          verifyobj.verifyKey = await bcrypt.hash(
            JSON.stringify(randomnumber),
            salt
          );

          //set verify key according to the user

          try {
            User.updateKeyusingphone(verifyobj).then((result) => {
              res.status(201).json(result[0]);
            });
          } catch {
            res.status(400).send(error);
          }

          SMS.onClose;
          res.send({ verify: inputdata.phone });
        }
      });
    } catch {
      res.status(400).send(error);
    }
  }

  //create 4 digit random number
  else if (user) {
    var randomnumber = Math.floor(1000 + Math.random() * 9000);
    console.log(randomnumber);

    /// send a message to a given number using twilito ///

    cliant.messages
      .create({
        body: JSON.stringify(randomnumber),
        from: "+19152219296",
        to: "+251922492205",
      })
      .then((message) => console.log(message))
      .catch((error) => console.log(error));

    /// send a message to a given number using serial communication ///

    //   var port = new serialport("COM2", {
    //     baudRate: 9600,
    //     dataBits: 8,
    //     parity: "none",
    //     stopBits: 1,
    //     flowControl: false,
    //   });

    //   port.on("open", onOpen);
    //   port.on("error", SMS.onError);
    //   port.on("data", SMS.onDataReceived);

    //   function onOpen(error) {
    //     if (!error) {
    //       console.log("COM Port open sucessfully");

    //       if (port.isOpen) {
    //         SMS.sendCheck(port, user.phone, randomnumber);
    //       }
    //     }
    //   }

    const verifyobj = { ID: user.ID, verifyKey: "" };

    // hash a verify key

    const salt = await bcrypt.genSalt(10);
    verifyobj.verifyKey = await bcrypt.hash(JSON.stringify(randomnumber), salt);

    //set verify key according to the user

    try {
      User.updateKey(verifyobj).then((result) => {
        res.status(201).json(result[0]);
      });
    } catch {
      res.status(400).send(error);
    }
    //   const validPass = await bcrypt.compare(inputdata.password, user.password);
    //   if (!validPass) return res.status(400).send("Invalid password")

    SMS.onClose;
    res.send({ verify: user.phone });
  }
});

route.post("/verify", async (req, res) => {
  let inputdata = { ...req.body };
  console.log(inputdata);
  //validation data that cames from user
  const { error } = varifyValidation(inputdata);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ phone: inputdata.phone });
  if (!user) return res.status(400).send("phone not Found");

  const validPass = await bcrypt.compare(inputdata.verifyKey, user.verifyKey);
  if (!validPass) return res.status(400).send("Invalid Verification Key");

  //create and assign a token

  const token = jwt.sign(
    { _id: user.ID, user: user.username },
    process.env.TOKEN_SECRET
  );
  res.header("auth-token", token).send(token);
});

module.exports = route;
