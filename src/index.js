import React from 'react';
import {createStore, applyMiddleware} from 'redux'
import {Router, browserHistory, createRoutes} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';
import {render} from 'react-dom';
import {Provider} from 'react-redux'
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import injectTapEventPlugin from 'react-tap-event-plugin';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import routes from './routes';
import reducer from './reducers';
import 'react-joyride/lib/react-joyride-compiled.css';
import {darkTheme} from './styles/theme';
import Api from 'lib/api';
import './lib/rollbar';
import './index.css';


const store = createStore(reducer, applyMiddleware(thunk.withExtraArgument(Api)));
const history = syncHistoryWithStore(browserHistory, store);

const mixDispatchToRoutes = (routes) => {
  return routes && routes.map(route => ({
      ...route,
      childRoutes: mixDispatchToRoutes(route.childRoutes),
      onEnter: route.onEnter && function (nextState, replace, next) {
        route.onEnter(store.dispatch, nextState, replace, next);
      }
    }));
};
const routesWithDispatch = mixDispatchToRoutes(createRoutes(routes));

injectTapEventPlugin();

class Application extends React.Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(darkTheme)}>
        <Router history={history} routes={routesWithDispatch}/>
      </MuiThemeProvider>
    )
  }
}

const renderApp = () => {
  render(
    <Provider store={store}>
      <Application/>
    </Provider>
    , document.getElementById('root'));
};

renderApp();
