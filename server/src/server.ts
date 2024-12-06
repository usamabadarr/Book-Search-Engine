import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import path from 'node:path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import db from './config/connection.js';
import routes from './routes/index.js';
import typeDefs from './schemas/typeDefs';
import resolvers from './schemas/resolvers';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse incoming requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// If we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Initialize Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // Extract the token from the authorization header
    const token = req.headers.authorization?.split(' ')[1]; // Assuming "Bearer <token>"
    
    if (!token) return { user: null }; // No token, no user

    try {
      // Verify and decode the JWT token
      const user = jwt.verify(token, process.env.JWT_SECRET_KEY!) as { _id: string; username: string; email: string };
      return { user }; // Pass user info into the context
    } catch (error) {
      console.error('Invalid or expired token:', error);
      return { user: null }; // Invalid token, return null for user
    }
  },
});

// Start the Apollo Server
const startApolloServer = async () => {
  await server.start();

  // Apply Apollo middleware to the Express app
  app.use('/graphql', expressMiddleware(server));

  // Add your REST routes after the Apollo middleware
  app.use(routes);

  // Start the database and server
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 Server is running on http://localhost:${PORT}/graphql`);
    });
  });
};

startApolloServer().catch((error) => {
  console.error('Error starting Apollo Server:', error);
});

