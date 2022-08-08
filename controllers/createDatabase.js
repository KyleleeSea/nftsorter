// Imports
const mongoose = require('mongoose');
const Project = require('../models/project.js')
const fetch_data = require('./fetchProjects.js');

const dotenv = require('dotenv')
const path = require('path')

// dotenv setup
dotenv.config({
    path: path.resolve(__dirname, '../../.env')
});

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const create_database = async () => {
    try {
        const data = await fetch_data()

        for (let i = 0; i < data.length; i++) {
            const body = {
                title: data[i]['Project'],
                tag: data[i]['Tag'],
                image: data[i]['Image'],
                description: data[i]['Short Description'],
                followers: data[i]['Followers'],
                num_tweets: data[i]['NumTweets'],
                avg_likes: data[i]['avg_likes'],
                avg_replies: data[i]['avg_replies'],
                avg_retweets: data[i]['avg_retweets'],
                discord: data[i]['Discord'],
                twitter_link: data[i]['TwitterLink'],
                twitter_handle: data[i]['TwitterId'],
                website: data[i]['Website'],
                display_url: data[i]['Display Url'],
                drop_date: data[i]['Drop Date'],
                internal_date: data[i]['Internal Date']
            }

            console.log(body['title'])

            let project = new Project(body);
            await project.save();

        }
    } catch (error) {
        console.log(error)
    }
}

create_database()