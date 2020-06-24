const express = require('express')

const app = express()
const routes = require('./routes/index.routes')

const port = process.env.PORT || 8040

app.use(express.json())
app.use(routes)

app.listen(port, () => {
  console.log(`Server is running at localhost: ${port}`)
})
