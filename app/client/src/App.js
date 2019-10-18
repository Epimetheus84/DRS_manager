import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom"
import Home from './components/Home.js'
import Settings from './components/Settings.js'
import './App.css'

class App extends React.Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route path="/settings">
                        <Settings />
                    </Route>
                    <Route path="/">
                        <Home />
                    </Route>
                </Switch>
            </Router>
        )
    }
}

export default App;
