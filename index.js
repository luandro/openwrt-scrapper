const express = require('express')
const cors = require('cors')
const scrapeIt = require('scrape-it')

const app = express()

app.use(cors())
const basePage = 'https://openwrt.org/toh'

async function scrapeRouterList () {
  return scrapeIt(`${basePage}/start`, {
    routers: {
      listItem: 'tr',
      name: 'routers',
      data: {
        brand: '.brand',
        model: '.model',
        page: {
          selector: '.device_page a',
          attr: 'href'
        },
        techData: {
          selector: '.device_techdata a',
          attr: 'href'
        }
      }
    }
  }).then(({ data, response }) => {
    console.log(`Status Code: ${response.statusCode}`)
    return data.routers.filter(i => i.page.length > 0)
  })
}

async function scrapeRouterData (brand, model) {
  return scrapeIt(`${basePage}/hwdata/${brand}/${model}`, {
    name: 'h1',
    powerSupply: '.power_supply'
  }).then(({ data, response }) => {
    console.log(`Status Code: ${response.statusCode}`)
    return data
  })
}

app.get('/routers', async (req, res) => {
  const data = await scrapeRouterList()
  res.json(data)
})

app.get('/routers/:brand/:model', async (req, res, next) => {
  let { brand, model } = req.params
  brand = brand.toLowerCase()
  model = model.toLowerCase()
  let data = await scrapeRouterData(brand, model)
  data.name = data.name.split(':')[1].replace(/\s/g, '')
  const powSup = data.powerSupply.split(':')[1].split(',')
  data.powerSupply = {}
  data.powerSupply.voltage = parseFloat(
    powSup[0].split('VDC')[0].replace(/\s/g, '')
  )
  data.powerSupply.amps = parseFloat(powSup[1].split('A')[0].replace(/\s/g, ''))
  res.json(data)
})

app.listen(3000)
