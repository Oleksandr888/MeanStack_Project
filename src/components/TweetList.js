import React from 'react'
const Twit = require('twit')
const notifier = require('node-notifier');
const open = require('open');
const franc = require('franc')



const apikey = 'FOHXbolnVQlA86bzM351DuSUl'
const apiSecretKey = 'Oo1WYL3zhsjdxOa0mkodH2HGtaARlCVwHnATcKbRsqolLp2eO0'
const accessToken = '448564584-vlORezOHzrl63J6UWaNNn7143DJejYtpR8UcdeZk'
const accessTokenSecret = 'SKRrO8z8p0aypVdtlQ7K6j8FiWM7ZoZB9DKRcYmZEeOgN'

var T = new Twit({
  consumer_key:         apikey,
  consumer_secret:      apiSecretKey,
  access_token:         accessToken,
  access_token_secret:  accessTokenSecret,
});

( function getTweets() {

    // //1. GET RECENT TWEETS
     //T.get('search/tweets', { q: '#tesla since:2020-04-15', count: 100 }, function(err, data, response) {
    //   const tweets = data.statuses
    //   // .map(tweet => `LANG: ${franc(tweet.text)} : ${tweet.text}`) //CHECK LANGUAGE
    //   .map(tweet => tweet.text)
    //   .filter(tweet => tweet.toLowerCase().includes('elon'));
    //   console.log(tweets);
    // })

    // //2. REAL TIME MONITORING USING STREAM (HASHTAG)
     var stream = T.stream('statuses/filter', { track: '#travelling' })
     stream.on('tweet', function (tweet) {
         console.log(tweet.text);
         console.log('Language: ' + franc(tweet.text));
         console.log('------');
     })

    // 3. REAL TIME MONITORING USING STREAM (LOCATION)
    //var sanFrancisco = [ '-122.75', '36.8', '-121.75', '37.8' ]
    //var stream = T.stream('statuses/filter', { locations: sanFrancisco })
    
    //SHOW NOTIFICATION FOR EACH RECEIVED TWEET
    stream.on('tweet', function (tweet) {
      console.log(tweet.text);
      let url = `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`

      notifier.notify({
        title: tweet.user.name,
        message: tweet.text
      });

      notifier.on('click', async function(notifierObject, options, event) {
        console.log('clicked');
        await open(url);
      });
    })
})();

const TweetList = (props) => {

    

    return (
        <div>
           
              <h1>Hello</h1>

        </div>
    );

};

export default TweetList;
