const router = require("express").Router();
const verify = require("./verifyToken");
const dboperation = require("../model/Reports");
var path = require("path");

// router.get("/", verify, (req, res) => {
//   console.log(req.user.user);
//   res.json({
//     posts: {
//       title: "my first post",
//       description: " random data you shouldnt access",
//     },
//   });
// });

router.get("/getReport", (request, response) => {
  dboperation.getReport().then((result) => {
    console.log(result);
    response.json(result[0]);
  });
});

router.post("/AddReport", verify, (request, response) => {
  let inputdata = request;
  console.log(inputdata);
  dboperation.addReport(inputdata).then((result) => {
    //   console.log(result[0]);
    response.status(201).json(result[0]);
  });
});

router.post("/SearchReport", verify, (request, response) => {
  let inputdata = { ...request.body };
  dboperation.SearchReport(inputdata).then((result) => {
    //   console.log(result[0]);
    response.json(result[0]);
  });
});

router.post("/UpdateReport", verify, (request, response) => {
  let inputdata = { ...request.body };
  dboperation.UpdateReport(inputdata).then((result) => {
    //   console.log(result[0]);
    response.status(200).json(result[0]);
  });
});

router.delete("/DeleteReport", verify, (request, response) => {
  let inputdata = { ...request.body };
  dboperation.DeleteReport(inputdata).then((result) => {
    //   console.log(result[0]);
    response.status(202).json(result[0]);
  });
});

router.post("/sendfile", (req, res) => {
  var fileUpload = req.body[0].path;
  //   var fileUpload = "/home/spy/Documents/Automation/project_x_files/Reports.txt";
  res.setHeader("Content-Transfer-Encoding", "binary");

  res.sendFile(path.join(fileUpload));
});

// exports.sendfile = function (req, res) {
//   //   var fileUpload = req.body[0].path;
//   var fileUpload = "/home/spy/Documents/Automation/project_x_files/Reports.txt";
//   res.setHeader("Content-Transfer-Encoding", "binary");

//   res.sendFile(path.join(fileUpload));
// };

module.exports = router;
