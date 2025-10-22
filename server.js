const express = require('express')
require('./models')
const app = express()
app.use(express.json())
const PORT = 3500




app.use((error, req, res, next) => {
return res.status(error.status || 500).json(error.message || "An error occurred")
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})