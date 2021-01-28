import React, { FC } from 'react'
import { Switch, Route } from 'react-router-dom'

import App from './App'
import Main from './pages/Main'

const Routes: FC = () => {
  return (
    <Route>
      <App>
        <Switch>
          <Route path="/">
            <Main />
          </Route>
        </Switch>
      </App>
    </Route>
  )
}

export default Routes
