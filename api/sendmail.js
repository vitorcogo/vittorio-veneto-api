// require('dotenv').config({path: '../.env'});
require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const SMTP_CONFIG = require('./config/smtp');
const app = express();

app.use(function (req, res, next) {
    const allowedOrigins = ['http://localhost:4200', 'https://www.vittorioveneto.com.br'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Accept, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.post('/sendMail', (req, res) => {
    
    const transporter = nodemailer.createTransport({
        host: SMTP_CONFIG.host,
        port: SMTP_CONFIG.port,
        secure: false,
        auth: {
            user: `${process.env.USER_KEY}`,
            pass: `${process.env.PASSWORD_KEY}`
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    console.log(process.env.USER_KEY);
    console.log(process.env.PASSWORD_KEY);

    transporter.sendMail({
        from: req.body.email,
        to: process.env.USER_KEY,
        cc: 'vitor_cogo@outlook.com',
        replyTo: req.body.email,
        subject: "Orçamento Vittorio Veneto",
        html: `
            <p>${req.body.message}</p>
            <br>
            <b>Dados do Contato</b>
            <p><b>Nome: </b> ${req.body.name}</p>
            <p><b>Email: </b> ${req.body.email}</p>
            <p><b>Telefone: </b> ${req.body.phone}</p>
            <p> Meio de resposta: <b>${req.body.contactWay}</b></p>
        `
    });

    res.sendStatus(200);
});
module.exports = app;