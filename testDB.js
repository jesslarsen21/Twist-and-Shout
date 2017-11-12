const AWS = require('aws-sdk');
var dbController = require('./DBController');

GetPlaylist("John").on('success', function(response) {
    console.log(response.data.Items[0].Songs);
  });

GetCurrentArtist("John").on('success', function(response) {
    console.log(response.data.Items[0].CurrentArtist);
  });

newUserItem("Test");
updateScore("John", 10);
updateCurrentArtist("John", "Testing");
NewPlaylist("PLEASEAGAIN");

