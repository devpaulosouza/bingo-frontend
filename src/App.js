import logo from './logo.svg';
import './App.css';
import Login from './pages/login/Login';


import 'bootstrap/dist/css/bootstrap.min.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Game from './pages/game/Game';
import Winner from './pages/winner/Winner';
import Admin from './pages/admin/Admin';
import Watch from './pages/watch/Watch';
import Test from './pages/test/Test';
import Vote from './pages/vote/Vote';
import VoteAdmin from './pages/voteAdmin/VoteAdmin';

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
  },
  {
    path: '/admin',
    element: <Admin />
  }, 
  {
    path: '/watch',
    element: <Watch />
  }, 
  {
    path: '/test',
    element: <Test />
  }, 
  {
    path: '/vote',
    element: <Vote />
  }, 
  {
    path: '/admin/vote',
    element: <VoteAdmin />
  }
])


function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
