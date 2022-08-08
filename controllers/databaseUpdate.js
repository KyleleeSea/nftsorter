// Imports
const mongoose = require('mongoose');
const Project = require('../models/project.js')
const fetch_data = require('./fetchProjects.js');
const emailMe = require('./helpers/emailMe.js');
const emailDBUpdate = require('./helpers/emailDBUpdate.js');

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

let current_date = new Date().toJSON().slice(0, 10).replace(/-/g, '');

console.log(current_date)

const update_database = async () => {
    try {
        emailMe('hit update database', 'hit update database')
        console.log('hit update database')
        const data = await fetch_data()
        console.log('hit end of fetch function')

        // Error handling if less than 100 results returned from fetch
        if (data.length !== undefined) {
            if (data.length < 100) {
                emailMe('Database update returned less than 100 results', `data len: ${data.length} data: ${data}`);
                return
            }

        }

        // Initialize variables for update report
        let added_projects = []
        let removed_projects = []
        let number_followercounts_updated = 0
        let report = {}

        for (let i = 0; i < data.length; i++) {
            let project_exists = await Project.findOne({ title: data[i]['Project'] })

            console.log(project_exists)

            // Add to database if project not yet there 
            if (project_exists == null) {

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

                added_projects.push(data[i]['Project'])

                let project = new Project(body);
                await project.save();
                continue
            }

            if (project_exists !== undefined && project_exists !== null) {

                // Update metrics of data 
                if (project_exists['followers'] !== data[i]['Followers']) {
                    project_exists['followers'] = data[i]['Followers']

                    number_followercounts_updated += 1
                }

                if (project_exists['num_tweets'] !== data[i]['NumTweets']) {
                    project_exists['num_tweets'] = data[i]['NumTweets']

                }

                if (project_exists['avg_likes'] !== data[i]['avg_likes']) {
                    project_exists['avg_likes'] = data[i]['avg_likes']

                }

                if (project_exists['avg_replies'] !== data[i]['avg_replies']) {
                    project_exists['avg_replies'] = data[i]['avg_replies']

                }


                if (project_exists['avg_retweets'] !== data[i]['avg_retweets']) {
                    project_exists['avg_retweets'] = data[i]['avg_retweets']
                }

                await project_exists.save()
            }

        }

        // Delete old 
        let projects = await Project.find({})

        for (let j = 0; j < projects.length; j++) {
            if (projects[j]['internal_date'] < current_date - 1) {
                await Project.deleteOne({ title: projects[j]['title'] })

                removed_projects.push(projects[j]['title'])
            }
        }

        report['added_projects'] = added_projects
        report['removed_projects'] = removed_projects
        report['number_followercounts_updated'] = number_followercounts_updated
        emailDBUpdate(report)

    } catch (error) {
        console.log(error)
        emailMe('ERROR', error)
    }
}

module.exports = update_database;