import React from 'react';

import {printDiv} from 'lib/print';
import styles from './index.css';
import ScheduleList from './ScheduleList';
import ProfilePanel from '../../_components/RequestList/ProfilePanel';
import EventSubheader from '../../_components/Subheader';
import Button from '_components/Button';

export default class extends React.Component {
  state = {
    scheduleUrl: null,
    profile: null
  };

  componentDidMount() {
  }

  componentWillUnmount() {
    if (this.cancelable) {
      this.cancelable.cancel();
    }
  }

  render() {
    const topContent = (
      <div className={styles.topContent}>
        <EventSubheader title={(
          <Button
            primary
            label="PRINT PROFILES"
            style={{float: 'right'}}
            onClick={() => {
              printDiv('div_print');
            }}/>
        )}>
          <span style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            flex: 1}}>
            Meeting Schedule for {this.state.profile && this.state.profile.firstName} {this.state.profile && this.state.profile.lastName}
          </span>
        </EventSubheader>
      </div>
    );

    return (
      <div className={styles.listContainer}>
        <div className={styles.content}>
          <ScheduleList
            topContent={topContent}
          />
        </div>
        <div className={styles.profilePanel}>
          <ProfilePanel
            person={this.state.profilePanelPerson}
            closePanel={() => {
              this.setState({profilePanelPerson: null});
            }}
          />
        </div>
      </div>
    );
  }
};
