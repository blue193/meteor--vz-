import Cookie from 'js-cookie';
let loggedIn = null;

const baseEndpoint = () => {
  if (window.location.hostname === 'localhost') {
    return process.env.REACT_APP_STAGE_API;
  }
  return '/api';
}

const authService = {
  loggedIn: () => {
    if (loggedIn !== null) {
      return Promise.resolve(loggedIn);
    }

    return fetch(`${baseEndpoint()}/auth/logged-in`, {
      headers: new Headers({ 'x-xsrf-token': authService.xsrfToken() }),
      mode: 'cors',
      credentials: 'include',
    })
    .then((r) => {
      loggedIn = r.ok;
      return loggedIn;
    })
  },

  xsrfToken: () => {
    return Cookie.get('xsrf');
  },

  redirectLocation: () => {
    return window.localStorage.getItem('redirectLocation');
  },

  logIn: (token) => {
    return fetch(`${baseEndpoint()}/auth/verify`, {
      body: JSON.stringify({ token }),
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      mode: 'cors',
      credentials: 'include',
    })
    .then((r) => {
      loggedIn = r.ok;
      const xsrfToken = r.headers.get('x-xsrf-token');
      Cookie.set('xsrf', xsrfToken);
      return loggedIn;
    });
  },

  logOut: (e) => {
    e.preventDefault();
    const xsrfToken = authService.xsrfToken();
    Cookie.remove('xsrf');
    return fetch(`${baseEndpoint()}/auth/logout`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: new Headers({ 'x-xsrf-token': xsrfToken })
    })
    .then((r) => r.json())
    .then(({ url }) => {
      window.location.href = url;
    });
  },

  redirect: (goBackTo) => {
    window.localStorage.setItem(
      'redirectLocation',
      (goBackTo || window.location.href.replace(window.location.origin, ''))
    );

    return fetch(`${baseEndpoint()}/auth/redirect`, {
      mode: 'cors'
    })
    .then((r) => r.json())
    .then(({ url }) => {
      window.location.href = url || '/error';
    });
  },
};

export default authService;
