const express = require('express')
const http = require('http')
const socketIO = require('socket.io')

const port = 4001
const app = express()
const server = http.createServer(app)
const io = socketIO(server)

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017');

var path = require('path');
var filePluginLib = require('mongoose-file');
var filePlugin = filePluginLib.filePlugin;
var make_upload_to_model = filePluginLib.make_upload_to_model;
var uploads_base = path.join(__dirname, "uploads");
var uploads = path.join(uploads_base, "u");
//var mongo = require('mongodb').MongoClient;
//const mongoUrl = "mongodb://localhost:27017/hackathon";
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'db connection error:'));
db.once('open', function() {
    // we're connected!
    console.log('db connected');
});

var peopleSchema = mongoose.Schema({
    name: String,
    username: String,
    password: String
});
var People = mongoose.model('People', peopleSchema);

var articleSchema = mongoose.Schema({
    title: String,
    text: String,
    poster: String
});
articleSchema.plugin(filePlugin, {
    name: "image",
    upload_to: make_upload_to_model(uploads, 'photos'),
    relative_to: uploads_base
});
var Article = mongoose.model('Article', articleSchema);

io.on('connection', socket => {
    console.log('New client connected: ', socket.client.id)
    var key = socket.client.id

    socket.on('login request', (obj) => {
        console.log('login request')
        People.findOne(obj, (err, match) => {
            if (err) return console.error(err);
            //console.log(matches);
            if (match)
                io.sockets.emit('login success', match);
            else
                io.sockets.emit('login failed');
        })
    })

    socket.on('logout request', (obj) => {
        console.log('log out');
        io.sockets.emit('logout success');
    })

    socket.on('post request', postRequest);

    socket.on('query article', (obj) => {
        Article.findOne({_id: obj.id}, function (err, match) {
            if (err) return handleError(err);
            console.log(match);
            io.sockets.emit('query article response', match)
        });
    })
})

async function postRequest(obj)
{
    var article = new Article({title: obj.title, text: obj.text, poster: obj.poster, image: obj.img});
    //article.image.data = obj.img;
    //article.image.contentType = 'image/jpg';
    await article.save(function (err) {
        if (err) return handleError(err);
        console.log('new post saved')
        console.log(article);
        io.sockets.emit('new post', article);
    });
    
    /**/
}

function handleError(err)
{
    console.log(err);
    return false;
}

server.listen(port, () => console.log(`Listening on port ${port}`))