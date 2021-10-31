import nodemailer from 'nodemailer';
import messages from '../messages';

const ADMIN_MAIL = process.env.ADMIN_MAIL;
const ADMIN_PASS = process.env.ADMIN_PASS;
const MAIL_PROVIDER = 'gmail';
const MAIL_REJECT_UNAUTHORIZED = false;

const transporter = nodemailer.createTransport({
  service: MAIL_PROVIDER,
  auth: {
    user: ADMIN_MAIL,
    pass: ADMIN_PASS
  },
  tls: {
    rejectUnauthorized: MAIL_REJECT_UNAUTHORIZED
  }
});

const MailUtils = {
  sendConfirmationCode: function(userMail: string, confirmationCode: string) {
    let mailOptions = {
      from: ADMIN_MAIL,
      to: userMail,
      subject: messages.MAIL_TITLE,
      text: `${messages.MAIL_TEXT_PREFIX}${confirmationCode}`
    };
    transporter.sendMail(mailOptions, function(err, info) {
      if (err) {
        console.log(messages.MAIL_ERROR_PREFIX + err.message);
      }
    });
  }
}

export default MailUtils;