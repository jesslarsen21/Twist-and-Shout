var SpotifyWebApi = require("spotify-web-api-node");

/**
 * This example retrieves the top tracks for an artist.
 * https://developer.spotify.com/spotify-web-api/get-artists-top-tracks/
 */

/**
 * This endpoint doesn't require an access token, but it's beneficial to use one as it
 * gives the application a higher rate limit.
 *
 * Since it's not necessary to get an access token connected to a specific user, this example
 * uses the Client Credentials flow. This flow uses only the client ID and the client secret.
 * https://developer.spotify.com/spotify-web-api/authorization-guide/#client_credentials_flow
 */
var spotifyApi = new SpotifyWebApi({
    clientId : 'd340e4d2734740b9860e1b52e7a06376',
    clientSecret : '805e13df0d6346f0af1e0f57b4aac2d3',
});

function getSongs(data) {
    var songs = data.body.tracks.items;
    var allSongs = [];
    
    songs.forEach(function(song) {
        if (song.track.preview_url){
            art = song.track.artists[0].name.replace('\\', '');
            art = art.replace('"', '');
            art = art.replace('&', 'and');
            art = art.replace('\'', '');
            art = art.replace('.', '');
            art = art.replace(',', '');
            son = song.track.name.replace('\\', '');
            son = son.replace('"', '');
            son = son.replace('\'', '');
            if (art == "Daryl Hall and John Oates")
            {
                art = "Hall and Oates";
            }
            allSongs.push({
                artist:  art,
                song: son,
                url: song.track.preview_url
            });
        }
    });
    return allSongs;
}
module.exports = {
    // Retrieve an access token
    getSongsFromRandomFeaturedPlaylist: function()
    {
        return spotifyApi.clientCredentialsGrant().then(function(data) {
            return spotifyApi.getFeaturedPlaylists().then(function(data) {
                var firstPage = data.body.playlists
                id = '';
                return spotifyApi.getPlaylist('spotify', data.body.playlists.items[6].id).then(function(data){
                //console.log(data);
                    var songs =  getSongs(data);
                    //console.log(songs);
                    return songs;
                }).catch( function(err) {
                    console.log('Somthing went wrong!', err);
                });

            }).catch(function(err) {
                console.log('Something went wrong!', err);
            });
        }).catch( function(err) {
            console.log('Something went wrong!', err);
        });
        
    },


    setToken: function (token) {
        console.log(token);
        spotifyApi.setAccessToken(token);
    }

  };