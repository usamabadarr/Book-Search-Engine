import { gql } from "@apollo/client"

export const LOGIN_USER = gql`
    mutation Login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        token
        user {
          _id
          email
          username
        }
      }
    }
`

export const ADD_USER = gql`
    mutation AddUser($username: String!, $password: String!, $email: String!) {
      addUser(username: $username, password: $password, email: $email) {
        token
        user {
          _id
          email
          username
        }
      }
    }
`

export const ADD_BOOK = gql`
    mutation SaveBook($book: BookInput) {
      saveBook(book: $book) {
        _id
        email
        bookCount
        savedBooks {
          authors
          bookId
          description
          image
          link
          title
        }
        username
      }
    }
`

export const REMOVE_BOOK = gql`
    mutation DeleteBook($bookId: String!) {
      deleteBook(bookId: $bookId) {
        _id
        bookCount
        email
        savedBooks {
          authors
          bookId
          description
          image
          link
          title
        }
        username
      }
    }
`