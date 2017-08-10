import component from './_components';
import indexRoute from './people';
import profile from './profile';
import recommendation from './recommendation';
import requests from './requests';
import schedule from './schedule';
import Api from 'lib/api';

import {fetchEvents} from 'actions/event';


const onEnter = (dispatch, nextState, replace, cb) => {
  Api
    .getProfile()
    .then((profile) => {
      // @TODO improve!
      //if (window.USE_RECOMMENDATION_SERVICE) {
      //  if ((!profile.onboardingStep || profile.onboardingStep === 'profile')) {
      //    replace('/event-onboarding/profile')
      //  } else if ((profile.onboardingStep === 'questions')) {
      //    replace('/event-onboarding/questions')
      //  }
      //}

      dispatch(fetchEvents());

      cb();
    }, () => {
      replace('/error');
      cb();
    });
};

export default {
  path: '/',
  component,
  onEnter,
  indexRoute,
  childRoutes: [
    recommendation,
    profile,
    requests,
    schedule,
  ],
};
