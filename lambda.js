const Alexa = require('alexa-sdk');
const AWS = require('aws-sdk');
var spController = require('./spotifyController');
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

const handlers = {
    'LaunchRequest': function () {
        if( !(this.event.session.user.accessToken))
        {
            this.emit(':tellWithLinkAccountCard',
                       'to start using this skill, please use the companion app to authenticate on Amazon');
        }
        else{
            spController.setToken(this.event.session.user.accessToken);
        }
        this.emit('StartGame');
    },
    'WhatsUp': function () {
        this.emit(':tell', 'Hello World.');
    },
    'StartGame': function () {
        //spController.setToken(this.event.session.user.accessToken);
        var id = this.event.session.user.userId
        var cont = false;

        var p1 = dbController.GetUser(id).promise().then(function(data) {console.log("IN PROMISE"); return true;}).catch(function(err) {
            console.log('Something went wrong!', err);
        });
        var p2 = dbController.NewPlaylist(id).promise().then(function(data) {console.log("IN PROMISE"); return true;}).catch(function(err) {
            console.log('Something went wrong!', err);
        });
        spController.setToken(this.event.session.user.accessToken)
        spController.getSongsFromRandomFeaturedPlaylist().then(function(data){
            data.forEach(function(song)
            {
                dbController.UpdatePlaylist(id,song.url, song.artist);
            });
            Promise.all([p1, p2]).then(function () {
                this.emit('NewSong');
              }.bind(this));
        }.bind(this)).catch(function(){
            console.log("error");
        });
        

        },
    'CreateGame': function () {
        var intentObj = this.event.request.intent;
        var id = this.event.session.user.userId
        if(!this.event.session.user.accessToken && !intentObj.slots.LinkedAccount.value)
        {
            this.emit(":elicitSlot", "LinkedAccount", "Would you like to link your spotify account, to play with your own playlists?", "Would you like to link your spotify account, to play with your own playlists?");            
        } else if (intentObj.slots.LinkedAccount.value) {
            if (intentObj.slots.LinkedAccount.value.toUpperCase() == "YES") {
                this.emit(':tellWithLinkAccountCard',
                'Okay! Go to your app, and link your spotify account. Once you have done that, start a game again!');
            }
            else{
                // prompt for ask me never option 
            }
        } else if (!intentObj.slots.PlayerName.value ){

            var p2 = dbController.GetUser(id).promise().then(function(data) {
                this.emit(":elicitSlot", "PlayerName", "Who's playing?", "Who's playing?");                
            }.bind(this)).catch(function(err) {
                console.log('Something went wrong!', err);
            });
        }
        else if (intentObj.slots.HasAnotherPlayer.value && intentObj.slots.HasAnotherPlayer.value != "defaultValue") {
            if(intentObj.slots.HasAnotherPlayer.value.toUpperCase() == "YES")
            {
                var updatedIntent = this.event.request.intent;
                updatedIntent.slots.PlayerName.value = "defaultValue";
                updatedIntent.slots.HasAnotherPlayer.value = "defaultValue";
                this.emit(":elicitSlot", "PlayerName", "Whats their name?", "reprompt me again daddy", updatedIntent);                
            }
            else{
                this.emit("PickPlaylist");
            }
        }
        else if (intentObj.slots.PlayerName.value && intentObj.slots.PlayerName.value != "defaultValue") {
            
            var p1 = dbController.updateScore(id,intentObj.slots.PlayerName.value, 0).promise().then(function(data) {
                this.emit(":elicitSlot", "HasAnotherPlayer", "Is anyone else playing?", "Is anyone else playing?");                
                
            }.bind(this)).catch(function(err) {
                console.log('Something went wrong!', err);
            });
        } 
        else {
            console.log(intentObj.slots.PlayerName.values);
        }
    },
    'PickPlaylist': function(){
        this.emit(':tell', 'Pick Playlist.');
    },
    'NewSong': function () {
        var id = this.event.session.user.userId
        var p1 = dbController.GetPlaylist(id).promise().then(function(data) {
            console.log("IN PROMISE"); 
            console.log(data.Items[0].Songs);
            return data.Items[0].Songs;
        }).catch(function(err) {
            console.log('Something went wrong!', err);
        });
        var p2 = dbController.GetUser(id).promise().then(function(data) {console.log("IN PROMISE"); return true}).catch(function(err) {
            console.log('Something went wrong!', err);
        });
                            
        Promise.all([p1, p2]).then(function (data) {
            var songs = data[0];
            var keys = Object.keys(songs);
            var artistName = keys[ keys.length * Math.random() << 0]
            var URL = songs[artistName];
            var p1 = dbController.DeleteSongFromPlaylist(id, artistName);
            var p2 = dbController.updateCurrentArtist(id, artistName).promise().then(function(data) {console.log("IN PROMISE"); return true;}).catch(function(err) {
                console.log("in promise");
            });
            Promise.all([p1,p2]).then(function (){
                this.response.audioPlayerPlay('REPLACE_ALL', URL, '1234', null, 0);
                this.emit(':responseReady');
            }.bind(this));
        }.bind(this));
    },
    'VerifyAnswer': function () {
        var id = this.event.session.user.userId;
        var userGuess = this.event.request.intent.slots.Guess.value;
        var p1 = dbController.GetCurrentArtist(id).promise().then(function(response) {
            var artist = response.Items[0].CurrentArtist;
            if(artist.toUpperCase() == userGuess.toUpperCase())
            {
                this.response.audioPlayerStop();
                this.response.speak('You got it!');
                this.emit(':responseReady');               
            }
            else 
            {
                this.emit(':tellWithCard', "Try Again!", "What I heard you say:", userGuess);

            }
            this.emit(':tell', userGuess);
        }.bind(this));
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
        this.emit(':tell', "Error");
    },
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};