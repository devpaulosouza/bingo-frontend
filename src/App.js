import logo from './logo.svg';
import './App.css';
import Login from './pages/login/Login';


import 'bootstrap/dist/css/bootstrap.min.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Game from './pages/game/Game';
import Winner from './pages/winner/Winner';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />
  },
  {
    path: '/game',
    element: <Game />
  },
  {
    path: '/winner',
    element: <Winner />
  }
])


function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
