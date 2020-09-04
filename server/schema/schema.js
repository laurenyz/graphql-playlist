const graphql = require('graphql')
const _ = require('lodash') //has efficient find functions?
const Book = require('../models/book')
const Author = require('../models/author')

const { 
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLSchema, 
    GraphQLID, 
    GraphQLInt, 
    GraphQLList,
    GraphQLNonNull //can make sure it doesn't accept null values
 } = graphql

const BookType = new GraphQLObjectType({
    name: "Book",
    fields: () => ({
        id: {type:GraphQLID},
        name: {type:GraphQLString},
        genre: {type: GraphQLString},
        author: {
            type: AuthorType,
            resolve(parent, args){
                console.log(parent)
                //return _.find(authors, {id: parent.authorId}) //used lodash with local variable 
                return Author.findById(parent.authorId)
            }
        }
    })
})

const AuthorType = new GraphQLObjectType({
    name: "Author",
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
                //return _.filter(books, {authorId: parent.id})
                return Book.find({authorId: parent.id}) //will find all where this is true
            }
        }
    })
})

const RootQuery = new GraphQLObjectType({ //note: need double quotes "" in query argument on frontend, ex: book(id:"1")
    name:"RootQueryType",
    fields: {
        book: {
            type: BookType,
            args: {id: {type:GraphQLID}},
            resolve(parent, args){ //code to get data from db/other source
                //return _.find(books, {id: args.id})
                return Book.findById(args.id)
            }
        },
        author: {
            type: AuthorType,
            args: {id: {type:GraphQLID}},
            resolve(parent, args){ //code to get data from db/other source
                //return _.find(authors, {id: args.id}) //reading from above authors array
                return Author.findById(args.id)
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
                //return books
                return Book.find() // returns all books
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args){
                //return authors
                return Author.find() //returns all authors
            }
        }
    }
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields:{
        addAuthor: {
            type: AuthorType,
            args:{
                name: {type: new GraphQLNonNull(GraphQLString)}, //saying the name field is required
                age: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args){
                let author = new Author({
                    name: args.name,
                    age: args.age
                })
                console.log(author)
                return author.save()
            }
        },
        addBook: {
            type: BookType,
            args:{
                name: {type: new GraphQLNonNull(GraphQLString)},
                genre: {type: new GraphQLNonNull(GraphQLString)},
                authorId: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                })
                return book.save() //to get something back after saved, need to return
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})