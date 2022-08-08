// Import modules
const fetch = require('node-fetch');
const date = require('date-and-time');

// Import helper functions
const fetchTwitterFollowersAndTweets = require('./twitterUser.js');
const fetchTwitterMetrics = require('./twitterMetrics.js');
const emailMe = require('./helpers/emailMe.js');

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function waitforme(milisec) {
    return new Promise(resolve => {
        setTimeout(() => { resolve('') }, milisec);
    })
}

let browser

const fetch_data = async () => {
    try {
        // Get JSON
        const response = await fetch(`https://collections.rarity.tools/upcoming2`);
        const data = await response.json()

        // Error catching if rarity tools API down
        if (data == undefined || response == undefined) {
            emailMe('Rarity tools no response', 'Rarity tools no response')
            return
        }

        // Remove non project and no listed date edge case
        const filtered_data = data.filter(e => e.hasOwnProperty('Project')).filter(e => e.hasOwnProperty('Sale Date'))

        // Get twitter data and associate + convert sale date + get internal date for filtering + clean site links 
        for (let n = 0; n < filtered_data.length; n++) {
            const twitter_data = await fetchTwitterFollowersAndTweets(filtered_data[n]['TwitterId']);

            // Id for later fetchTwitter
            filtered_data[n]['Id Num'] = twitter_data['id']

            filtered_data[n]['Followers'] = twitter_data['followers'];
            filtered_data[n]['NumTweets'] = twitter_data['tweets'];
            filtered_data[n]['TwitterLink'] = `https://twitter.com/${filtered_data[n]['TwitterId']}`;
            filtered_data[n]['Image'] = twitter_data['image']

            // Converting sale date
            let sale_date = new Date(filtered_data[n]['Sale Date']);
            let formated_date = date.format(sale_date, 'ddd, MMM DD YYYY');
            filtered_data[n]['Drop Date'] = formated_date; // Reassign to Drop Date in order to use sale date again below

            // Internal int date for filtering
            let internal_date = filtered_data[n]['Sale Date'].replaceAll('-', '').slice(0, 8)
            filtered_data[n]['Internal Date'] = parseInt(internal_date)

            // Clean links 
            if (filtered_data[n]['Discord'] !== undefined) {
                if (!filtered_data[n]['Discord'].startsWith('https://')) {
                    let cleaned_link = 'https://' + filtered_data[n]['Discord'].replace('http://', '').replace('www.http://', '')
                    filtered_data[n]['Discord'] = cleaned_link
                }

            }

            if (filtered_data[n]['Website'] !== undefined) {
                if (!filtered_data[n]['Website'].startsWith('https://')) {
                    let cleaned_link = 'https://' + filtered_data[n]['Website'].replace('http://', '').replace('www.http://', '')
                    filtered_data[n]['Website'] = cleaned_link
                }
            }

            // Display Urls
            filtered_data[n]['Display Url'] = filtered_data[n]['Website'].replace('https://', '').replace('www.', '').replace('http://', '')

            // Cleaning title 5.15 
            filtered_data[n]['Project'] = filtered_data[n]['Project'].trimEnd()

            //Identifier 
            filtered_data[n]['Tag'] = filtered_data[n]['Project'].replace(/[0-9]/g, '').replace(/\s/g, '').replace(/[^\w\s]/gi, '')
        }

        const batch_wrapper = async () => {
            const batch = async () => {
                for (let h = 0; h < filtered_data.length; h++) {
                    // Hard coded version is messy, consider rewriting h == statement 
                    if (h == 59 || h == 118 || h == 177 || h == 236 || h == 295 || h == 354 || h == 413) {
                        console.log('wait condition met')
                        let twitter_data = await fetchTwitterMetrics(filtered_data[h]['Id Num'])
                        filtered_data[h]['avg_likes'] = twitter_data['avg_likes']
                        filtered_data[h]['avg_replies'] = twitter_data['avg_replies']
                        filtered_data[h]['avg_retweets'] = twitter_data['avg_retweets']
                        await waitforme(960000);
                    }
                    else {
                        let twitter_data = await fetchTwitterMetrics(filtered_data[h]['Id Num'])
                        filtered_data[h]['avg_likes'] = twitter_data['avg_likes']
                        filtered_data[h]['avg_replies'] = twitter_data['avg_replies']
                        filtered_data[h]['avg_retweets'] = twitter_data['avg_retweets']
                        // console.log(filtered_data)
                    }
                }
                // console.log('end of batch func')
            }

            await batch();

            // console.log('finished awaiting batch')
        }

        await batch_wrapper()

        // console.log('reached end of fetch function')

        return filtered_data
    }
    catch (error) {
        console.log(error)
    }
}

module.exports = fetch_data;