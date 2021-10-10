const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const path = require('path');
const socketio = require('socket.io')
module.exports = app

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'index.html')));

// static file-serving middleware
app.use(express.static(path.join(__dirname, '..', 'public')))

// any remaining requests with an extension (.js, .css, etc.) send 404
app.use((req, res, next) => {
  if (path.extname(req.path).length) {
    const err = new Error('Not found')
    err.status = 404
    next(err)
  } else {
    next()
  }
})

// sends index.html
app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public/index.html'))
})

// error handling endware
app.use((err, req, res, next) => {
  console.error(err)
  console.error(err.stack)
  res.status(err.status || 500).send(err.message || 'Internal server error.')
})

server.listen(3000, () => console.log('Listening on port 3000!'))

// set up our socket control center (MUST COME AFTER LISTEN)
const io = socketio(server)
io.on('connection', socket => {
  console.log(`A socket connection to the server has been made: ${socket.id}`)

  socket.on('disconnect', () => {
    console.log(`Connection ${socket.id} has left the building`)
  })
})

