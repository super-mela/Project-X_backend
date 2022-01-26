var config = require("../DBconfig");
const sql = require("mssql");
const fs = require("fs");

async function getReport() {
  try {
    let pool = await sql.connect(config);
    let Datafetch = await pool.query("SELECT * from Reports");
    return Datafetch.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function addReport(data) {
  console.log("***********************" + data.body);
  var info_data = JSON.parse(data.body.body);
  var baseuri = process.env.FILE_PATH;
  var NO_data = "No Data";
  var reportDate = new Date();
  var date =
    reportDate.getFullYear() +
    "-" +
    (reportDate.getMonth() + 1) +
    "-" +
    reportDate.getDate();

  if (req.files === null) {
    try {
      let pool = await sql.connect(config);
      let insertProduct = await pool.query(
        `INSERT INTO Reports ([catagory], 
            [trate_level],
            [detail],
            [file_path],
            [file_type],
            [latitude],
            [longtiude],
            [reporter_name])
             VALUES (N'${info_data.catagory}',N'${info_data.trate_level}',
             N'${info_data.detail}',N'${NO_data}',N'${NO_data}',
             N'${info_data.latitiude}',N'${info_data.longtiude}',N'${data.user._id}')`
      );
      return insertProduct.recordsets;
    } catch (error) {
      console.log(error);
    }
  } else {
    var info_file = data.files;
    var info_file_type = info_file.file.mimetype.split("/")[0];
    var info_file_name = info_data.id + "_" + info_file.file.name;
    var info_file_path =
      baseuri +
      "/" +
      info_data.catagory +
      "/" +
      info_file_type +
      "/" +
      date +
      "/" +
      info_file_name;
    fs.access(
      baseuri + "/" + info_data.catagory + "/" + info_file_type + "/" + date,
      (error) => {
        if (error) {
          fs.mkdir(
            baseuri +
            "/" +
            info_data.catagory +
            "/" +
            info_file_type +
            "/" +
            date,
            { recursive: true },
            function (err) {
              if (err) {
                console.log(err);
              } else {
                file.mv(
                  `${baseuri}/${info_data.catagory}/${info_file_type}/${date}/${info_file_name}`,
                  (err) => {
                    if (err) {
                      console.error(err);
                      return res.status(500).send(err);
                    }
                    res.json({
                      filename: file.name,
                      filepath: `/uploads/${file.name}`,
                    });
                  }
                );

                console.log(" directory successfully created.", baseuri);
              }
            }
          );
        } else {
          if (
            fs.existsSync(
              baseuri +
              "/" +
              info_data.catagory +
              "/" +
              info_file_type +
              "/" +
              date
            )
          ) {
            //const file = req.files.file;
            file.mv(
              `${baseuri}/${info_data.catagory}/${info_file_type}/${date}/${info_file_name}`,
              (err) => {
                if (err) {
                  console.error(err);
                  return res.status(500).send(err);
                }
                res.json({
                  filename: file.name,
                  filepath: ` /uploads/${file.name}`,
                });
              }
            );
          }
        }
      }
    );
    try {
      let pool = await sql.connect(config);
      let insertProduct = await pool.query(
        `INSERT INTO Reports ([catagory], 
        [trate_level],
        [detail],
        [file_path],
        [file_type],
        [latitude],
        [longtiude],
        [reporter_name])
         VALUES (N'${info_data.catagory}',N'${info_data.trate_level}',
         N'${info_data.detail}',N'${info_file_path}',N'${info_data.info_file_type}',
         N'${info_data.latitiude}',N'${info_data.longtiude}',N'${data.user._id}')`
      );
      return insertProduct.recordsets;
    } catch (error) {
      console.log(error);
    }
  }
}
async function SearchReport(data) {
  try {
    let pool = await sql.connect(config);
    let searchValue = await pool.query(
      `SELECT * FROM Reports WHERE catagory LIKE ( N'${data.catagory}' ) COLLATE Latin1_General_BIN2 OR trate_level LIKE ( N'%${data.trate_level}%') COLLATE Latin1_General_BIN2 OR detail LIKE ( N'%${data.detail}%') COLLATE Latin1_General_BIN2 OR file_type LIKE ( N'%${data.file_type}%') COLLATE Latin1_General_BIN2 OR latitude LIKE ( N'%${data.latitude}%') COLLATE Latin1_General_BIN2 OR longtiude LIKE ( N'%${data.longtiude}%' ) COLLATE Latin1_General_BIN2 OR reporter_name LIKE ( N'%${data.reporter_name}%' ) COLLATE Latin1_General_BIN2`
    );
    return searchValue.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function UpdateRreport(data) {
  try {
    let pool = await sql.connect(config);
    let updateValue = await pool.query(
      `UPDATE Reports SET [catagory] = N'${data.catagory}', [trate_level] = N'${data.trate_level}', [detail] = N'${data.detail}', [file_type] =N'${data.file_type}', [latitude] = N'${data.latitude}', [longtiude] = N'${data.longtiude}' WHERE [ID] LIKE \'${data.ID}\'`
    );
    return updateValue.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function DeleteReport(data) {
  try {
    let pool = await sql.connect(config);
    let deleteValue = await pool.query(
      `DELETE FROM Reports WHERE [ID] LIKE (\'${data.ID}\')`
    );
    return deleteValue.recordsets;
  } catch (error) {
    console.log(error);
  }
}
module.exports = {
  getReport: getReport,
  SearchReport: SearchReport,
  addReport: addReport,
  UpdateRreport: UpdateRreport,
  DeleteReport: DeleteReport,
};
