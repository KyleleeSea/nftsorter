// Import modules 
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('cookie-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const dotenv = require('dotenv')
const favicon = require('serve-favicon')
const schedule = require('node-schedule')

const mainRoute = require('./routes/main.js')
const contactRoutes = require('./routes/contact.js')

const update_database = require('./controllers/databaseUpdate.js')
const emailMe = require('./controllers/helpers/emailMe.js')

// Setup dotenv
dotenv.config();

// Connect to database 
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

// Initialize app 
const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

// Favicon
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

// Setup session 
const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash());

// DB Updating
// const rule = new schedule.RecurrenceRule();
// rule.hour = 1;
// rule.minute = 0;
// rule.second = 0;

// const job = schedule.scheduleJob(rule, function () {
//     emailMe('about to start updating database', 'about to start updating database')
//     console.log('about to start updating')
//     update_database();
// })

// Routes 
app.use('/', mainRoute);
app.use('/contact', contactRoutes)

app.get('/privacy-policy', (req, res) => {
    res.render('privacy')
});

app.get('/terms-of-service', (req, res) => {
    res.render('terms')
});

app.get('/donate', (req, res) => {
    res.render('donate')
});

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    // change from deverror to error 
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})


