const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

// import { fileURLToPath } from 'url';
// import path from 'path';

dotenv.config();

// Setup path 
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        res.render('contact/contact.ejs')
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

router.get('/success', async (req, res) => {
    try {
        res.render('contact/thankyou.ejs')
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

router.post('/', async (req, res) => {
    try {

        // Email Template
        const output = `
          <h3>Contact Details</h3>
          <p>Name: ${req.body.name}</p>
          <p>Email: ${req.body.email}</p>
          <P>Subject: ${req.body.subject}</p>
          <h3>Message</h3>
          <p>${req.body.message}</p>
      `;

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
            subject: `${req.body.name}`,
            html: output
        }

        // Send mail with defined transport object
        smtpTrans.sendMail(mailOpts, (error, info) => {
            if (error) {
                return res.redirect(`/contact`);
            }
            // Note: Req.flash would be better, this is a temporary solution
            return res.redirect(`/contact/success`);
        });
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

module.exports = router;