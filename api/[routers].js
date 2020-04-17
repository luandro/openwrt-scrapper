const { scrapeRouterData } = require('../../src/scrappers')

module.exports = async (req, res) => {
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
}
