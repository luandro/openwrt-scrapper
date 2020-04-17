const { scrapeRouterData } = require('../../src/scrappers')

module.exports = async (req, res) => {
  const data = await scrapeRouterList()
  res.json(data)
}
