const express = require('express')
const http = require('http')
const socketIO = require('socket.io')

const port = 4001
const app = express()
const server = http.createServer(app)
const io = socketIO(server)

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017');
//var mongo = require('mongodb').MongoClient;
//const mongoUrl = "mongodb://localhost:27017/hackathon";
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    console.log('connected');
});

var peopleSchema = mongoose.Schema({
    name: String,
    username: String,
    password: String
});
var People = mongoose.model('People', peopleSchema);
// clean previous data
People.deleteMany({}, function (err) {
    if (err) return handleError(err);
    // deleted at most one tank document
});

// create an admin
var pw='password';
var admin = new People({ name: 'Admin', username: 'admin', password: pw });
admin.save(function (err) {
    if (err) return handleError(err);
    // saved!
    console.log('admin saved')
    //console.log(admin);
});

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
  
    /*socket.on('login', (name) => {
        console.log('New user logged in: ', name)
        users[key] = { key: key, name: name }
        io.sockets.emit('new user', {user: users[key], users: users})
    })

    socket.on('send', (obj) => {
        console.log(obj.from, ' sends ', obj.msg, ' to ', obj.to)
        io.sockets.emit('new msg', obj)
    })

    socket.on('disconnect', () => {
        console.log('user disconnected: ', users[key])
        io.sockets.emit('user leave', users[key])
        delete users[key]
    })*/
})

server.listen(port, () => console.log(`Listening on port ${port}`))