import component from './_components';
import profile from './profile';
import questions from './questions';
import Api from 'lib/api';

const onEnter = (dispatch, nextState, replace, cb) => {
  Api
    .getProfile()
    .then((profile) => {
      // @TODO improve!
      if ((profile.onboardingStep === 'complete')) {
        replace('/');
      }

      cb();
    });
};

export default {
  path: '/event-onboarding',
  component,
  onEnter,
  childRoutes: [
    profile,
    questions,
  ],
};
