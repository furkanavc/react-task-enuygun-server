var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var express = require('express');
var _a = require('apollo-server-express'), ApolloServer = _a.ApolloServer, gql = _a.gql;
var faker = require('@faker-js/faker').faker;
var typeDefs = gql(__makeTemplateObject(["\n  type Person {\n    id: ID!\n    fullName: String\n    email: String\n    voteCount: Int\n    image: String\n  }\n\n  type Query {\n    PersonAll: [Person]\n  }\n\n  type Mutation {\n    votePerson(id: ID!): Person\n    unVotePerson(id: ID!): Person\n  }\n"], ["\n  type Person {\n    id: ID!\n    fullName: String\n    email: String\n    voteCount: Int\n    image: String\n  }\n\n  type Query {\n    PersonAll: [Person]\n  }\n\n  type Mutation {\n    votePerson(id: ID!): Person\n    unVotePerson(id: ID!): Person\n  }\n"]));
var data = Array(30)
    .fill(undefined)
    .map(function (_) { return ({
    id: faker.string.uuid(),
    image: faker.image.url(),
    email: faker.internet.email(),
    fullName: faker.person.fullName(),
    voteCount: 0
}); });
var resolvers = {
    Query: {
        PersonAll: function () { return data; }
    },
    Mutation: {
        votePerson: function (_, _a) {
            var id = _a.id;
            data = data.map(function (d) { return (d.id === id ? __assign(__assign({}, d), { voteCount: d.voteCount + 1 }) : d); });
            return data.find(function (d) { return d.id === id; });
        },
        unVotePerson: function (_, _a) {
            var id = _a.id;
            data = data.map(function (d) { return (d.id === id ? __assign(__assign({}, d), { voteCount: d.voteCount - 1 }) : d); });
            return data.find(function (d) { return d.id === id; });
        }
    }
};
var server = new ApolloServer({ typeDefs: typeDefs, resolvers: resolvers });
var app = express();
server.start().then(function (res) {
    var port = 80;
    server.applyMiddleware({ app: app });
    app.listen({ port: port }, function () {
        console.log("\uD83D\uDE80 Server ready at http://localhost:".concat(port).concat(server.graphqlPath));
    });
});
app.get('/', function (req, res) {
    res.end("Server Ready! ");
});
module.exports = app;
