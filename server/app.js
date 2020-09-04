const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const schema = require('./schema/schema')
const mongoose = require('mongoose')

const app = express()

mongoose
 .connect( //enter password 
  "mongodb+srv://ninja:test123@gql-ninja.rfinr.mongodb.net/graphql-ninja?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
 )
 .then(() => console.log("Connected to MongoDB Atlas"))
 .catch(err => console.log("Error: ", err.message));

app.use('/graphql', graphqlHTTP({
    schema, //same as schema: schema
    graphiql: true //add so can test in browser
}))

app.listen(4000,()=>{
    console.log('now listening for requests on port 4000')
})