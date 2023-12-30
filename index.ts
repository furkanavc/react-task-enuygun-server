const express = require('express')
const { ApolloServer, gql } = require('apollo-server-express')
const { faker } = require('@faker-js/faker')

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
    votePerson: (_: undefined, { id }: { id: string }) => {
      data = data.map((d) => (d.id === id ? { ...d, voteCount: d.voteCount + 1 } : d))
      return data.find((d) => d.id === id)
    },
    unVotePerson: (_: undefined, { id }: { id: string }) => {
      data = data.map((d) => (d.id === id ? { ...d, voteCount: d.voteCount - 1 } : d))
      return data.find((d) => d.id === id)
    }
  }
}
const server = new ApolloServer({ typeDefs, resolvers })
const app = express()
server.start().then(() => {
  const port = 80
  server.applyMiddleware({ app })

  app.listen({ port }, () => {
    console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`)
  })
})

app.get('/', (req: any, res: any) => {
  res.end(`Server Ready! `)
})

module.exports = app
