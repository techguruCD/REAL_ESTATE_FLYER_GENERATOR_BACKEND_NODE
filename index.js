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

const PORT = process.env.PORT || 5000
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`))