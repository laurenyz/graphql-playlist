const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const schema = require('./schema/schema')

const app = express()

app.use('/graphql', graphqlHTTP({
    schema, //same as schema: schema
    graphiql: true //add so can test in browser
}))

app.listen(4000,()=>{
    console.log('now listening for requests on port 4000')
})