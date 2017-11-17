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
    clientId: 'd340e4d2734740b9860e1b52e7a06376',
    clientSecret: '805e13df0d6346f0af1e0f57b4aac2d3',
});

function getSongs(data) {
    var songs = data.body.tracks.items;
    var allSongs = [];

    songs.forEach(function (song) {
        if (song.track.preview_url) {
            art = song.track.artists[0].name.replace('\\', '');
            art = art.replace('"', '');
            art = art.replace('&', 'and');
            art = art.replace('\'', '');
            art = art.replace('.', '');
            art = art.replace(',', '');
            son = song.track.name.replace('\\', '');
            son = son.replace('"', '');
            son = son.replace('\'', '');
            if (art == "Daryl Hall and John Oates") {
                art = "Hall and Oates";
            }
            allSongs.push({
                artist: art,
                song: son,
                url: song.track.preview_url
            });
        }
    });
    return allSongs;
}

function getPlaylists(data) {
    var playlists
    if (data.body.playlists)
    {
        playlists = data.body.playlists.items
    }
    else
    {
        playlists = data.body.items;
    }
    var allPlaylists = [];

    playlists.forEach(function (playlist) {
        listName = playlist.name.replace('\\', '');
        listName = listName.replace('"', '');
        listName = listName.replace('&', 'and');
        listName = listName.replace('\'', '');
        listName = listName.replace('.', '');
        listName = listName.replace(',', '');
        listName = listName.replace('\-', ' ');
        listName = listName.replace('-', '');
        listName = listName.replace('This Is: ', '');
        playlistId = playlist.id;
        allPlaylists.push(
            {
                playlist: listName,
                id: playlistId
            });
    });
    return allPlaylists;
}

function getArtistsTopTracks(data) {
    var songs = data.body.tracks;
    var allSongs = [];

    songs.forEach(function (song) {
        if (song.preview_url) {
            art = song.artists[0].name;
            son = song.name.replace('\\', '');
            son = son.replace('"', '');
            son = son.replace('\'', '');
            if (art == "Daryl Hall and John Oates") {
                art = "Hall and Oates";
            }
            allSongs.push({
                artist: art,
                song: son,
                url: song.preview_url
            });
        }
    });
    return allSongs;
}

function getCategoryList(data)
{
    var cats = data.body.categories.items;
    var allCats = [];

    cats.forEach(function (cat)
    {
        cate = cat.name;
        cate = cate.replace('\-', ' ');
        cate = cate.replace('\/', ' ');
        cate = cate.replace('\'', '');        
        allCats.push({name: cate});
    });
    return allCats;
}

module.exports = {
    // Retrieve an access token
    getSongsFromRandomFeaturedPlaylist: function () {
        return spotifyApi.clientCredentialsGrant().then(function (data) {
            return spotifyApi.getFeaturedPlaylists().then(function (data) {
                var firstPage = data.body.playlists
                id = '';
                return spotifyApi.getPlaylist('spotify', data.body.playlists.items[2].id).then(function(data){
                console.log(data);
                    var songs =  getSongs(data);
                    //console.log(songs);
                    return songs;
                }).catch(function (err) {
                    console.log('Somthing went wrong!', err);
                });

            }).catch(function (err) {
                console.log('Something went wrong!', err);
            });
        }).catch(function (err) {
            console.log('Something went wrong!', err);
        });

    },
    // Gets a list of the users playlists.
    getListOfCurrentUsersPlaylists: function () {
        return spotifyApi.clientCredentialsGrant().then(function (data) {
            return spotifyApi.getMe().then(function (data) {
                var id = data.body.id;
                return spotifyApi.getUserPlaylists(id).then(function (data) {
                    var playlists = getPlaylists(data);
                    // console.log(playlists);
                    return playlists;
                }).catch(function (err) {
                    console.log('Somthing went wrong!', err);
                });
            }).catch(function (err) {
                console.log('Something went wrong!', err);
            });
        }).catch(function (err) {
            console.log('Something went wrong!', err);
        });
    },

    getPlaylistsForCategoryFromUserInput: function (category)
    {
        return spotifyApi.clientCredentialsGrant().then(function (data) 
        {
            return spotifyApi.getPlaylistsForCategory(category).then(function(data)
            {
                var catPlaylists = getPlaylists(data);
                // console.log(catPlaylists)
            }).catch(function (err) {
                console.log('Something went wrong!', err);
            });
        }).catch(function (err) {
            console.log('Something went wrong!', err);
        });
    },  

    getArtistsTopTracks: function (artist)
    {
        console.log(artist);
        return spotifyApi.clientCredentialsGrant().then(function (data) 
        {
            return spotifyApi.searchArtists(artist).then(function(data)
            {
                var artId = data.body.artists.items[0].id;
                return spotifyApi.getArtistTopTracks(artId, 'US').then(function(data)
                {
                    var tracks = getArtistsTopTracks(data);
                    console.log(tracks);
                    return tracks;
                }).catch(function (err) {
                    console.log('Something went wrong!', err);
                });    
            }).catch(function (err) {
                console.log('Something went wrong!', err);
            });
        }).catch(function (err) {
            console.log('Something went wrong!', err);
        });
    },
    
    addTrackToUserLibrary: function (songId) {
        console.log(songId);
        return spotifyApi.clientCredentialsGrant().then(function (data) {
            return spotifyApi.addToMySavedTracks([songId]).then(function (data) {
                console.log(data);
            }).catch(function (err) {
                console.log('Something went wrong!', err);
            });
        }).catch(function (err) {
            console.log('Something went wrong!', err);
        });
    },

    getListOfCategorys: function () {
        return spotifyApi.clientCredentialsGrant().then(function (data) {
            return spotifyApi.getCategories({
                limit : 40,
                country: 'US',
            }).then(function (data) {
                var categorys = getCategoryList(data);
                // console.log(categorys);
            }).catch(function (err) {
                console.log('Something went wrong!', err);
            });
        }).catch(function (err) {
            console.log('Something went wrong!', err);
        });
    },
    setToken: function (token) {
        spotifyApi.setAccessToken(token);
    }

}