const nodemailer = require('nodemailer');
const dotenv = require('dotenv')
const path = require('path')

// dotenv setup
dotenv.config({
    path: path.resolve(__dirname, '../../.env')
});


const emailDBUpdate = async (report) => {
    try {
        // Instantiate the SMTP server
        const output = `
        <p>Added Projects: ${report.added_projects}</p>
        <p>Removed Projects: ${report.removed_projects}</p>
        <P>Updated follower counts: ${report.number_followercounts_updated}</p>
    `;

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
            subject: `Database Update`,
            html: output
        };

        // Send mail with defined transport object
        smtpTrans.sendMail(mailOpts, (error, info) => {
            if (error) {
                console.log(error)
            }
            console.log('DB Email Update Sent')
        });
    } catch (error) {
        console.log(error)
    }
}

module.exports = emailDBUpdate