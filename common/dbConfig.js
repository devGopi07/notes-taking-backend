require('dotenv').config()

dbUrl=`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.b7gjyld.mongodb.net/${process.env.DB_NAME}`  
// dbUrl=`mongodb+srv://Gopinath:Gopinath@cluster0.b7gjyld.mongodb.net/crm`

module.exports={dbUrl}