var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var api = express();

var bugData = [ 
    {'title':'brokenthing', 'id':1, 'owner':'me', 'status':'my bad', 'priority':'ffffuuu'},
    {'title':'secondbrokenthing', 'id':2, 'owner':'him', 'status':'also my bad', 'priority':'ffffuuu'},
];

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

//App root
app.get('/', function (req, res) {
    res.send("Just some root, move along, nothing to see here.");
});

//API root
api.use(bodyParser.json( { type: '*/*' })); 
api.get('/', function(req, res){
    res.send("This is the API! Congrats");
});
api.get('/bugs', function (req, res) {
    res.send(JSON.stringify(bugData));
});

api.post('/bugs', function (req, res) {
    

    console.log('start length: '+ bugData.length);
    var newBug = req.body;
    newBug.id = bugData.length + 1;
    bugData.push(newBug); 
    res.send('POST request to homepage');
    console.log('end length: '+ bugData.length);
});







app.use('/api', api)
app.use(express.static('static'));
