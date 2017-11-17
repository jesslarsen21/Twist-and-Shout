const AWS = require('aws-sdk');
var dbController = require('./DBController');
var spController = require('./spotifyController');

spController.setToken("BQAje4iii-puW9EsUJLIURC9N_pp1AaaAks3Oovx4O9R6eKfBaMK8v6nMPlJp1tEqE04aR_m1weRfU_AnmcRICQscyqtGbaUHzwX_e5aD4tl9vCULsYGZWJnCOzFd5EWsGTdGrvOvb3NMCU");
//spController.getPlaylistsForCategoryFromUserInput('hiphop');
spController.getPlaylistTracks('37i9dQZF1DWXJfnUiYjUKT', 'spotify');
var alexaID = "amzn1.ask.account.AF3QFMQTA5YT6AOCVRFPZWTQQ3EZ6UCJK42SVMUEPRS3MIEDH4DE52RWBMWOONO2XXXXJZUHVJSZLIISU2IZEQSU7UZNI2P2WNU6D2GQBS6TADYXA7YMB2MU7ZMRTBWZ23VJMRWQ2WTRUWUMQWTPORIE5QJYP33ZIXHHIZPGBFLCM5F66KMKAUFRVK2XSD3GYSJORG2EDL7RFQY";

dbController.GetUser(alexaID).promise().then(function(){
    dbController.updateScore(alexaID, "Steve", 20);
});

