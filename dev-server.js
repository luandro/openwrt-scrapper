const express = require('express')
const cors = require('cors')
const app = express()
const scrapeRouterList = require('./src/routerList')
app.use(cors())

app.get('/routers', async (req, res) => {
  const data = await scrapeRouterList()
  res.json(data)
})

app.get('/routers/:brand/:model', async (req, res, next) => {})

app.listen(3000)
