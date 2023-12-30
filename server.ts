const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { faker } = require('@faker-js/faker')
const { Person } = require('../types/Person')

const typeDefs = `
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
  votePerson (id: ID!): Person
  unVotePerson (id: ID!): Person
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

class GraphqlServer {
  private static server: unknown | undefined = undefined
  private static url: string | undefined = undefined

  constructor() {
    if (!GraphqlServer.server) {
      GraphqlServer.server = new ApolloServer({ typeDefs, resolvers })
    }
  }

  async start(port = 3001) {
    if (GraphqlServer.server && !GraphqlServer.url) {
      const { url } = await startStandaloneServer(GraphqlServer.server, { listen: { port } })
      GraphqlServer.url = url
      console.log(`Graphql Server ready at: ${url}`)
    }
  }

  public get server() {
    return GraphqlServer.server
  }

  public get url() {
    return GraphqlServer.url
  }
}

export const graphqlServer = new GraphqlServer()
graphqlServer.start()
