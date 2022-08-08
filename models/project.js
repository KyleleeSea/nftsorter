const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    title: String,
    tag: String,
    image: String,
    description: String,
    followers: mongoose.Schema.Types.Mixed,
    num_tweets: mongoose.Schema.Types.Mixed,
    avg_likes: mongoose.Schema.Types.Mixed,
    avg_replies: mongoose.Schema.Types.Mixed,
    avg_retweets: mongoose.Schema.Types.Mixed,
    discord: String,
    twitter_link: String,
    twitter_handle: String,
    website: String,
    display_url: String,
    drop_date: String,
    internal_date: Number
})

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;