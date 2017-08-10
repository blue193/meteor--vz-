import React from 'react';

import {
  BottomNavigation,
  BottomNavigationItem,
} from 'material-ui/BottomNavigation';

import Paper from 'material-ui/Paper';

import PeopleIcon from 'material-ui/svg-icons/social/people';
import PersonIcon from 'material-ui/svg-icons/social/person';
import TransferIcon from 'material-ui/svg-icons/maps/transfer-within-a-station';
import ScheduleIcon from 'material-ui/svg-icons/action/schedule';

const peopleIcon = <PeopleIcon />;
const personIcon = <PersonIcon />;
const transferIcon = <TransferIcon />;
const scheduleIcon = <ScheduleIcon />;

const Component = (props, { router }) => {
  // @TODO temp
  const selectedIndex = ['/', '/requests', '/profile', '/schedule'].findIndex((x) => router.isActive(x, true));
  const bniStyle = { style: { paddingTop: 6 } };

  const pushr = (r) => (e) => {
    e.preventDefault();
    router.push(r);
  };

  return (
    <Paper zDepth={1}>
      <BottomNavigation selectedIndex={selectedIndex}>
        <BottomNavigationItem {...bniStyle} label="People" icon={peopleIcon} onTouchTap={pushr('/')} />
        <BottomNavigationItem {...bniStyle} label="Requests" icon={transferIcon} onTouchTap={pushr('/requests')} />
        <BottomNavigationItem {...bniStyle} label="Profile" icon={personIcon} onTouchTap={pushr('/profile')} />
        <BottomNavigationItem {...bniStyle} label="Schedule" icon={scheduleIcon} onTouchTap={pushr('/schedule')} />
      </BottomNavigation>
    </Paper>
  );
};

Component.contextTypes = {
  router: React.PropTypes.any,
};

export default Component;
