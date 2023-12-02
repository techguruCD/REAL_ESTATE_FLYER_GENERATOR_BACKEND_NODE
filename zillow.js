require('dotenv').config()
const axios = require('axios')

const zillowClient = axios.create({
  baseURL: process.env.RAPID_API_URL,
  headers: {
    'X-RapidAPI-Key': process.env.RAPID_API_KEY,
    'X-RapidAPI-Host': process.env.RAPID_API_HOST
  }
})

exports.propertyExtendedSearch = (params) => {
  return new Promise((resolve, reject) => {
    zillowClient.get('/propertyExtendedSearch', { params })
      .then(({ data }) => {
        let zpids = []
        if (Object.prototype.toString.call(data) === '[object Object]') {
          if (data.status) {
            // throw (data.status)
          } else if (data.zpid) {
            zpids.push(data.zpid)
          } else if (data.props) {
            zpids = data.props.map(item => item.zpid)
          }
        } else if (Object.prototype.toString.call(data) === '[object Array]') {
          zpids = data.filter(item => item.zpid).map(item => item.zpid)
        }
        resolve({ zpid: zpids[0] })
      }).catch(err => {
        console.log('error')
        console.log(err)
        if (err?.response?.status == 429) {
          reject({message: 'Too Many Request for zillow API. Please update to Pro. Please try again later.'})
        }
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