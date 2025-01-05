"use strict";

const nodemailer = require("nodemailer");

module.exports = function (to, subject, message) {

  //? GoogleMail (gmail):
  // Google -> AccountHome -> Security -> Two-Step-Verify -> App-Passwords
  const mailSettings = {
    service: "Gmail",
    user: "nurdoganbahadirr@gmail.com",
    pass: "gaho fhsy yntl fpky",
  };

  // Connect to mailServer:
  const transporter = nodemailer.createTransport({
    service: mailSettings.service,
    auth: {
      user: mailSettings.user,
      pass: mailSettings.pass,
    },
  });
  // SendMail:
  transporter.sendMail(
    {
      from: mailSettings.user,
      to: to,
      subject: subject,
      text: message,
      html: message,
    },
    (error, info) => {
      error ? console.log(error) : console.log(info);
    }
  );
};
