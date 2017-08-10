import component from './_components';
import eventRoute from 'routes/auth/event';
import eventOnboardingRoute from 'routes/auth/event-onboarding';
import Auth from 'lib/auth';
import {fetchEventSettings} from 'actions/event'


const onEnter = (dispatch, nextState, replace, next) => {
  Auth
    .loggedIn()
    .then((loggedIn) => {
      if (!loggedIn) {
        return Auth.redirect();
      } else {
        dispatch(fetchEventSettings());
        next();
      }
    });
};

export default {
  component,
  onEnter,
  childRoutes: [
    eventRoute,
    eventOnboardingRoute,
  ]
};
