const AWS = require('aws-sdk');
var dbController = require('./DBController');
var spController = require('./spotifyController');

spController.setToken("BQD7-mw4UdsuIt7N4hqclMGIQq4yg5K5k5WyK172EPDzbImrbpqGKyfjPn5BCBA7vQRtaYpb5D-A0UDVLMtye0W4l_j6XKM6FgK_6aJUEUt-2JkRqML2zyVUvXFmH8x5CV8_KNt51OVS4io");
//spController.getPlaylistsForCategoryFromUserInput('hiphop');
spController.getArtistsTopTracks('janelle monae');
var alexaID = "amzn1.ask.account.AF3QFMQTA5YT6AOCVRFPZWTQQ3EZ6UCJK42SVMUEPRS3MIEDH4DE52RWBMWOONO2XXXXJZUHVJSZLIISU2IZEQSU7UZNI2P2WNU6D2GQBS6TADYXA7YMB2MU7ZMRTBWZ23VJMRWQ2WTRUWUMQWTPORIE5QJYP33ZIXHHIZPGBFLCM5F66KMKAUFRVK2XSD3GYSJORG2EDL7RFQY";

dbController.GetUser(alexaID).promise().then(function(){
    dbController.updateScore(alexaID, "Steve", 20);
});

