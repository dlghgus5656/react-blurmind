import React from 'react';

//import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Mainpage from './components/views/Mainpage/Mainpage'
import Loginpage from './components/views/Loginpage/Loginpage';
import Registerpage from './components/views/Registerpage/Registerpage';

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={Mainpage} />
           
          <Route exact path="/login" component={Loginpage} />
            
          <Route exact path="/register" component={Registerpage} />
           
        </Switch>
      </div>
    </Router>
  );
}

export default App;

