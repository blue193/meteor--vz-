const saveState = (key, value) => {
  window.sessionStorage.setItem(key, JSON.stringify(value));
}

const loadState = (key) => {
  const fromSession = window.sessionStorage.getItem(key);

  if (!fromSession) {
    return {};
  }

  try {
    return JSON.parse(fromSession);
  } catch (e) {
    return {};
  }
}

const removeState = (key) => {
  window.sessionStorage.removeItem(key);
}

const hasState = (key) => {
  return Boolean(window.sessionStorage.getItem(key));
}

export default {
  saveState,
  loadState,
  removeState,
  hasState,
  PROFILE_COMPLETED: 'css$stageai$profilecompleted',
  PROFILE_STATE: 'css$stageai$profilestate',
  QUESTIONS_STATE: 'css$stageai$questionsstate',
  QUESTIONS_COMPLETED: 'css$stageai$questionscompleted',
}
