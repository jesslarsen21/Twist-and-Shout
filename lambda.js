const Alexa = require('alexa-sdk');
const AWS = require('aws-sdk');
//var spController = require('./spotifyController');

var SpotifyWebApi = require('spotify-web-api-node');

const APP_ID = 	'amzn1.ask.skill.0965dcb2-75e5-46cb-9af3-4ee30756e3fe';


var region = "us-east-1";
var accessKeyId = 'AKIAIQN4JAX4WKKW7RIQ';
var secretAccessKey = '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';


var docClient = new AWS.DynamoDB.DocumentClient({
  region: region,
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
});

function GetPlaylist(user){
    var songs = [];
    var params = {
        TableName : "Playlist",
        KeyConditionExpression: "#UserID = :idValue",
        ExpressionAttributeNames:{
            "#UserID": "UserID"
        },
        ExpressionAttributeValues: {
            ":idValue":user,
        }
      };
      
      docClient.query(params, function(err, data) {
          if (err) {
              console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
          } else {
              console.log("Query succeeded.");
              songs = data.Items[0].Songs;
          }
      });
    return songs;      
}

function newUserItem(id)
{
    var params = {
        TableName : "Users",
        Item: {
            'UserID': id,
            'Score': 0,
            'CurrentArtist': "The Killers"
        }
    };
    docClient.put(params, function(err, data) {
        if (err) {
          console.log("Error", err);
        } else {
          console.log("Success", data);
        }
      });
}

function updateScore(id){
    var params = {
        TableName: 'Users',
        Key: { UserID : id },
        UpdateExpression: 'set #a = :x',
        ExpressionAttributeNames: {'#a' : 'Score'},
        ExpressionAttributeValues: {
          ':x' : 20,
        }
    };
    docClient.update(params, function(err, data) {
        if (err) console.log(err);
        else console.log(data);
     });
}

function updateCurrentArtist(id, name){
    var params = {
        TableName: 'Users',
        Key: { UserID : id },
        UpdateExpression: 'set #a = :x',
        ExpressionAttributeNames: {'#a' : 'CurrentArtist'},
        ExpressionAttributeValues: {
          ':x' : name,
        }
    };
    docClient.update(params, function(err, data) {
        if (err) console.log(err);
        else console.log(data);
     });
}

function GetUser(user){
    var d = false;
    var params = {
        TableName : "Users",
        KeyConditionExpression: "#UserID = :idValue",
        ExpressionAttributeNames:{
            "#UserID": "UserID"
        },
        ExpressionAttributeValues: {
            ":idValue":user,
        }
      };
      
    docClient.query(params, function(err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log("Query succeeded.");
            if (data.Count == 0)
            {
                console.log("That User was not found. I will add one.");
                newUserItem(user);
                d = true;
            }
            d = true;
          }
      });
      return d;
}

function GetCurrentArtist(user){
    var artist = null;
    var params = {
        TableName : "Users",
        KeyConditionExpression: "#UserID = :idValue",
        ExpressionAttributeNames:{
            "#UserID": "UserID"
        },
        ExpressionAttributeValues: {
            ":idValue":user,
        }
      };
      
    docClient.query(params, function(err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log("Query succeeded.");
            if (data.Count == 0)
            {
                console.log("That User was not found");
            }
            artist = data.Items[0].CurrentArtist;
          }
      });
    return artist;      
}

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
        this.emit('WhatsUp');
    },
    'WhatsUp': function () {
        
        this.emit(':tell', 'Hello World.');
    },
    'StartGame': function () {
        var id = this.event.session.user.userId
        var URL = 'https://p.scdn.co/mp3-preview/4839b070015ab7d6de9fec1756e1f3096d908fba';
        var artistName = 'The Killers';
        
        this.response.audioPlayerPlay('REPLACE_ALL', URL, '1234', null, 0);
        this.emit(':responseReady');
    },
    'VerifyAnswer': function () {
        var userGuess = this.event.request.intent.slots.Guess.value;
        var artist = 'the killers';
        if(artist.toUpperCase() == userGuess.toUpperCase())
        {
            this.response.audioPlayerStop();
            this.response.speak('You got it!');
            this.emit(':responseReady');
        }
        this.emit(':tell', userGuess);
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