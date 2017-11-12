
var region = "us-east-1";
var accessKeyId = 'AKIAIQN4JAX4WKKW7RIQ';
var secretAccessKey = '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';


var docClient = new AWS.DynamoDB.DocumentClient({
    region: region,
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
});

module.exports = {
    
    GetPlaylist : function(user){
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
        
        return docClient.query(params, function(err, data) {
            if (err) {
                console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            } else {
                console.log("Query succeeded.");
                songs = data.Items[0].Songs;
            }
        })
    },

    UpdatePlaylist : function(id, URL, ARTIST){
        var params = {
            TableName: 'Playlist',
            Key: { UserID : id },
            UpdateExpression: 'SET #songs.#artist = :url',            
            ExpressionAttributeNames: {
                '#songs' : 'Songs',
                '#artist' : ARTIST
            },
            ExpressionAttributeValues: {
            ':url' : URL
            }
        };
        docClient.update(params, function(err, data) {
            if (err) console.log(err);
            else console.log("Query succeeded.");
        });     
    },

    NewPlaylist : function(user){
        var params = {
            TableName : "Playlist",
            Item: {
                'UserID': user,
                'Songs' : {}
            }
        };
        docClient.put(params, function(err, data) {
            if (err) {
                console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            } else {
                console.log("Query succeeded.");
            }
        });  
    },

    newUserItem : function(id){
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
    },

    newUserItem : function(id){
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
    },

    updateScore : function(id, score){
        var params = {
            TableName: 'Users',
            Key: { UserID : id },
            UpdateExpression: 'set #a = :x',
            ExpressionAttributeNames: {'#a' : 'Score'},
            ExpressionAttributeValues: {
            ':x' : score,
            }
        };
        docClient.update(params, function(err, data) {
            if (err) console.log(err);
            else console.log("Query succeeded.");
        });
    },

    updateCurrentArtist : function(id, name){
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
    },

  
    GetUser : function(user){
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
    },

    GetCurrentArtist : function(user){
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
        
        return docClient.query(params, function(err, data) {
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
    },
}
/* 
GetPlayList Example:
GetPlaylist("John").on('success', function(response) {
    console.log(response.data.Items[0].Songs);
  });

GetCurrentArtist Example:
GetCurrentArtist("John").on('success', function(response) {
    console.log(response.data.Items[0].CurrentArtist);
  });

update examples:
newUserItem("Test");
updateScore("John", 10);
updateCurrentArtist("John", "Testing");
NewPlaylist("PLEASEAGAIN");
*/
