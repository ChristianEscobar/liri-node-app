var Keys = require('./keys.js');
var Twitter = require('twitter');
var Moment = require('moment');
var Spotify = require('node-spotify-api');

var twitterConsumerKey = Keys.twitterKeys.consumer_key;
var twitterConsumerSecret = Keys.twitterKeys.consumer_secret;
var twitterAccessTokenKey = Keys.twitterKeys.access_token_key;
var twitterAccessTokeySecret = Keys.twitterKeys.access_token_secret;

var spotifyClientId = Keys.spotifyKeys.client_id;
var spotifyClientSecret = Keys.spotifyKeys.client_secret;

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
		consumer_key: twitterConsumerKey,
  	consumer_secret: twitterConsumerSecret,
  	access_token_key: twitterAccessTokenKey,
  	access_token_secret: twitterAccessTokeySecret
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
			var test = Moment(tweetDate);
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

	var spotify = new Spotify({
  	id: spotifyClientId,
  	secret: spotifyClientSecret
	});

	spotify.search({ type: 'track', query: 'All the Small Things' }, function(err, data) {
  	if (err) {
    	return console.log('Error occurred: ' + err);
  	}
 
		console.log(data); 
	});
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