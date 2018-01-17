var keysToTwitter = require('./keys.js');
var Twitter = require('twitter');
var moment = require('moment');

var consumerKey = keysToTwitter.consumer_key;
var consumerSecret = keysToTwitter.consumer_secret;
var accessTokenKey = keysToTwitter.access_token_key;
var accessTokeySecret = keysToTwitter.access_token_secret;

var userCommand = process.argv[2];
var commandParam = process.argv[3];

switch(userCommand) {
	case 'my-tweets':
		myTweets();
		break;
	case 'spotify-this-song':
		spotifyThisSong(commandParam);
		break;
	case 'movie-this':
		movieThis(commandParam);
		break;
	case 'do-what-it-says':
		doWhatItSays();
		break;
	default:
		displayCommands();
}

function displayCommands() {
	console.log('**************************');
	console.log('*   Available Commands   *');
	console.log('**************************\n');
	console.log('1. node liri.js my-tweets\n');
	console.log('2. node liri.js spotify-this-song \'<song name here>\'\n');
	console.log('3. node liri.js movie-this \'<movie name here>\'\n');
	console.log('4. node liri.js do-what-it-says');
}

function myTweets() {
	//GET https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=twitterapi&count=2

	var client = new Twitter({
		consumer_key: consumerKey,
  	consumer_secret: consumerSecret,
  	access_token_key: accessTokenKey,
  	access_token_secret: accessTokeySecret
	});

	client.get('statuses/user_timeline', function(error, tweets, response){
		if(error) {
			throw error;
		}

		console.log('-- Top 20 Tweets --');

		var counter = 0;

		for(var i=0; i<tweets.length; i++) {
			counter++;

			//var tweetDate = new Date(tweets[i].created_at);
			var tweetDate = new Date(tweets[i].created_at);
			var test = moment(tweetDate);
			var tweetText = tweets[i].text;

			console.log(counter + '.  ' + test.format('MMM DD YYYY hh:mm A'));
			console.log('\t' + tweetText);
			
		}

	});
}

function spotifyThisSong(songName) {
	console.log('Spotify');

	if(!songName) {
		console.log('A song name must be provided');
	}
}

function movieThis(movieName) {
	console.log('Movie This');

	if(!movieName) {
		console.log('A movie name must be provided');
	}
}

function doWhatItSays() {
	console.log('Do What It Says');
}