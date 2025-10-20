const express = require('express')
const sequelize = require('./database/database')
const PORT = 3500
const app = express()
app.use(express.json())


const database = async () => {
    try{
        await sequelize.authenticate();
        console.log(`Connection has been established successfully.`);
    } catch (error){
        console.error(`Unable to connect to the database:`, error);
    }
}
 database();

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`)
})
