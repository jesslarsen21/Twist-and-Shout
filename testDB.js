const AWS = require('aws-sdk');
var dbController = require('./DBController');
var spController = require('./spotifyController');

var alexaID = "amzn1.ask.account.AF3QFMQTA5YT6AOCVRFPZWTQQ3EZ6UCJK42SVMUEPRS3MIEDH4DE52RWBMWOONO2XXXXJZUHVJSZLIISU2IZEQSU7UZNI2P2WNU6D2GQBS6TADYXA7YMB2MU7ZMRTBWZ23VJMRWQ2WTRUWUMQWTPORIE5QJYP33ZIXHHIZPGBFLCM5F66KMKAUFRVK2XSD3GYSJORG2EDL7RFQY";

dbController.GetUser(alexaID).promise().then(function(){
    dbController.updateScore(alexaID, "Steve", 20);
});

