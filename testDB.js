const AWS = require('aws-sdk');
var dbController = require('./DBController');
var spController = require('./spotifyController');

<<<<<<< HEAD
spController.setToken("BQAqlmxDv5UkE62BjMAqAfx1nEuQ3is9jypgcQ7ylEnFsIWJ3pZYFjJw58aUBG6pTFj9SZ7P5GEasx0YUQ7dPM0LijfmOLBGyk1srL5q5MRw6-ibeaosrAH7kP5qj1EFOpYI1Yrz2WLum2w");
//spController.getPlaylistsForCategoryFromUserInput('hiphop');
spController.getArtistsTopTracks('sweater beats');
=======
var alexaID = "amzn1.ask.account.AF3QFMQTA5YT6AOCVRFPZWTQQ3EZ6UCJK42SVMUEPRS3MIEDH4DE52RWBMWOONO2XXXXJZUHVJSZLIISU2IZEQSU7UZNI2P2WNU6D2GQBS6TADYXA7YMB2MU7ZMRTBWZ23VJMRWQ2WTRUWUMQWTPORIE5QJYP33ZIXHHIZPGBFLCM5F66KMKAUFRVK2XSD3GYSJORG2EDL7RFQY";
>>>>>>> 916af1f563383d301f8228bc1545d2787de0c3f5

dbController.GetUser(alexaID).promise().then(function(){
    dbController.updateScore(alexaID, "Steve", 20);
});

