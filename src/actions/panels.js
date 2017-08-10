
export const changeProfilePanelPerson = (person) => {
  return {
    type: 'CHANGE_PROFILEPANEL_PERSON',
    person
  }
};

export const toggleShowSearchPanel = () => {
  return {
    type: 'TOGGLE_SHOW_SEARCHPANEL'
  }
};

export const toggleShowFilterPanel = () => {
  return {
    type: 'TOGGLE_SHOW_FILTERPANEL'
  }
};
