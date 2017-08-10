import Auth from './auth';

const encodeEntry = (k, v) => {
  if (typeof v === 'boolean') {
    return v ? k : '';
  } else {
    return k + '=' + v.toString();
  }
};

const baseEndpoint = () => {
  if (window.location.hostname === 'localhost') {
    return process.env.REACT_APP_STAGE_API;
  }
  return '/api';
}

const urlEncodeObject = (object) => {
  let output = [];
  for (let k in object) {
    if (!object.hasOwnProperty(k)) continue;
    let v = object[k];
    if (Array.isArray(v)) {
      for( let i = 0; i < v.length; i++) {
        output.push(encodeEntry(k, v[i]));
      }
    } else {
      output.push(encodeEntry(k, v));
    }
  }
  return output.filter((e) => e).join('&');
};

const jsonDecode = r => r.json();

const apiHeaders = additionalHeaders => ({
  'Accept': 'application/json',
  'x-xsrf-token': Auth.xsrfToken(),
  ...additionalHeaders,
});

const apiPath = path => `${baseEndpoint()}${path}`;

const jsonFetchOpts = ({ headers, method, body }) => ({
  mode: 'cors',
  credentials: 'include',
  headers,
  method,
  body,
});

const verifyAuth = (r) => {
  if (r.status === 401) {
    return Auth
      .redirect()
      .then(() => Promise.reject(Error('Not Authorized')));
  } else {
    return r;
  }
};

var errModalFn = null;
const setErrModalFn = (fn) => {
  errModalFn = fn;
}

const verifyStatus = (r) => {
  if ([200, 201, 204].indexOf(r.status) !== -1) {
    return r;
  } else {
    if (errModalFn) {
      errModalFn(true);
    }
    return Promise.reject(r);
  }
};

const baseFetch = (path, opts) => {
  return fetch(apiPath(path), opts)
    .then(verifyAuth)
    .then(verifyStatus);
}

const stdFetch = (path, method, data) => {
  return baseFetch(path, jsonFetchOpts({
    headers: apiHeaders(),
    body: data ? data : undefined,
    method,
  }));
}

const jsonFetch = (path, method, data) => {
  return baseFetch(path, jsonFetchOpts({
    headers: apiHeaders({
      'Content-Type': 'application/json',
    }),
    body: data ? JSON.stringify(data) : undefined,
    method,
  }));
}

const getProfile = (query) => {
  return jsonFetch(`/profile?${urlEncodeObject(query)}`, 'GET')
    .then(jsonDecode)
};

const submitProfile = (profileFields) => {
  return jsonFetch('/profile', 'PATCH', profileFields)
  .then(() =>{});
};

const uploadProfileImage = imageData => {
  var data = new FormData();
  data.append('file', imageData)
  return stdFetch('/profile-image', 'POST', data)
    .then(jsonDecode);
};

const answerQuestions = (answers) => {
  return jsonFetch('/profile/responses', 'PUT', answers);
};

const getQuestionResponses = (query) => {
  return jsonFetch(`/profile/responses?${urlEncodeObject(query)}`, 'GET')
    .then(jsonDecode);
};

const getFilters = () => {
  return jsonFetch(`/filters`, 'GET')
    .then(jsonDecode);
};

const getPeople = (query) => {
  return jsonFetch(`/people?${urlEncodeObject(query)}`, 'GET')
    .then(jsonDecode);
};

const updateRequest = (personId, requested) => {
  return jsonFetch(`/people/${personId}`, 'PATCH', {
    requested,
  })
  .then(() => {});
};

const requestMeeting = (requesteeId) => {
  return stdFetch(`/requests/${requesteeId}`, 'PUT')
    .then(() => {});
};

const cancelMeetingRequest = (requesteeId) => {
  return stdFetch(`/requests/${requesteeId}`, 'DELETE')
    .then(() => {});
};

let reasons = null;
const getDoNotMeetReasons = () => {
  if (reasons !== null) {
    return Promise.resolve(reasons);
  }

  return jsonFetch('/donotmeet/reasons', 'GET')
    .then(jsonDecode)
    .then((r) => {
      reasons = r;
      return reasons;
    });
};

const requestDoNotMeet = (requesteeId, reasonId) => {
  return stdFetch(`/donotmeet/${requesteeId}/${reasonId}`, 'PUT')
    .then(() => {});
};

const cancelDoNotMeetRequest = (requesteeId) => {
  return stdFetch(`/donotmeet/${requesteeId}`, 'DELETE')
    .then(() => {});
};

const search = (query) => {
  return jsonFetch(`/search?${urlEncodeObject(query)}`, 'GET')
    .then(jsonDecode);
};

const prioritize = (query) => {
  return jsonFetch(`/prioritize?${urlEncodeObject(query)}`, 'GET')
    .then(() => {});
};

const getEvents = () => {
  return jsonFetch(`/events`, 'GET')
    .then(jsonDecode);
};

const getEventSettings = () => {
  return jsonFetch('/event-settings', 'GET')
    .then(jsonDecode);
};

const getSchedule = () => {
  return jsonFetch('/schedules', 'GET')
    .then(jsonDecode);
};

const getScheduleUrl = () => {
  return jsonFetch('/schedulesUrl', 'GET')
    .then(jsonDecode);
};

export default {
  getProfile,
  submitProfile,
  uploadProfileImage,
  getPeople,
  updateRequest,
  answerQuestions,
  getQuestionResponses,
  getFilters,
  requestMeeting,
  cancelMeetingRequest,
  getDoNotMeetReasons,
  requestDoNotMeet,
  cancelDoNotMeetRequest,
  search,
  setErrModalFn,
  prioritize,
  getEvents,
  getEventSettings,
  getSchedule,
  getScheduleUrl
};
