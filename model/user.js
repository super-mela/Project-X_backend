var config = require("../DBconfig");
const sql = require("mssql");

async function getUser() {
  try {
    let pool = await sql.connect(config);
    let Datafetch = await pool.query("SELECT * from Users");
    return Datafetch.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function addUser(data) {
  try {
    let pool = await sql.connect(config);
    let insertProduct = await pool.query(
      `INSERT INTO Users ([username], [phone]) VALUES (\'${data.user}\',\'${data.phone}\')`
    );

    return insertProduct.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function SearchUser(data) {
  try {
    let pool = await sql.connect(config);
    let searchValue = await pool.query(
      `SELECT * FROM Users WHERE username LIKE ( \'${data.user}\' ) OR phone LIKE ( \'%${data.phone}\%' )`
    );
    return searchValue.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function findOne(data) {
  try {
    let pool = await sql.connect(config);
    let searchValue = await pool.query(
      `SELECT * FROM Users WHERE phone LIKE ( \'${data.phone}\' ) `
    );
    return searchValue.recordsets[0][0];
  } catch (error) {
    console.log(error);
  }
}

async function UpdateUser(data) {
  try {
    let pool = await sql.connect(config);
    let updateValue = await pool.query(
      `UPDATE Users SET [username] = \'${data.user}\', [phone] =\'${data.phone}\' WHERE [ID] LIKE \'${data.ID}\'`
    );
    return updateValue.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function updateKey(data) {
  try {
    let pool = await sql.connect(config);
    let updateValue = await pool.query(
      `UPDATE Users SET [verifyKey] = \'${data.verifyKey}\' WHERE [ID] LIKE \'${data.ID}\'`
    );
    return updateValue.recordsets;
  } catch (error) {
    console.log(error);
  }
}
async function updateKeyusingphone(data) {
  try {
    let pool = await sql.connect(config);
    let updateValue = await pool.query(
      `UPDATE Users SET [verifyKey] = \'${data.verifyKey}\' WHERE [phone] LIKE \'${data.Phone}\'`
    );
    return updateValue.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function DeleteUser(data) {
  try {
    let pool = await sql.connect(config);
    let deleteValue = await pool.query(
      `DELETE FROM Users WHERE [ID] LIKE (\'${data.ID}\')`
    );
    return deleteValue.recordsets;
  } catch (error) {
    console.log(error);
  }
}
module.exports = {
  getUser: getUser,
  SearchUser: SearchUser,
  addUser: addUser,
  UpdateUser: UpdateUser,
  DeleteUser: DeleteUser,
  findOne: findOne,
  updateKey: updateKey,
  updateKeyusingphone: updateKeyusingphone,
};
