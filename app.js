var Bing = require('node-bing-api')({
    accKey: "GQK0cjPKy6YIj2O1/fhuKIUbEK6XnXqp5/qcQrvRW2Q"
});
var express = require('express');
var app = express();
var searches = [];

app.get('/', function(req, res) {
    res.send('Hello World!');
});
app.get('/api/imagesearch/:sid', function(req, res) {
    console.log("Searching for", req.params.sid);
    var sid = req.params.sid;
    var offset = req.query.offset || 0;
    searches.push({term: sid, time: Math.floor(Date.now() / 1000)});
    Bing.images(sid, {
        skip: offset
    }, function(error, somethingsomething, body) {
        console.log(body.d.results[0]);
        var results = [];
        body.d.results.forEach(function(v, i, a) {
            /*
            { __metadata:
   { uri: 'https://api.datamarket.azure.com/Data.ashx/Bing/Search/v1/Image?Query=\'test\'&Options=\'\'&$skip=1&$top=1',
     type: 'ImageResult' },
  ID: '9b5e3218-5672-4172-aeb0-09f88793f7a9',
  Title: 'The GED® Test: Fast Facts & Resources - eCollegeFinder Blog',
  MediaUrl: 'http://blog.ecollegefinder.org/wp-content/uploads/2013/03/GED.jpg',
  SourceUrl: 'http://blog.ecollegefinder.org/2013/03/05/ged-test-fast-facts-resources/',
  DisplayUrl: 'blog.ecollegefinder.org/2013/03/05/ged-test-fast-facts-resources',
  Width: '4272',
  Height: '2848',
  FileSize: '3344438',
  ContentType: 'image/jpeg',
  Thumbnail:
   { __metadata: { type: 'Bing.Thumbnail' },
     MediaUrl: 'http://ts1.mm.bing.net/th?id=OIP.Mf2610945bd949176858232589f38659fH0&pid=15.1',
     ContentType: 'image/jpg',
     Width: '300',
     Height: '200',
     FileSize: '8674' } }

*/
            var result = {
                url: v.MediaUrl,
                snippet: v.Title,
                thumbnail: v.Thumbnail.MediaUrl
            }
            results.push(result);
        });
        res.send(JSON.stringify(results));
    });
    //res.send('Hello World!');
});
app.get('/api/latest/imagesearch', function(req, res) {
    res.send(JSON.stringify(searches));
});

app.listen(process.env.PORT || 3000, function() {
    console.log('Example app ready!');
});
