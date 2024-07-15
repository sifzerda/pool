const typeDefs = `

  type User {
    _id: ID
    username: String
    email: String
    password: String
    poolScore: [PoolScore]
  }

    type PoolScore {
    poolPoints: Int
    poolTimeTaken: Int
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    user(userId: ID!): User
    users: [User]
    me: User
    getPoolScore(userId: ID!): [PoolScore]
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    updateUser(username: String, email: String, password: String): User
    login(email: String!, password: String!): Auth
    removeUser: User
    savePoolScore(userId: ID!, poolPoints: Int!, poolTimeTaken: Int!): User
  }
`;

module.exports = typeDefs;
