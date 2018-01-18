var Keys = require('./keys.js');
var Twitter = require('twitter');
var Moment = require('moment');
var Spotify = require('node-spotify-api');
var Request = require('request');
var Fs = require('fs');

var twitterConsumerKey = Keys.twitterKeys.consumer_key;
var twitterConsumerSecret = Keys.twitterKeys.consumer_secret;
var twitterAccessTokenKey = Keys.twitterKeys.access_token_key;
var twitterAccessTokeySecret = Keys.twitterKeys.access_token_secret;

var spotifyClientId = Keys.spotifyKeys.client_id;
var spotifyClientSecret = Keys.spotifyKeys.client_secret;

var omdbAPIKey = Keys.omdbKeys.api_key;

var userCommand = process.argv[2];
var commandParam = process.argv[3];

start(userCommand, commandParam);

function start(liriCommand, commandInput) {
		switch(liriCommand) {
			case 'my-tweets':
				myTweets();
				break;
			case 'spotify-this-song':
				spotifyThisSong(commandInput);
				break;
			case 'movie-this':
				movieThis(commandInput);
				break;
			case 'do-what-it-says':
				doWhatItSays();
				break;
			default:
				displayCommands();
	}
}

function displayCommands() {
	console.log('**************************');
	console.log('*   Available Commands   *');
	console.log('**************************\n');
	console.log('1. node liri my-tweets\n');
	console.log('2. node liri spotify-this-song \'<song name here>\'\n');
	console.log('3. node liri movie-this \'<movie name here>\'\n');
	console.log('4. node liri do-what-it-says');
}

function myTweets() {
	console.log('**************************');
	console.log('*     Top 20 Tweets      *');
	console.log('**************************\n');

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

		// Display error if no data was found
		if(tweets.length === 0) {
			console.log('-> No data returned from Twitter.');

			return;
		}

		var counter = 0;

		for(var i=0; i<tweets.length; i++) {
			counter++;

			var tweetDate = new Date(tweets[i].created_at);
			var test = Moment(tweetDate);
			var tweetText = tweets[i].text;

			console.log(counter + '.  ' + test.format('MMM DD YYYY hh:mm A'));
			console.log('\t' + tweetText);
			
		}
	});
}

function spotifyThisSong(songName) {
	console.log('**************************');
	console.log('*         Spotify        *');
	console.log('**************************\n');

	var query = '';

	if(!songName) {
		console.log('-> Song title not provided, default will be used. <-\n');

		var defaultSongName = 'The Sign';
		var defaultArtistName = 'Ace of Base';

		// Replace spaces with %20AND%20
		defaultSongName = encodeSpacesInStringForSpotify(defaultSongName);
		defaultArtistName = encodeSpacesInStringForSpotify(defaultArtistName);

		// Build query
		query = 'track:' + defaultSongName + ' artist:' + defaultArtistName;

	} else {
		songName = songName.trim();

		songName = encodeSpacesInStringForSpotify(songName);

		// Buid query
		query = 'track:' + songName.trim();
	}

	var spotify = new Spotify({
  	id: spotifyClientId,
  	secret: spotifyClientSecret
	});

	spotify.search({ type: 'track', query: query }, function(err, data) {
  	if (err) {
    	throw err;
  	}

  	if(data.tracks.items.length === 0) {
  		console.log('-> No data returned from Spotify.');

  		return;
  	}

  	for(var i=0; i<data.tracks.items.length; i++){
  		var artist = data.tracks.items[i].artists[0].name;
  		var song = data.tracks.items[i].name;
  		var preview = data.tracks.items[i].preview_url;
  		var album = data.tracks.items[i].album.name;

  		console.log((i + 1 + '. ') + ' Artist:  ' + artist);
  		console.log('\t|-- Track:  ' + song);
  		console.log('\t|-- Preview:  ' + preview);
  		console.log('\t|-- Album:  ' + album);
  	}
		
	});
}

function movieThis(movieName) {
	console.log('**************************');
	console.log('*           OMDB         *');
	console.log('**************************\n');

	var omdbURL = 'http://www.omdbapi.com/?'
		+ 'apikey=' + omdbAPIKey;

	if(!movieName || movieName.length === 0) {
		console.log('-> Movie title not provided, default will be used. <-\n');

		movieName = 'Mr. Nobody';
	}

	omdbURL += '&t=' + movieName.trim();

	Request(omdbURL, function (error, response, body) {

		if(error) throw error;

		var jsonBody = JSON.parse(body);

		console.log('Title: ' + jsonBody.Title);
		console.log('Release Year: ' + jsonBody.Year);
		console.log('Imdb Rating: ' + jsonBody.imdbRating);

		// Rotten Tomatoes rating
		var rottenTomatoesRating = 'N/A';

		for(var prop in jsonBody.Ratings) {
			if(jsonBody.Ratings[prop].Source.toLowerCase() === 'rotten tomatoes') {
				rottenTomatoesRating =  jsonBody.Ratings[prop].Value;

				break;
			}
		}

		console.log('Rotten Tomatoes Rating: ' + rottenTomatoesRating);
		console.log('Country: ' + jsonBody.Country);
		console.log('Language: ' + jsonBody.Language);
		console.log('Plot: ' + jsonBody.Plot);
		console.log('Actors: ' + jsonBody.Actors);
	});
}

function doWhatItSays() {
	console.log('**************************');
	console.log('*    Do What It Says     *');
	console.log('**************************\n');

	Fs.readFile('random.txt', 'utf8', (error, data) => {
		if(error) throw error;
		
		if(data.length === 0) {
			console.log('-> No data found in random.txt.  Make sure the file contains valid LIRI commands.');

			displayCommands();

			return;
		} else {
			// split file contents in order to extract command and command input
			var fileContentsArray = data.split(',');

			var liriCommand = fileContentsArray[0];
			var commandInput = fileContentsArray[1];

			// Bad things will happen if the command in the random.txt file is do-what-it-says =)
			if(liriCommand === 'do-what-it-says') {
				console.log('KABOOOM!!!  I don\'t recommend doing that!');

				return;
			}

			start(liriCommand, commandInput);
		}
	});
}

function encodeSpacesInStringForSpotify(stringValue) {
	// Removing double quotes to address bug found when reading from the random.txt file
	stringValue = stringValue.split('"').join('');

	return stringValue.split(' ').join('%20AND%20');
}