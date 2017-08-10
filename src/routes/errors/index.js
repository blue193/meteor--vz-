import React from 'react';

const component = ({ children }) => (
  <div>{children}</div>
);

const notFoundRoute = {
  path: '*',
  component: () => (
    <div style={{padding: '100px 15px', textAlign:'center'}}>
      <img role="presentation" src="img/css.jpg" />
      <p>Sorry, but the page you are looking could not be found.</p>
      <a href="/" style={{textDecoration:'none'}}>Go back to home page</a>
      <hr style={{margin: '50px'}} />
      <p>Please contact <a href="mailto:help@conferencesolutions.com">help@conferencesolutions.com</a> if the problem persists.</p>
    </div>
  )
};

const errorRoute = {
  path: '/error',
  component: () => (
    <div style={{padding: '100px 15px', textAlign:'center'}}>
      <img role="presentation" src="img/css.jpg" />
      <p>Something went wrong!</p>
      <a href="/" style={{textDecoration:'none'}}>Go back to home page</a>
      <hr style={{margin: '50px'}} />
      <p>Please contact <a href="mailto:help@conferencesolutions.com">help@conferencesolutions.com</a> if the problem persists.</p>
    </div>
  )
};

export default {
  component,
  childRoutes: [
    errorRoute,
    notFoundRoute,
  ]
};