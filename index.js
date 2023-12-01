require('dotenv').config()
const http = require('http')
const express = require('express')
const fileUpload = require('express-fileupload')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')

const app = express()
const httpServer = http.createServer(app)

app.use(fileUpload())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

app.use('/', require('./routes'))

// Handle joi errors
app.use((err, req, res, next) => {
  if (err && err.error && err.error.isJoi) {
    res.status(400).send({
      error: err.error,
      message: err.error.toString()
    });
  } else {
    // pass on to another error handler
    next(err);
  }
})

const PORT = process.env.PORT || 5000
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`))