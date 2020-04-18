const scrapeIt = require('scrape-it')
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
    const filtered = data.routers.filter(i => i.page.length > 0)
    return filtered.map(i => {
      i.routerPath = i.techData
        .split('/toh/hwdata/')[1]
        .split('/')
        .join('~')

      return i
    })
  })
}

async function scrapeRouterData (router) {
  return scrapeIt(`${basePage}/hwdata/${router}}`, {
    name: 'h1',
    powerSupply: '.power_supply'
  }).then(({ data, response }) => {
    console.log(`Status Code: ${response.statusCode}`)
    return data
  })
}

module.exports = {
  scrapeRouterData,
  scrapeRouterList
}
