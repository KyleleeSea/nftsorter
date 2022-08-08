// Imports
const fetch = require('node-fetch')
const dotenv = require('dotenv')
const path = require('path')

// dotenv setup
dotenv.config({
    path: path.resolve(__dirname, '../.env')
});

const fetchTweetData = async (id) => {
    const response = await fetch(`https://api.twitter.com/2/tweets/${id}?tweet.fields=public_metrics`, {
        headers: {
            "Authorization": `Bearer ${process.env.TWITTER_BEARER_TOKEN}`
        }
    });

    const data = await response.json()

    return data['data']['public_metrics']
}

const fetchTwitterMetrics = async (id) => {
    try {

        let data = {}

        const response = await fetch(`https://api.twitter.com/2/users/${id}/tweets`, {
            headers: {
                "Authorization": `Bearer ${process.env.TWITTER_BEARER_TOKEN}`
            }
        });

        const timeline = await response.json()

        let tweet_ids = []
        let retweets_sum = 0
        let reply_sum = 0
        let like_sum = 0

        // 5 is hardcoded test value.Change to timeline['data'].length for deployment add if undefined

        if (timeline['data'] == undefined || timeline['data'].length < 5) {
            data['avg_retweets'] = 'N/A'
            data['avg_replies'] = 'N/A'
            data['avg_likes'] = 'N/A'

            return data
        }

        else {
            // Adjust i < 5 to change how many tweets u go over
            for (let i = 0; i < 5; i++) {
                tweet_ids.push(timeline['data'][i]['id'])
            }


            for (let j = 0; j < tweet_ids.length; j++) {
                let fetched = await fetchTweetData(tweet_ids[j])
                retweets_sum += fetched['retweet_count']
                reply_sum += fetched['reply_count']
                like_sum += fetched['like_count']
            }

            data['avg_retweets'] = Math.round(retweets_sum / 5)
            data['avg_replies'] = Math.round(reply_sum / 5)
            data['avg_likes'] = Math.round(like_sum / 5)

            return data
        }
    } catch (error) {
        console.log(`ERROR: ${error}`)
        let data = {}
        data['avg_retweets'] = 'N/A'
        data['avg_replies'] = 'N/A'
        data['avg_likes'] = 'N/A'

        return data
    }
}

module.exports = fetchTwitterMetrics;