import express from 'express';
import db from './config/connection.js';
import { ApolloServer } from '@apollo/server';
import { typeDefs, resolvers } from './schemas/index.js'
import { expressMiddleware } from '@apollo/server/express4';
import { authenticateToken } from './services/auth.js';

const server = new ApolloServer({
  resolvers,
  typeDefs
})

const apolloServerStart = async () => {

  await server.start()
  await db()
  
  const app = express();
  const PORT = process.env.PORT || 3001;
  
  
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  
  app.use('/graphql', expressMiddleware(server as any,
    {
      context: authenticateToken as any
    }
  ))
  
    app.use(express.static('../client/dist'));
  
    app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
  ;
}

apolloServerStart()
