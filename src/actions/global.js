import {pendingTask, begin} from 'react-redux-spinner';


export const backgroundJobStart = () => {
  return {
    type: 'ASYNC_TASK_START',
    [pendingTask]: begin
  }
};

export const changeSnackMessage = (text) => {
  return {
    type: 'CHANGE_SNACKMESSAGE',
    text
  }
};

export const changeSearchTerm = (text) => {
  return {
    type: 'CHANGE_SEARCH_TERM',
    text
  }
};
