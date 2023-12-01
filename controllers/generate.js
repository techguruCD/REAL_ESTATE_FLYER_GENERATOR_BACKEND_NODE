require('dotenv')
const zillow = require('../zillow')
const bannerbear = require('../bannerbear')
exports.generate = (req, res) => {
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
        } catch(err) {
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
              "name": "details",
              "text": details.reduce((str, detail, index) => str + (index ? '\n' : '') + detail, '')
            },
            {
              "name": "price",
              "text": '$' + data.price
            },
            {
              "name": "address",
              "text": `${data.streetAddress}\n${data.city}, ${data.state} ${data.zipcode}`,
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
              "text": `${data.streetAddress}\n${data.city}, ${data.state} ${data.zipcode}`,
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
          res.json(results)
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