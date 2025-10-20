const express = require('express')
require('./models')
const app = express()
app.use(express.json())
const PORT = 3500

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
