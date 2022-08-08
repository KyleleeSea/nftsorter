const express = require('express');
const Project = require('../models/project.js')
const router = express.Router();
const parser = require('ua-parser-js')

// Logic: #1 check what params. #2. Check if mobile or tablet #3. Check if results are returned. Should destructure 2 and 3.
// Code looks intimidating, but the inner if statements of each param check follow the same pattern of undefined, mobile, tablet, else
// undefined result being returned for device_type when its desktop

router.get('/', async (req, res) => {
    try {
        var ua = parser(req.headers['user-agent']);
        var device_type = ua['device']['type']


        // Initialize pagination system
        var { page = 1, limit = 35 } = req.query;
        page = page;

        // Initialize return dict
        let return_dict = {}
        return_dict['page'] = page;

        if (req.query['followers'] !== undefined && req.query['sortBy'] !== undefined && req.query['followers'] !== '' && req.query['sortBy'] !== '') {
            let filter_grid = {}
            filter_grid['followers'] = { $gt: parseInt(req.query['followers']) - 1 }

            if (req.query['tweets']) {
                filter_grid['num_tweets'] = { $gt: parseInt(req.query['tweets']) - 1 }
            }

            if (req.query['likes']) {
                filter_grid['avg_likes'] = { $gt: parseInt(req.query['likes']) - 1 }
            }

            if (req.query['replies']) {
                filter_grid['avg_replies'] = { $gt: parseInt(req.query['replies']) - 1 }
            }

            if (req.query['retweets']) {
                filter_grid['avg_retweets'] = { $gt: parseInt(req.query['retweets']) - 1 }
            }

            let sort_grid = {}

            if (req.query['sortBy'] == 'title' || req.query['sortBy'] == 'internal_date') {
                sort_grid[req.query['sortBy']] = 1;
                sort_grid['description'] = -1; // Here to break ties. Not sure if necessary
            }
            else {
                sort_grid[req.query['sortBy']] = -1;
                sort_grid['description'] = -1;
            }

            let projects = await Project.find(filter_grid)
                .sort(sort_grid)
                .skip((page - 1) * limit)
                .limit(limit)
                .exec()

            let total_projects = await Project.find(filter_grid)

            let projects_length = total_projects.length

            // return...
            return_dict['projects'] = projects;

            return_dict['last_followers'] = parseInt(req.query['followers']);
            return_dict['last_tweets'] = parseInt(req.query['tweets']);
            return_dict['last_likes'] = parseInt(req.query['likes']);
            return_dict['last_replies'] = parseInt(req.query['replies']);
            return_dict['last_retweets'] = parseInt(req.query['retweets']);
            return_dict['last_sort'] = req.query['sortBy'];
            return_dict['last_search'] = '';
            return_dict['total_pages'] = Math.ceil(projects_length / limit)
            return_dict['projects_length'] = projects_length
            return_dict['limit'] = limit

            // Must return non filled out fields with empty string to avoid error

            if (device_type == 'mobile') {
                if (projects.length == 0) {
                    return_dict['none_found'] = true;

                    return res.render('alts/homemin.ejs', return_dict)
                }
                return_dict['none_found'] = false;

                return res.render('alts/homemin.ejs', return_dict)
            }

            else {
                if (projects.length == 0) {
                    return_dict['none_found'] = true;

                    return res.render('home.ejs', return_dict)
                }
                return_dict['none_found'] = false;

                return res.render('home.ejs', return_dict)
            }

        }




        else if (req.query['search'] !== undefined && req.query['search'] !== '') {
            let search_param = req.query['search']

            let projects = await Project.find({
                $or: [{ title: new RegExp(search_param, 'i') },
                { description: new RegExp(search_param, 'i') },
                { discord: new RegExp(search_param, 'i') },
                { followers: new RegExp(search_param, 'i') },
                { num_tweets: new RegExp(search_param, 'i') },
                { twitter_link: new RegExp(search_param, 'i') },
                { twitter_handle: new RegExp(search_param, 'i') },
                { website: new RegExp(search_param, 'i') },
                { drop_date: new RegExp(search_param, 'i') }
                ]
            })
                .sort({ internal_date: 1, followers: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .exec()

            let total_projects = await Project.find({
                $or: [{ title: new RegExp(search_param, 'i') },
                { description: new RegExp(search_param, 'i') },
                { discord: new RegExp(search_param, 'i') },
                { followers: new RegExp(search_param, 'i') },
                { num_tweets: new RegExp(search_param, 'i') },
                { twitter_link: new RegExp(search_param, 'i') },
                { twitter_handle: new RegExp(search_param, 'i') },
                { website: new RegExp(search_param, 'i') },
                { drop_date: new RegExp(search_param, 'i') }
                ]
            })

            let projects_length = total_projects.length

            // return...
            return_dict['projects'] = projects
            return_dict['last_search'] = req.query['search'];
            return_dict['last_sort'] = ''
            return_dict['last_tweets'] = ''
            return_dict['last_sort'] = ''
            return_dict['last_search'] = ''
            return_dict['last_tweets'] = ''
            return_dict['last_followers'] = ''
            return_dict['last_likes'] = ''
            return_dict['last_replies'] = ''
            return_dict['last_retweets'] = ''
            return_dict['total_pages'] = Math.ceil(projects_length / limit)
            return_dict['projects_length'] = projects_length
            return_dict['limit'] = limit

            if (device_type == 'mobile') {
                if (projects.length == 0) {
                    return_dict['none_found'] = true;

                    return res.render('alts/homemin.ejs', return_dict)
                }
                return_dict['none_found'] = false;

                return res.render('alts/homemin.ejs', return_dict)
            }

            else {
                if (projects.length == 0) {
                    return_dict['none_found'] = true;

                    return res.render('home.ejs', return_dict)
                }
                return_dict['none_found'] = false;

                return res.render('home.ejs', return_dict)
            }
        }


        else { // Initial load 

            let projects = await Project.find({ image: { $type: "string" }, followers: { $type: "int" } })
                .sort({ internal_date: 1, followers: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .exec()

            let total_projects = await Project.find({ image: { $type: "string" }, followers: { $type: "int" } })
                .sort({ internal_date: 1, followers: -1 })

            let projects_length = total_projects.length

            return_dict['projects'] = projects
            return_dict['last_sort'] = ''
            return_dict['last_search'] = ''
            return_dict['last_tweets'] = ''
            return_dict['last_followers'] = ''
            return_dict['last_likes'] = ''
            return_dict['last_replies'] = ''
            return_dict['last_retweets'] = ''
            return_dict['none_found'] = false;
            return_dict['total_pages'] = Math.ceil(projects_length / limit)
            return_dict['projects_length'] = projects_length
            return_dict['limit'] = limit

            if (device_type == 'mobile') {
                return res.render('alts/homemin.ejs', return_dict)
            }
            else {
                return res.render('home.ejs', return_dict)
            }
        }
    } catch (err) {
        res.render('deverror', { err })
    }
});

module.exports = router;