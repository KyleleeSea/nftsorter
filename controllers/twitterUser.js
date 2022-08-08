// Imports
const fetch = require('node-fetch')
const dotenv = require('dotenv')
const path = require('path')

// dotenv setup 
dotenv.config({
    path: path.resolve(__dirname, '../.env')
});

const fetchTwitterFollowersAndTweets = async (username) => {
    try {
        const response = await fetch(`https://api.twitter.com/1.1/users/show.json?screen_name=${username}`, {
            headers: {
                "Authorization": `Bearer ${process.env.TWITTER_BEARER_TOKEN}`
            }
        });
        const data = await response.json()

        if (data.hasOwnProperty('errors')) {
            const data_to_return = { 'followers': 'N/A', 'tweets': 'N/A', 'id': 'skip', image: 'none' }
            return data_to_return
        }

        else {
            const data_to_return = { 'followers': data['followers_count'], 'tweets': data['statuses_count'], 'id': data['id_str'], 'image': data['profile_image_url_https'] }
            return data_to_return
        }

    } catch (error) {
        console.log(error)
    }

}

module.exports = fetchTwitterFollowersAndTweets;