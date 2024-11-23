import './App.css';
import { Outlet } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import Navbar from './components/Navbar';
import client from './apolloClient'; 

function App() {
  return (
    <ApolloProvider client={client}>
    <div>
      <Navbar />
      <Outlet />
    </div>
  </ApolloProvider>
);
}

export default App;
