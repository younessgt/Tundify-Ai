const nodemailer = require("nodemailer");
const htmlToText = require("html-to-text");
const pug = require("pug");
const AppError = require("../utils/appError");

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = process.env.EMAIL_FROM;
  }

  newTransport() {
    // if (process.env.NODE_ENV === "production") {
    //     // SendBlue (brevo)
    //     return nodemailer.createTransport({
    //       host: "smtp-relay.brevo.com",
    //       port: 587,
    //       secure: false, // true for 465, false for other ports
    //       auth: {
    //         user: process.env.SENDBLUE_LOGIN,
    //         pass: process.env.SENDBLUE_PASSWORD,
    //       },
    //     });
    //   }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.convert(html),
    };

    try {
      await this.newTransport().sendMail(mailOptions);
      //   console.log("Email sent successfully!");
    } catch (error) {
      throw new AppError(
        "There was an error sending the email. Try again later!",
        500
      );
    }
  }

  async sendWelcome() {
    await this.send("welcome", "Welcome to TunDify Family!");
  }
  async sendPasswordReset() {
    await this.send(
      "passwordReset",
      "Reset your password (valid for only 6 minutes)"
    );
  }
};
