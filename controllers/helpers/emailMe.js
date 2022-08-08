const nodemailer = require('nodemailer');
const dotenv = require('dotenv')
const path = require('path')

// dotenv setup
dotenv.config({
    path: path.resolve(__dirname, '../../.env')
});

const emailMe = async (header, error_message) => {
    try {
        // Instantiate the SMTP server
        const smtpTrans = nodemailer.createTransport({
            host: 'mail.nftsorter.com',
            port: 465,
            secure: true,
            auth: {
                user: "contact@nftsorter.com", // Sender email username
                pass: process.env.EMAIL_PASSWORD, // Sender email password, not the normal one.
            }
        })

        // Specify what the email will look like
        const mailOpts = {
            from: '"Contact Form" <contact@nftsorter.com>', //Sender mail
            to: "contact@nftsorter.com",					// Recever mail
            subject: `${header}`,
            html: `${error_message}`
        }

        // Send mail with defined transport object
        smtpTrans.sendMail(mailOpts, (error, info) => {
            if (error) {
                console.log(error)
            }
            console.log('Email sent')
        });
    } catch (error) {
        console.log(error)
    }
}

module.exports = emailMe