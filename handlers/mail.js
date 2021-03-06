const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const generateHtml = (filename, options = {}) => pug.renderFile(`${__dirname}/../views/email/${filename}.pug`, options);

exports.send = options => {
  const html = generateHtml(options.filename, options);
  const text = htmlToText.fromString(html);
  const mailOptions = {
    from: 'Node Exam <noreply@example.com>',
    to: options.user.email,
    subject: options.subject,
    text,
    html,
  };
  return transport.sendMail(mailOptions);
};
