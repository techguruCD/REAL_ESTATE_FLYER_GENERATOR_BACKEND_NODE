require('dotenv').config()
const axios = require('axios')

const imgurClient = axios.create({
  baseURL: process.env.IMGUR_URL,
  headers: {
    Authorization: 'Bearer ' + process.env.IMGUR_TOKEN,
    'Content-Type': 'multipart/form-data',
    'Accept': '*/*',
  }
})
exports.imgurClient = imgurClient

exports.upload = (image) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData()
    const blog = new Blob([image.data], { type: image.mimetype })
    formData.append('image', blog, image.name)
    imgurClient.post('/upload', formData)
      .then(({ data: { data: { link }, success, id } }) => {
        if (!success) throw ('Uploading Failed')
        resolve({ link, success, id })
      }).catch(err => {
        console.log(err)
        resolve(null)
      })
  })
}
