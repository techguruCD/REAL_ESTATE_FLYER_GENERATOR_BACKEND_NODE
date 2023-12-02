require('dotenv').config()
const axios = require('axios')

const bannerbearClient = axios.create({
  baseURL: process.env.BANNERBEAR_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.BANNERBEAR_TOKEN}`
  }
})

exports.generate = (params) => {
  return new Promise((resolve, reject) => {
    bannerbearClient.post('/images', params)
      .then(({ data: {uid} }) => {
        const getImageURL_limit = (limit) => {
            return new Promise(resolve => {
                if (limit < 0) {
                    return resolve({})
                }
                bannerbearClient.get('/images/'+uid)
                .then(({data: {image_url}}) => {
                    if (!image_url) throw('not yet')
                    resolve({image_url})
                }).catch(err => {
                    console.log(err)
                    new Promise(resolve => {
                        setTimeout(resolve, 1000)
                    }).then(() => {
                        getImageURL_limit(limit - 1).then(resolve)
                    })
                })
            })
        }
        getImageURL_limit(30)
        .then(({image_url}) => {
            resolve({image_url})
        })
      }).catch(err => {
        console.log('error')
        console.log(err)
        reject(err)
      })
  })
}

exports.images = (params) => {
  return new Promise((resolve, reject) => {
    zillowClient.get('/images', { params })
      .then(({ data }) => {
        let images = []
        for (let i = 0; i < 4; i++)
          images.push(data.images[i % data.images.length])
        resolve({ images })
      }).catch(err => {
        console.log('error')
        console.log(err)
        reject(err)
      })
  })
}

exports.property = (params) => {
  return new Promise((resolve, reject) => {
    zillowClient.get('/property', { params })
      .then(({ data }) => {
        resolve({data})
      }).catch(err => {
        console.log('error')
        console.log(err)
        reject(err)
      })
  })
}