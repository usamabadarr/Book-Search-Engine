const typeDefs = `
type User {
_id: ID
username: String!
email: String!
bookCount: Int
savedBooks: [Book]
}

type Book {
bookId: String!
authors: [String]
description: String!
image: String
link: String
title: String!
}

input BookInput {
bookId: String!
authors: [String]
description: String!
image: String
link: String
title: String!
}

type Auth {
    token: String
    user: User
}

type Query {
    me: User
}

type Mutation {
    addUser(username: String!, password: String!, email: String!): Auth
    login(email: String!, password: String!): Auth
    saveBook(book: BookInput): User
    deleteBook(bookId: String!): User

}

`

export default typeDefs