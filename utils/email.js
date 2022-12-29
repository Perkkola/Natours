const nodemailer = require("nodemailer");
const pug = require('pug')
const htmlToText = require('html-to-text')
// new Email(user, url).sendWelcome()

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email
    this.firstName = user.name.split(' ')[0]
    this.url = url
    this.from = `Frans Perkkola <${process.env.EMAIL_FROM}>`
  }

  newTransport() {
    if(!process.env.NODE_ENV === 'production') {
      return 1
    }
    return nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.SENDGRID_USERNAME,
        pass: process.env.SENDGRID_PASSWORD
      }
    })
  }

  //Send mail
  async send(template, subject) {
    //Render html
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject
    })
    
    
    //Define options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.htmlToText(html),
    };

    //Create transport and send email
    console.log(process.env)
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
   await this.send('welcome', 'Welcome to the Natours Family!')
  }
  async sendPasswordReset() {
    await this.send('passwordReset', 'Your password reset token (valid for 10 minutes')
  }
}

const sendEmail = async (options) => {
  //Gmail
  /*
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    //activate in gmail "less secure app" option
  });
  */
  // const transporter = nodemailer.createTransport({
  //   host: process.env.EMAIL_HOST,
  //   port: process.env.EMAIL_PORT,
  //   auth: {
  //     user: process.env.EMAIL_USERNAME,
  //     pass: process.env.EMAIL_PASSWORD,
  //   },
  // });

  // const mailOptions = {
  //   from: "Frans Perkkola <fransperkkola@gmail.com>",
  //   to: options.email,
  //   subject: options.subject,
  //   text: options.message,
  //   //html:
  // };

  // await transporter.sendMail(mailOptions);
};

// module.exports = sendEmail;
