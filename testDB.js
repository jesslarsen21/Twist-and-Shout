const AWS = require('aws-sdk');

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
        TableName : "Playlist",
        Item: {
            'UserID': id,
            'Score': 0,
            'CurrentArtist': null
        }
    };
    docClient.put(params, function(err, data) {
        if (err) {
          console.log("Error", err);
        } else {
            console.log("Query succeeded.");
        }
      });
}

function newUserItem(id)
{
    var params = {
        TableName : "Users",
        Item: {
            'UserID': id,
            'Score': 0,
            'CurrentArtist': null
        }
    };
    docClient.put(params, function(err, data) {
        if (err) {
          console.log("Error", err);
        } else {
            console.log("Query succeeded.");
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
        else console.log("Query succeeded.");
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
        else console.log("Query succeeded.");
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

GetPlaylist("John");
newUserItem("Test");
updateScore("John");
updateCurrentArtist("John", "Testing");
GetUser("Work");
GetCurrentArtist("John");
