import React from 'react';
import {connect} from 'react-redux';
import {List, ListItem} from 'material-ui/List';
import Paper from 'material-ui/Paper';
import {red600} from 'material-ui/styles/colors';
import { renderIfElse } from 'lib/renderThunk';

import styles from './index.css';
import Loader from '_components/Loader';
import ProfileDialog from './ProfileDialog';
import BetterAvatar from '_components/BetterAvatar';

import {colors} from 'styles/colors';

import {fetchSchedules} from 'actions/event'
import {changeMeetingWithPerson} from 'actions/modals'

let ScheduleList = class extends React.Component {
  state = {
    loading: false
  }

  componentDidMount() {
    this.props.fetchSchedules();
  }

  componentWillUnmount() {
    if (this.cancelable) {
      this.cancelable.cancel();
    }
  }

  render() {
    const dialogs = (
      <div>
        <ProfileDialog
          open={!!this.props.meetingWithPerson}
          person={this.props.meetingWithPerson}
          closeDialog={() => {
            this.props.changeMeetingWithPerson(null);
          }}
          />
      </div>
    );

    let schedules = this.props.schedules.sort((a,b) => {
      let at = a.timeSlot.interval.interval_start;
      let bt = b.timeSlot.interval.interval_start;

      return new Date(bt) - new Date(at);
    }).reverse();

    // filter out IDLE schedules
    schedules = schedules.filter(schedule => {
      return schedule.type !== 'IDLE';
    });

    return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        {this.props.topContent}
        {renderIfElse(this.state.loading)(() => (
          <Loader />
        ), () => (
          renderIfElse(!schedules.length)(() => (
            <div className={styles.noResults}>
              <Paper style={{padding: 10}}>
                {this.props.noResultsView || 'No Results'}
                {this.state.additionalErrorMessage ?
                  <p style={{color: red600}} children={this.state.additionalErrorMessage}/> : null}
              </Paper>
            </div>
          ), () => (
            <div
              id="div_print"
              style={{
                overflowY: 'scroll',
                padding: 10,
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-around',
                backgroundColor: (this.props.viewMode === 'grid' ? '#eeeeee' : '#fff'),
                height: '100%'
              }}>
              <List style={{width: '100%', alignContent: 'flex-start', backgroundColor: '#fff'}}>
                {schedules.map((meeting, ndx) => (
                  <ListItem key={meeting.meetingWith.id} innerDivStyle={{padding: 0, borderBottom: 'solid 1px #cccdcd'}} hoverColor='#fafafa' style={{cursor: 'auto'}}>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 10
                      }}>
                      <div style={{display: 'flex', flexDirection: 'row', minHeight: 60, alignItems: 'center'}}>
                        <div style={{marginLeft: 10, color: colors.orange0, fontSize: 16, fontWeight: 'bold'}}>{ndx + 1}</div>
                        <BetterAvatar
                          size={50}
                          src={meeting.meetingWith.image}
                          style={{marginLeft: 20}}
                          firstName={meeting.meetingWith.firstName}
                          lastName={meeting.meetingWith.lastName}/>
                        <div style={{width: 300, marginLeft: 10}}>
                          <div style={{
                            color: colors.grey1,
                            fontSize: 16,
                            fontWeight: 'bold'
                          }}>{meeting.meetingWith.firstName} {meeting.meetingWith.lastName}
                          </div>
                          <p style={{
                            color: colors.grey1,
                            fontSize: 14,
                            fontWeight: 300,
                            margin: '2px 0'
                          }}>{meeting.meetingWith.title}{(meeting.meetingWith.company ? ` at ${meeting.meetingWith.company}` : '')}</p>
                          <div style={{fontSize: 10, textDecoration: 'none', color: colors.orange1, cursor: 'pointer', display: 'inline'}}
                               onTouchTap={(e) => {
                                 e.preventDefault();
                                 this.props.changeMeetingWithPerson(meeting.meetingWith);
                               }}>VIEW PROFILE</div>
                        </div>
                        <div style={{marginLeft: 10}}>
                          <p style={{color: colors.grey4, fontSize: 13}}><b style={{color: colors.grey1}}>TIME:</b> {meeting.timeSlot.interval.interval_start}</p>
                        </div>
                        <div style={{marginLeft: 10}}>
                          <p style={{color: colors.grey4, fontSize: 13}}><b style={{color: colors.grey1}}>LOCATION:</b> {meeting.location.name}</p>
                        </div>
                      </div>
                      <div
                        style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <a style={{display: 'inline-block', marginLeft: 10}} href="#"><img src="img/linked_in.png" role="presentation" /></a>
                        <a style={{display: 'inline-block', marginLeft: 10}} href="#"><img src="img/accompany.png" role="presentation" /></a>
                        <a style={{display: 'inline-block', marginLeft: 10}} href="#"><img src="img/charlie.png" role="presentation" /></a>
                      </div>
                    </div>
                  </ListItem>
                ))}
              </List>
            </div>
          ))
        ))
        }
      </div>
      {dialogs}
    </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    schedules: state.event.schedules,
    meetingWithPerson: state.modals.meetingWithPerson
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchSchedules: () => dispatch(fetchSchedules()),
    changeMeetingWithPerson: (person) => dispatch(changeMeetingWithPerson(person))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleList)
