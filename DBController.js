const AWS = require('aws-sdk');
var region = "us-east-1";
var accessKeyId = 'AKIAIQN4JAX4WKKW7RIQ';
var secretAccessKey = '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';

docClient = new AWS.DynamoDB.DocumentClient({
    region: region,
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
})

function newUser(id){
    var params = {
        TableName : "Playlist",
        Item: {
            'UserID': id,
            'Score': 0,
            'CurrentArtist': null
        }
    };
    return docClient.put(params, function(err, data) {
        if (err) {
        console.log("Error", err);
        } else {
            console.log("Query succeeded.");
        }
    });
}

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
        return docClient.update(params, function(err, data) {
            if (err) console.log(err);
            else console.log("Query succeeded.");
        });     
    },

   DeleteSongFromPlaylist : function(id, ARTIST){
        var params = {
            TableName: 'Playlist',
            Key: { UserID : id },
            UpdateExpression: 'REMOVE #songs.#artist',            
            ExpressionAttributeNames: {
                '#songs' : 'Songs',
                '#artist' : ARTIST
            }
        };
        return docClient.update(params, function(err, data) {
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
       return docClient.put(params, function(err, data) {
            if (err) {
                console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
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
        return docClient.update(params, function(err, data) {
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
        return docClient.update(params, function(err, data) {
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
        
        return docClient.query(params, function(err, data) {
            if (err) {
                console.log(err);
            } else {
                console.log("Query succeeded.");
                if (data.Count == 0)
                {
                    console.log("That User was not found. I will add one.");
                    var params = {
                        TableName : "Users",
                        Item: {
                            'UserID': user,
                            'Score': 0,
                            'CurrentArtist': null
                        }
                    };
                    return docClient.put(params, function(err, data) {
                        if (err) {
                        console.log("Error", err);
                        } else {
                            console.log("Query succeeded.");
                        }
                    });
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
