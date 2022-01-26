const dotenv = require("dotenv");
dotenv.config();
const config = {
  user: "z-angel",
  password: process.env.DB_CONNECT,
  server: "172.20.21.30",
  database: "Project-x",
  port: 1433,
  options: {
    encrypt: false,
    trustedconnection: true,
    enableAritAbort: true,
    instancename: "DESKTOP-TDV0L9V",
  },
  extra: {
    trustServerCertificate: true,
  },
};
module.exports = config;
