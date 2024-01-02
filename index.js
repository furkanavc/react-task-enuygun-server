const express = require('express')
const { ApolloServer, gql } = require('apollo-server-express')
const { faker } = require('@faker-js/faker')

let PersonList = Array(process.env.PERSON_COUNT ? Number(process.env.PERSON_COUNT) : 30)
  .fill(undefined)
  .map((_) => ({
    id: faker.string.uuid(),
    image: faker.image.url(),
    email: faker.internet.email(),
    fullName: faker.person.fullName(),
    jobTitle: faker.person.jobTitle(),
    voteCount: 0
  }))

const typeDefs = gql`
  type Person {
    id: ID!
    fullName: String
    email: String
    jobTitle: String
    voteCount: Int
    image: String
  }

  type Query {
    PersonAll: [Person]
    Person(id:ID!): Person
  }

  type Mutation {
    votePerson(id: ID!): Person
    unVotePerson(id: ID!): Person
  }
`

const resolvers = {
  Query: {
    PersonAll: () => PersonList,
    Person: (_, { id }) =>  PersonList.find((person) => person.id === id)
  },
  Mutation: {
    votePerson: (_, { id }) => {
      PersonList = PersonList.map((person) => (person.id === id ? { ...person, voteCount: person.voteCount + 1 } : person))
      return PersonList.find((person) => person.id === id)
    },
    unVotePerson: (_, { id }) => {
      PersonList = PersonList.map((person) => (person.id === id ? { ...person, voteCount: person.voteCount - 1 } : person))
      return PersonList.find((person) => person.id === id)
    }
  }
}
const server = new ApolloServer({ typeDefs, resolvers })

const app = express()
app.use(express.json())

const graphqlPort = process.env.GRAPHQL_PORT ?? 3001
server.start().then(() => {
  server.applyMiddleware({ app })

  app.listen({ port: graphqlPort }, () => {
    console.log(`🚀 Graphql Server ready at http://localhost:${graphqlPort}${server.graphqlPath}`)
  })
})

