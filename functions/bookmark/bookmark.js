const { ApolloServer, gql } = require('apollo-server-lambda')
var faunadb = require("faunadb")
q = faunadb.query;

require("dotenv").config();

const typeDefs = gql`
  type Query {
    hello: String
    bookmarks: [Bookmark!]
  }
  type Mutation{
    addBookmark(title: String!, url: String!, description: String!) : Bookmark
  }
  type Bookmark {
    title: String!
    url: String!
    description: String!
  }
`

// const authors = [
//   { id: 1, name: 'Terry Pratchett', married: false },
//   { id: 2, name: 'Stephen King', married: true },
//   { id: 3, name: 'JK Rowling', married: false },
// ]

const resolvers = {
  Query: {
    hello: () => 'Hello, world!',
    bookmarks: async () => {
      try {
        var client = new faunadb.Client({ secret: process.env.SERVER_SECRET })
        const result = await client.query(
          q.Map(
            q.Paginate(q.Match(q.Index('Bookmarks'))),
            q.Lambda(x => q.Get(x))
          ),
        )
        console.log('Result in bookmark resolver >>>>>>>>>>>>>.:', result)
        return result.data.map(d => {
          return {
            title: d.data.title,
            url: d.data.url,
            description: d.data.description
          }
        })
      }
      catch (err) {
        console.log("Error in bookmarks resolver>>>>>>>>>>: ", err)
      }
    },
  },
  Mutation: {
    addBookmark: async (_, { title, url, description }) => {

      // console.log("Title in addBookmark >>>>>>>>>>>>>>>:", title )
      // console.log("Description in addBookmark >>>>>>>>>>>>>>>:", description )
      // console.log("URL in addBookmark >>>>>>>>>>>>>>>:", url )
      try {
        var client = new faunadb.Client({ secret: process.env.SERVER_SECRET })
        var result = await client.query(
          q.Create(
            q.Collection("Bookmarks"),
            {
              data: {
                title,
                url,
                description
              }
            }
          ),
        )
        console.log('Result.data in bookmark resolver >>>>>>>>>>>>>.:', result)
        return result.data

        // return result.data.map(d => {
        //   return {
        //     title: d.data.title,
        //     url: d.data.url,
        //     description: d.data.description
        //   }
        // })
      }
      catch (err) {
        console.log("Error in bookmarks Mutation: ", err)
      }
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const handler = server.createHandler()

module.exports = { handler }
