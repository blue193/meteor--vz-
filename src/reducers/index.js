import {combineReducers} from 'redux';
import {pendingTasksReducer} from 'react-redux-spinner';
import {routerReducer} from 'react-router-redux';


const global = (state = {searchTerm: '', snackMessage: ''}, action) => {
  switch (action.type) {
    case 'CHANGE_SEARCH_TERM':
      return Object.assign({}, state, {
        searchTerm: action.text
      });

    case 'CHANGE_SNACKMESSAGE':
      return Object.assign({}, state, {
        snackMessage: action.text
      });

    default:
      return state
  }
};

const event = (state = {events: [], settings: {}, people: [], schedules: [],reasoning: undefined, additionalErrorMessage: undefined, searchedPeopleIds: null}, action) => {
  switch (action.type) {
    case 'FETCH_EVENTS_SUCCESS':
      return Object.assign({}, state, {
        events: action.events
      });

    case 'FETCH_EVENT_SETTINGS_SUCCESS':
      return Object.assign({}, state, {
        settings: action.settings
      });

    case 'FETCH_PEOPLE_SUCCESS':
      return Object.assign({}, state, {
        people: action.people,
        reasoning: action.reasoning,
        additionalErrorMessage: action.additionalErrorMessage
      });

    case 'FETCH_SCHEDULES_SUCCESS':
      return Object.assign({}, state, {
        schedules: action.schedules
      });

    case 'FETCH_DONOT_MEET_REASONS_SUCCESS':
      return Object.assign({}, state, {
        doNotMeetReasons: action.reasons
      });

    case 'REQUEST_MEETING_SUCCESS':
    case 'CANCEL_MEETING_REQUEST_SUCCESS':
      return Object.assign({}, state, {
        people: state.people.map((x) => {
          if (x.id !== action.person.id) return x;
          return {...x, requested: !x.requested, priority: 2};
        })
      });

    case 'CANCEL_DONOTMEET_SUCCESS':
      return Object.assign({}, state, {
        people: state.people.map((x) => {
          if (x.id !== action.person.id) return x;
          return {...x, doNotMeet: false};
        })
      });

    case 'REQUEST_DONOTMEET_SUCCESS':
      return Object.assign({}, state, {
        people: state.people.map((x) => {
          if (x.id !== action.person.id) return x;
          return {...x, doNotMeet: true};
        })
      });

    case 'CHANGE_PERSON_PRIORITY':
      return Object.assign({}, state, {
        people: state.people.map((x) => {
          if (x.id !== action.person.id) return x;
          return {...x, priority: action.priority};
        })
      });

    case 'SEARCHED_PEOPLE_SUCCESS':
        return Object.assign({}, state, {
            searchedPeopleIds: action.ids
        });

    default:
      return state
  }
};

const modals = (state = {doNotMeetPerson: null, doNotMeetReason: null, meetingWithPerson: null}, action) => {
  switch (action.type) {
    case 'CHANGE_PEOPLE_DONOTMEET_PERSON':
      return Object.assign({}, state, {
        doNotMeetPerson: action.person
      });

    case 'CHANGE_DONOTMEET_REASON':
      return Object.assign({}, state, {
        doNotMeetReason: action.reason
      });

    case 'CHANGE_SCHEDULE_MEETINGWITH_PERSON':
      return Object.assign({}, state, {
        meetingWithPerson: action.person
      });

    default:
      return state
  }
};

const panels = (state = {showSearchPanel: false, showFilterPanel: false, profilePanelPerson: null}, action) => {
  switch (action.type) {
    case 'TOGGLE_SHOW_SEARCHPANEL':
      return Object.assign({}, state, {
        showSearchPanel: !state.showSearchPanel
      });

    case 'TOGGLE_SHOW_FILTERPANEL':
      return Object.assign({}, state, {
        showFilterPanel: !state.showFilterPanel
      });

    case 'CHANGE_PROFILEPANEL_PERSON':
      return Object.assign({}, state, {
        profilePanelPerson: action.person
      });

    default:
      return state
  }
};

export default combineReducers({
  global,
  event,
  modals,
  panels,
  pendingTasks: pendingTasksReducer,
  routing: routerReducer
});