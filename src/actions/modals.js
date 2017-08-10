
export const changeDoNotMeetPerson = (person) => {
  return {
    type: 'CHANGE_PEOPLE_DONOTMEET_PERSON',
    person
  }
};

export const changeDoNotMeetReason = (reason) => {
  return {
    type: 'CHANGE_DONOTMEET_REASON',
    reason
  }
};

export const changeMeetingWithPerson = (person) => {
  return {
    type: 'CHANGE_SCHEDULE_MEETINGWITH_PERSON',
    person
  }
};
