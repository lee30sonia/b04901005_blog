const express = require('express')
const http = require('http')
const socketIO = require('socket.io')

const port = 4001
const app = express()
const server = http.createServer(app)
const io = socketIO(server)

var users = {}
/* key --> user object
ex. users[3rW8nViDXzaIS-16AAAC] =  
{
    key: "3rW8nViDXzaIS-16AAAC",
    name: "meow",
    img: default1,
    contacts: [
        { 
            key: ,
            name: ,
            sent: [],
            received: []
        }, 
        ...
    ]
}
*/

io.on('connection', socket => {
    console.log('New client connected: ', socket.client.id)
    var key = socket.client.id
    users[key] = {}
    //users.push({ id: socket.client.id })
  
    socket.on('login', (name) => {
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
    })
})

server.listen(port, () => console.log(`Listening on port ${port}`))