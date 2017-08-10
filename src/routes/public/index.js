import auth from 'lib/auth';
import {fetchEventSettings} from 'actions/event';

const path = '/stormpath-cb';

const onEnter = (dispatch, nextState, replace, next) => {
  const jwt = nextState.location.query.jwtResponse;
  auth.logIn(jwt)
    .then((loggedIn) => {
      if (loggedIn) {
        dispatch(fetchEventSettings());
        replace(auth.redirectLocation() || '/');
        next();
      } else {
        auth.redirect('/');
      }
    });
};

export default {
  path,
  onEnter,
};
