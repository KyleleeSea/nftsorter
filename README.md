<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/KyleleeSea/nftsorter/">
    <img src="https://i.imgur.com/gbu97LK.png" alt="Logo" width="80" height="80">
  </a>

<h1 align="center">NFT Sorter</h1>

  <p align="center">
    <h4>
      An auto-updating database of upcoming NFT projects with their Twitter engagement analytics.
    </h4>
    <br />
    <a href="https://nftsorter.com/">View Demo</a>
    ·
    <a href="https://github.com/KyleleeSea/nftsorter/issues">Report Bug</a>
    ·
    <a href="https://github.com/KyleleeSea/nftsorter/issues">Request Feature</a>
  </p>
</div>

<!-- ABOUT THE PROJECT -->
## About The Project

[![NFT Sorter Screen Shot][product-screenshot]](https://nftsorter.com/)

NFT Sorter makes it faster and more efficient to find the next big NFT project. 

The problem I'm solving: how time-consuming it is to screen upcoming NFT drops. As I was learning about NFT investing, I'd use upcoming drop lists to find new collections. The problem was that it was grueling sorting out quality projects from scams. My method before NFT Sorter was clicking through Twitter accounts and eyeballing engagement, which I found incredibly inefficient. NFT Sorter puts all the engagement data you need to screen upcoming projects in one place.

### The Backend
The database is updated through the .js files found in /controllers. The deployed demo utilizes a daily cron job to run the file "databaseUpdate.js". Data collected through a combination APIs. 

### Features
- Upcoming projects indexed by Twitter followers, number of tweets, average likes, replies, retweets, and drop date.
- Clicking the project title links to the collection's Discord, Twitter, and website.
- Search by specific terms.
- Sort and order by different analytics.
- Narrow results. 
- Self-maintaining database.
- Automatic project art gathering.

### Built With
* [![ExpressJS][expressjs.com]][expressjs-url]
* [![Bootstrap][Bootstrap.com]][Bootstrap-url]
* [![EJS][ejs.co]][ejs-url]
* [![MongoDB][mongodb.com]][mongodb-url]
* [![Nodemailer][nodemailer.com]][nodemailer-url]
* [![Twitter API][twitter.com]][twitter-url]

## Live Demo

Please view the full demo of NFT Sorter here: <a href="https://nftsorter.com/">NFTSorter.com</a>

## Local Copy
You may run this project locally by following these steps:

1. Clone the repo
   ```sh
   git clone https://github.com/KyleleeSea/nftsorter/
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Create a .env file
4. Create your own Twitter API account and include bearer token in variables (in .env file): "TWITTER_BEARER_TOKEN"
5. Create your own MongoDB cluster and include URL in .env file under variable  "DB_URL"
6. Run in terminal
   ```sh
   node app.js
   ```

## Known Bugs
- IntroJs.oncomplete error causing onboarding to end after first slide
- User changing playlist visibility sets image to blank 

<!-- CONTACT -->
## Contact

Twitter - [@KyleleeSea](https://twitter.com/KyleleeSea)

Project Link: [https://github.com/KyleleeSea/nftsorter/](https://github.com/KyleleeSea/nftsorter)

<!-- MARKDOWN LINKS & IMAGES -->
[product-screenshot]: https://i.imgur.com/JNzE4HZ.png
[expressjs.com]: https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=AEAEAE
[expressjs-url]: https://expressjs.com/
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[ejs.co]: https://img.shields.io/badge/EJS-000000?style=for-the-badge&logo=ejs&logoColor=ffffff
[ejs-url]: https://ejs.co/
[mongodb.com]: https://img.shields.io/badge/MongoDB-000000?style=for-the-badge&logo=mongodb&logoColor=00ED64
[mongodb-url]: https://www.mongodb.com/
[nodemailer.com]: https://img.shields.io/badge/Nodemailer-29ABE2?style=for-the-badge&logo=nodemailer&logoColor=29ABE2
[nodemailer-url]: https://nodemailer.com/
[twitter.com]: https://img.shields.io/badge/Twitter_API-000000?style=for-the-badge&logo=twitter&logoColor=0465B0
[twitter-url]: https://developer.twitter.com/en/docs/twitter-api
