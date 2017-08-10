import {pendingTask, end} from 'react-redux-spinner';
import {backgroundJobStart, changeSnackMessage} from './global';
import {changeDoNotMeetReason, changeDoNotMeetPerson} from './modals';


export const fetchEventsSuccess = (events) => {
  return {
    type: 'FETCH_EVENTS_SUCCESS',
    events,
    [pendingTask]: end
  }
};

export const fetchEvents = () => {
  return (dispatch, getState, Api) => {
    dispatch(backgroundJobStart());
    Api
      .getEvents()
      .then((events) => {
        dispatch(fetchEventsSuccess(events));
      });
  };
};

export const fetchEventSettingsSuccess = (settings) => {
  return {
    type: 'FETCH_EVENT_SETTINGS_SUCCESS',
    settings,
    [pendingTask]: end
  }
};

export const fetchEventSettings = () => {
  return (dispatch, getState, Api) => {
    dispatch(backgroundJobStart());
    Api.getEventSettings()
      .then(json => {
        dispatch(fetchEventSettingsSuccess(json));
      });
  };
};

export const requestDoNotMeetSuccess = (person) => {
  return {
    type: 'REQUEST_DONOTMEET_SUCCESS',
    person,
    [pendingTask]: end
  }
};

export const cancelDoNotMeetSuccess = (person) => {
  return {
    type: 'CANCEL_DONOTMEET_SUCCESS',
    person,
    [pendingTask]: end
  }
};

export const requestDoNotMeet = (person, reason) => {
  return (dispatch, getState, Api) => {
    dispatch(backgroundJobStart());
    Api.requestDoNotMeet(person.id, reason.id)
      .then(() => {
        dispatch(requestDoNotMeetSuccess(person));
        dispatch(changeDoNotMeetReason(null));
        dispatch(changeDoNotMeetPerson(null));
        dispatch(changeSnackMessage('Requested Do Not Meet: ' + person.name));
      })
  };
};

export const cancelDoNotMeet = (person) => {
  return (dispatch, getState, Api) => {
    dispatch(backgroundJobStart());
    Api.cancelDoNotMeetRequest(person.id)
      .then(() => {
        dispatch(cancelDoNotMeetSuccess(person));
        dispatch(changeSnackMessage('Canceled Do Not Meet: ' + person.name));
      });
  };
};

export const fetchPeopleSuccess = (people, reasoning, additionalErrorMessage) => {
  return {
    type: 'FETCH_PEOPLE_SUCCESS',
    people,
    reasoning,
    additionalErrorMessage,
    [pendingTask]: end
  }
};

export const fetchPeople = () => {
  return (dispatch, getState, Api) => {
    dispatch(backgroundJobStart());
    Promise.all([
      Api.getPeople({requested: false}),
      Api.getPeople({requested: true}),
      Api.getPeople({doNotMeet: true}),
    ]).then(([getUnRequestedPeopleResp, getRequestedPeopleResp, getDontPeopleResp]) => {
      let allPeople = getUnRequestedPeopleResp.data.concat(getRequestedPeopleResp.data).concat(getDontPeopleResp.data);

      dispatch(fetchPeopleSuccess(allPeople, getUnRequestedPeopleResp.meta.reasoning, getUnRequestedPeopleResp.meta.err))
    });
  };
};

export const fetchSchedulesSuccess = (schedules) => {
  return {
    type: 'FETCH_SCHEDULES_SUCCESS',
    schedules,
    [pendingTask]: end
  }
};

export const fetchSchedules = () => {
  return (dispatch, getState, Api) => {
    dispatch(backgroundJobStart());
    Api.getSchedule()
      .then((schedules) => {
        dispatch(fetchSchedulesSuccess(schedules.data))
      });
  };
};

export const fetchDoNotMeetReasonsSuccess = (reasons) => {
  return {
    type: 'FETCH_DONOT_MEET_REASONS_SUCCESS',
    reasons,
    [pendingTask]: end
  }
};

export const fetchDoNotMeetReasons = () => {
  return (dispatch, getState, Api) => {
    dispatch(backgroundJobStart());
    Api.getDoNotMeetReasons()
      .then((reasons) => {
        dispatch(fetchDoNotMeetReasonsSuccess(reasons))
      })
  };
};

export const requestMeetingSuccess = (person) => {
  return {
    type: 'REQUEST_MEETING_SUCCESS',
    person,
    [pendingTask]: end
  }
};

export const requestMeeting = (person) => {
  return (dispatch, getState, Api) => {
    dispatch(backgroundJobStart());
    Api.requestMeeting(person.id)
      .then(() => {
        dispatch(requestMeetingSuccess(person));
        dispatch(changeSnackMessage('Requested: ' + person.name));
      })
      .catch(() => {
        dispatch(changeSnackMessage('Failed requesting: ' + person.name));
      })
  };
};

export const cancelMeetingRequestSuccess = (person) => {
  return {
    type: 'CANCEL_MEETING_REQUEST_SUCCESS',
    person,
    [pendingTask]: end
  }
};

export const cancelMeetingRequest = (person) => {
  return (dispatch, getState, Api) => {
    dispatch(backgroundJobStart());
    Api.cancelMeetingRequest(person.id)
      .then(() => {
        dispatch(cancelMeetingRequestSuccess(person));
        dispatch(changeSnackMessage('Canceled request: ' + person.name));
      })
      .catch(() => {
        dispatch(changeSnackMessage('Failed requesting: ' + person.name));
      })
  };
};

export const prioritizeRequestSuccess = (person) => {
  return {
    type: 'PRIORITIZE_REQUEST_SUCCESS',
    person,
    [pendingTask]: end
  }
};

export const changePersonPriority = (person, priority) => {
  return {
    type: 'CHANGE_PERSON_PRIORITY',
    person,
    priority
  }
};

export const prioritizeRequest = (person, priority) => {
  return (dispatch, getState, Api) => {
    dispatch(backgroundJobStart());
    dispatch(changePersonPriority(person, priority));
    Api.prioritize({requesteeId: person.id, priority: priority})
      .then(() => {
        dispatch(prioritizeRequestSuccess(person));
        dispatch(changeSnackMessage('Changed priority: ' + person.name));
      })
      .catch(() => {
        dispatch(changeSnackMessage('Failed Changing priority: ' + person.name));
      })
  };
};

export const searchedPeopleSuccess = (ids) => {

    return {
        type: 'SEARCHED_PEOPLE_SUCCESS',
        ids,
        [pendingTask]: end
    }
};

export const searchQuery = (qas) => {
    return (dispatch, getState, Api) => {
        dispatch(backgroundJobStart());
        Api.search({qas})
            .then((ids) => {
                if(!qas)
                  dispatch(searchedPeopleSuccess(null));
                else{
                  dispatch(searchedPeopleSuccess(ids));}
            })
            .catch(() => {
                dispatch(changeSnackMessage('Failed Changing priority: '));
            })
    };
};