require('dotenv')
const axios = require('axios')
const zillow = require('../zillow')
const imgur = require('../imgur')
const bannerbear = require('../bannerbear')

const generate = (data, info, images) => {
  return new Promise((resolve, reject) => {

    let details = []
    if (data.bedrooms)
      details.push(`${data.bedrooms} Bedrooms`)
    if (data.bathrooms)
      details.push(`${data.bathrooms} Bathrooms`)
    if (data.livingArea)
      details.push(`${data.livingArea} ${data.livingAreaUnits} Living Area`)
    let roomTypes = []
    try {
      roomTypes = (data.resoFacts?.rooms || []).filter(room => room.roomType).map(room => room.roomType)
    } catch (err) {
      console.log(err)
    }
    if (roomTypes.length)
      details.push(roomTypes.reduce((str, roomType, index) => str + (index ? ', ' : ' ') + roomType, ''))
    const payloads = []
    payloads.push({
      "template": process.env.TEMPLATE_1,
      "modifications": [
        {
          "name": "imgmain_1236_630",
          "image_url": images[0]
        },
        {
          "name": "imgsub1_293_321",
          "image_url": images[1]
        },
        {
          "name": "imgsub2_293_252",
          "image_url": images[2]
        },
        {
          "name": "title",
          "text": info.plan
        },
        {
          "name": "details",
          "text": details.reduce((str, detail, index) => str + (index ? '\n' : '') + detail, '')
        },
        {
          "name": "price",
          "text": '$' + data.price
        },
        {
          "name": "address",
          "text": data.address || `${data.streetAddress}\n${data.city}, ${data.state} ${data.zipcode}`,
        },
        {
          "name": "contact_info",
          "text": `${info.phoneNumber}\n${info.email}`
        }
      ],
      "webhook_url": null,
      "metadata": null
    })
    payloads.push({
      "template": process.env.TEMPLATE_2,
      "modifications": [
        {
          "name": "imgmain_548_556",
          "image_url": images[0]
        },
        {
          "name": "imgsub1_358_277",
          "image_url": images[1]
        },
        {
          "name": "imgsub2_381_277",
          "image_url": images[2]
        },
        {
          "name": "imgsub3_358_277",
          "image_url": images[3]
        },
        {
          "name": "price",
          "text": '$' + data.price
        },
        {
          "name": "address",
          "text": data.address || `${data.streetAddress}\n${data.city}, ${data.state} ${data.zipcode}`,
        },
        {
          "name": "about",
          "text": data.description
        },
        {
          "name": "feature_1",
          "text": details[0]
        },
        {
          "name": "feature_2",
          "text": details[1]
        },
        {
          "name": "feature_3",
          "text": details[2]
        },
        {
          "name": "contact_info",
          "text": info.phoneNumber
        },
        {
          "name": "email",
          "text": info.email
        },
        {
          "name": "url",
          "text": info.website
        }
      ],
      "webhook_url": null,
      "metadata": null
    })
    payloads.push({
      "template": process.env.TEMPLATE_3,
      "modifications": [
        {
          "name": "imgmain_539_582",
          "image_url": images[0]
        },
        {
          "name": "imgsub1_356_363",
          "image_url": images[1]
        },
        {
          "name": "imgsub2_390_363",
          "image_url": images[2]
        },
        {
          "name": "imgsub3_356_363",
          "image_url": images[3]
        },
        {
          "name": "title",
          "text": info.plan
        },
        {
          "name": "price",
          "text": 'OFFER AT $' + data.price
        },
        {
          "name": "details",
          "text": details.reduce((str, detail, index) => str + (index ? '\n' : '') + detail, '')
        },
        {
          "name": "profile_img",
          "hide": true,
          "image_url": data.priceHistory?.[0]?.buyerAgent?.photo?.url
        },
        {
          "name": "profile_img_name",
          "text": info.name
        },
        {
          "name": "contact_info",
          "text": info.phoneNumber,
        },
        {
          "name": "email",
          "text": info.email
        }
      ],
      "webhook_url": null,
      "metadata": null
    })
    payloads.push({
      "template": process.env.TEMPLATE_4,
      "modifications": [
        {
          "name": "imgmain_1131_574",
          "image_url": images[0]
        },
        {
          "name": "imgsub1_337_344",
          "image_url": images[1]
        },
        {
          "name": "imgsub2_473_439",
          "image_url": images[2]
        },
        {
          "name": "imgsub3_337_344",
          "image_url": images[3]
        },
        {
          "name": "title-1",
          "text": info.plan
        },
        {
          "name": "details",
          "text": data.description
        },
        {
          "name": "contact_info",
          "text": info.phoneNumber,
        },
        {
          "name": "email",
          "text": info.email
        },
        {
          "name": "url",
          "text": info.website
        }
      ],
      "webhook_url": null,
      "metadata": null
    })
    payloads.push({
      "template": process.env.TEMPLATE_5,
      "modifications": [
        {
          "name": "imgmain_650_933",
          "image_url": images[0]
        },
        {
          "name": "title",
          "text": info.plan
        },
        {
          "name": "details",
          "text": data.description
        },
        {
          "name": "price",
          "text": "$ " + data.price
        },
        {
          "name": "features",
          "text": details.reduce((str, detail, index) => str + (index ? '\n' : '') + detail, '')
        },
        {
          "name": "contact_info",
          "text": info.phoneNumber,
        },
        {
          "name": "url",
          "text": info.website
        }
      ],
      "webhook_url": null,
      "metadata": null
    })
    Promise.all(payloads.map(bannerbear.generate))
      .then(results => {
        resolve(results.map(result => result.image_url))
      }).catch(err => {
        reject(err)
      })
  })
}
exports.listed = (req, res) => {
  const info = req.body;
  zillow.propertyExtendedSearch({ location: info.propertyAddress, status_type: 'ForSale', home_type: 'Houses', page: 1 })
    .then(({ zpid }) => {
      if (!zpid) throw ({ message: 'No data found' })
      Promise.all([
        zillow.images({ zpid }),
        zillow.property({ zpid })
      ]).then(([{ images }, { data }]) => {
        if (!images.length) throw ({ message: 'No images found' })
        if (!data) throw ({ message: 'No data found' })
        generate(data, info, images)
          .then(results => {
            res.json({image_urls: results, message:'Generated Successfully.'})
          }).catch(err => {
            console.log('' + err)
            let message = err?.message || 'Please try again later'
            res.status(400).json({ message })
          })
      }).catch(err => {
        console.log('' + err)
        let message = err?.message || 'Please try again later'
        res.status(400).json({ message })
      })
    }).catch(err => {
      console.log('' + err)
      let message = err?.message || 'Please try again later'
      res.status(400).json({ message })
    })
}

exports.notListed = (req, res) => {
  let images = []
  if (req.files?.images) {
    if (Array.isArray(req.files.images)) images = req.files.images
    else images = [req.files.image]
  }
  if (!images.length) {
    return res.status(400).send({ message: 'Please select image' })
  }
  console.log('uploading images')
  Promise.all(images.map(image => imgur.upload(image)))
    .then(result => {
      console.log('uploaded result')
      const images = [];
      for (let i = 0; i < 4; i++) {
        images.push(result[i % result.length].link)
      }
      generate({
        address: req.body.propertyAddress,
        bedrooms: req.body.bedroom,
        bathrooms: req.body.bathroom,
        livingArea: req.body.squareFeet,
        livingAreaUnits: 'sqft',
        description: req.body.description || ' ',
      }, req.body, images).then(result => {
        res.json({image_urls: result, message:'Generated Successfully.'})
      }).catch(err => {
        console.log(err)
        return res.status(400).send({ message: 'Please try again later' })
      })
    }).catch(err => {
      console.log(err)
      return res.status(400).send({ message: 'Please try again later' })
    })
}