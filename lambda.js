const Alexa = require('alexa-sdk');
const AWS = require('aws-sdk');
//var spController = require('./spotifyController');
var dbController = require('./DBController');
//var SpotifyWebApi = require('spotify-web-api-node');

const APP_ID = 	'amzn1.ask.skill.0965dcb2-75e5-46cb-9af3-4ee30756e3fe';


var region = "us-east-1";
var accessKeyId = 'AKIAIQN4JAX4WKKW7RIQ';
var secretAccessKey = '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';


var docClient = new AWS.DynamoDB.DocumentClient({
  region: region,
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
});

//spController.setToken('hello');

const handlers = {
    'LaunchRequest': function () {
        if( !(this.event.session.user.accessToken))
        {
            this.emit(':tellWithLinkAccountCard',
                       'to start using this skill, please use the companion app to authenticate on Amazon');
        }
        else{
            //spController.setToken(this.event.session.user.accessToken);
        }
        this.emit('StartGame');
    },
    'WhatsUp': function () {
        this.emit(':tell', 'Hello World.');
    },
    'StartGame': function () {
        var id = this.event.session.user.userId
        var URL = 'https://p.scdn.co/mp3-preview/4839b070015ab7d6de9fec1756e1f3096d908fba';
        var artistName = 'The Killers';
        dbController.GetUser(id);
        dbController.NewPlaylist(id);
        //do work to get songs
        //add songs to playlist
        dbController.UpdatePlaylist(id, URL, artistName);
        //update current song in user
        dbController.updateCurrentArtist(id, artistName);
        //id is forsure in the db
        this.response.audioPlayerPlay('REPLACE_ALL', URL, '1234', null, 0);
        this.emit(':responseReady');
    },


    
    'VerifyAnswer': function () {
        var id = this.event.session.user.userId;
        var userGuess = this.event.request.intent.slots.Guess.value;
        dbController.GetCurrentArtist(id).on('success', function(response) {
            var artist = response.data.Items[0].CurrentArtist;
            if(artist.toUpperCase() == userGuess.toUpperCase())
            {
                this.response.audioPlayerStop();
                this.response.speak('You got it!');
                this.emit(':responseReady');
            }
            this.emit(':tell', userGuess);
        });
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_MESSAGE');
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'Unhandled': function () {
        this.emit(':ask', this.t('HELP_MESSAGE'), this.t('HELP_MESSAGE'));
    },
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};