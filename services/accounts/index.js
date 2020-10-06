const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`
  extend type Query {
    me: User
  }

  type User @key(fields: "id") {
    id: ID!
    name: String
    username: String
    tasks: [Task]
  }

  interface Task @key(fields: "id"){
    id: ID!
    accountsField: String!
  }

  type TestSectionTask implements Task @key(fields: "id") {
      id: ID!
      accountsField: String!
  }
`;

const resolvers = {
  Query: {
    me() {
      return users[0];
    }
  },
  User: {
    __resolveReference(object) {
      return users.find(user => user.id === object.id);
    },
    tasks(user) {
        return tasks
    }
  },
  Task: {
    __resolveReference(object) {
        return tasks[0]
    }
  },
  TestSectionTask: {
    __resolveReference(object) {
        return tasks[0]
    }
  }
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers
    }
  ])
});

server.listen({ port: 4001 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

const users = [
  {
    id: "1",
    name: "Ada Lovelace",
    birthDate: "1815-12-10",
    username: "@ada"
  },
  {
    id: "2",
    name: "Alan Turing",
    birthDate: "1912-06-23",
    username: "@complete"
  }
];

const tasks = [{id: "1234", __typename: "TestSectionTask", accountsField: "accounts"}]
