import React, {useEffect, createContext, useReducer} from 'react';
import { Route, useHistory } from 'react-router-dom'
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer'
import Home from './components/screens/Home'
import Signup from './components/screens/Signup';
import Login from './components/screens/Login';
import Profile from './components/screens/Profile';
import UserProfile from './components/screens/UserProfile';
import CreatePost from './components/screens/CreatePost';
import SubscribedUserPosts from './components/screens/SubscribedUserPosts'
import {reducer, initialState} from './reducers/userReducer'

import Container from '@material-ui/core/Container';
import { ThemeProvider, makeStyles, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#111111',
    },
    secondary: {
      main: '#666666',
    },
  },
});

export const UserContext = createContext()

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const history = useHistory()

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) {
      dispatch({ type: 'USER', payload: user })
      history.push('/')
    }else {
      if(!history.location.pathname.startsWith('/reset')) {
        history.push('/login')
      }
    }
  }, [])

  return (
    <>
    <ThemeProvider theme={theme}>
      <UserContext.Provider value={{state, dispatch}}>
        <Container maxWidth='md' style={{ margin: '2rem auto'}}> 
          <Navbar/>
          <Route exact path='/'>
            <Home />
          </Route>
          <Route path='/signup'>
            <Signup />
          </Route>
          <Route path='/login'>
            <Login />
          </Route>
          <Route exact path='/profile'>
            <Profile />
          </Route>
          <Route path='/profile/:userid'>
            <UserProfile/>
          </Route>
          <Route path='/create'>
            <CreatePost />
          </Route>
          <Route path="/myfollowingpost">
            <SubscribedUserPosts />
          </Route>
        <Footer />
        </Container >
      </UserContext.Provider>
      </ThemeProvider>
    </>
  )
}

export default App;
