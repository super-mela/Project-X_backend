// var serialport = require("serialport");
// var SerialPort = serialport.SerialPort;

// var port = new serialport("COM6", {
//   baudRate: 9600,
//   dataBits: 8,
//   parity: "none",
//   stopBits: 1,
//   flowControl: false,
// });

// port.on("open", onOpen);
// port.on("error", onError);
// port.on("data", onDataReceived);

function onOpen(error) {
  if (!error) {
    console.log("Port open sucessfully");
    // if (port.isOpen) {
    //   send(port, "0922492205", "BAL");
    //   //   read(port);
    // }
  }
}

function sendCheck(port, phone, message) {
  if (port.isOpen) {
    send(port, phone, message);
    //   read(port);
  } else console.log("port is not open properly");
}

function onDataReceived(data) {
  console.log("Received data: " + data);
}

function onError(error) {
  console.log(error);
}

function onClose(error) {
  console.log("Closing connection");
  console.log(error);
}

function send(serial, toAddress, message) {
  console.log(message);
  serial.write("AT+CMGF=1");
  serial.write("\r");
  serial.write('AT+CMGS="' + toAddress + '"');
  serial.write("\r");
  serial.write(message);
  serial.write("\r");
}

function read(serial) {
  serial.write("AT+CMGF=1");
  serial.write("\r");
  serial.write('AT+CPMS="SM"');
  serial.write("\r");
  serial.write('AT+CMGL="ALL"');
  serial.write("\r");
}

module.exports = {
  onOpen: onOpen,
  sendCheck: sendCheck,
  onError: onError,
  onDataReceived: onDataReceived,
  onClose: onClose,
};
