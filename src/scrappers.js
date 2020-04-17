const scrapeIt = require('scrape-it')
const basePage = 'https://openwrt.org/toh'

async function scrapeRouterData (brand, model) {
  return scrapeIt(`${basePage}/hwdata/${brand}/${model}`, {
    name: 'h1',
    powerSupply: '.power_supply'
  }).then(({ data, response }) => {
    console.log(`Status Code: ${response.statusCode}`)
    return data
  })
}
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

module.exports = {
  scrapeRouterData,
  scrapeRouterList
}
