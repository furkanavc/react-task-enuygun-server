const express = require('express')
const test = require('./routes/test')
const { ApolloServer, gql } = require('apollo-server-express')
const { faker } = require('@faker-js/faker')

const app = express()

const typeDefs = gql`
  type Person {
    id: ID!
    fullName: String
    email: String
    voteCount: Int
    image: String
  }

  type Query {
    PersonAll: [Person]
  }

  type Mutation {
    votePerson(id: ID!): Person
    unVotePerson(id: ID!): Person
  }
`

let data = Array(30)
  .fill(undefined)
  .map((_) => ({
    id: faker.string.uuid(),
    image: faker.image.url(),
    email: faker.internet.email(),
    fullName: faker.person.fullName(),
    voteCount: 0
  }))

const resolvers = {
  Query: {
    PersonAll: () => data
  },
  Mutation: {
    votePerson: (_, { id }) => {
      data = data.map((d) => (d.id === id ? { ...d, voteCount: d.voteCount + 1 } : d))
      return data.find((d) => d.id === id)
    },
    unVotePerson: (_, { id }) => {
      data = data.map((d) => (d.id === id ? { ...d, voteCount: d.voteCount - 1 } : d))
      return data.find((d) => d.id === id)
    }
  }
}
const server = new ApolloServer({ typeDefs, resolvers })

app.use(express.json())
app.use('/test', test)

const graphqlPort = process.env.GRAPHQL_PORT ?? 3001
server.start().then(() => {
  server.applyMiddleware({ app })

  app.listen({ port: graphqlPort }, () => {
    console.log(`🚀 Graphql Server ready at http://localhost:${graphqlPort}${server.graphqlPath}`)
  })
})

