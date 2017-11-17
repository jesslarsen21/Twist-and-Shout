const AWS = require('aws-sdk');
var dbController = require('./DBController');
var spController = require('./spotifyController');

spController.setToken("BQAqlmxDv5UkE62BjMAqAfx1nEuQ3is9jypgcQ7ylEnFsIWJ3pZYFjJw58aUBG6pTFj9SZ7P5GEasx0YUQ7dPM0LijfmOLBGyk1srL5q5MRw6-ibeaosrAH7kP5qj1EFOpYI1Yrz2WLum2w");
//spController.getPlaylistsForCategoryFromUserInput('hiphop');
spController.getArtistsTopTracks('sweater beats');



/* var p2 = dbController.GetPlaylist("amzn1.ask.account.AF3QFMQTA5YT6AOCVRFPZWTQQ3EZ6UCJK42SVMUEPRS3MIEDH4DE52RWBMWOONO2XXXXJZUHVJSZLIISU2IZEQSU7UZNI2P2WNU6D2GQBS6TADYXA7YMB2MU7ZMRTBWZ23VJMRWQ2WTRUWUMQWTPORIE5QJYP33ZIXHHIZPGBFLCM5F66KMKAUFRVK2XSD3GYSJORG2EDL7RFQY").promise().then(function(data) {
    console.log("IN PROMISE")
    //return Object.keys(data.Items[0].Songs);
    return data.Items[0].Songs;
}).catch(function(err) {
    console.log('Something went wrong!', err);
});

Promise.all([p2]).then(function (data) {
    console.log(data[0]);
}); */

    //dbController.DeleteSongFromPlaylist("amzn1.ask.account.AF3QFMQTA5YT6AOCVRFPZWTQQ3EZ6UCJK42SVMUEPRS3MIEDH4DE52RWBMWOONO2XXXXJZUHVJSZLIISU2IZEQSU7UZNI2P2WNU6D2GQBS6TADYXA7YMB2MU7ZMRTBWZ23VJMRWQ2WTRUWUMQWTPORIE5QJYP33ZIXHHIZPGBFLCM5F66KMKAUFRVK2XSD3GYSJORG2EDL7RFQY", "please");

/* 'AnotherSong': function(){
    var id = this.event.session.user.userId;
    GetPlaylist(id).on('success', function(response) {
        var songs = response.data.Items[0].Songs;
        var keys = Object.keys(songs);
        var numOfSongs = keys.length;
        var index = Math.floor(Math.random() * ((numOfSongs - 1) - 0 + 1)) + 0;
        var nextArtist = keys[index];
        var nextSongURL = songs[nextArtist];
        //add artist to current artist in user
        dbController.updateCurrentArtist(id, nextArtist);

        //delete song from playlsit

        this.response.audioPlayerPlay('REPLACE_ALL', nextSongURL, '1234', null, 0);
        this.emit(':responseReady');
    });
    
}, */