import React from 'react';
import {connect} from 'react-redux';
import MediaQuery from 'react-responsive';

import styles from './index.css';
import RequestList from 'routes/auth/event/_components/RequestList';
import EventSubheader from 'routes/auth/event/_components/Subheader';
import ProfilePanel from '../../_components/RequestList/ProfilePanel';
import Button from '_components/Button';

import {changeProfilePanelPerson} from 'actions/panels';

let Request = class extends React.Component {
  static contextTypes = {
    router: React.PropTypes.any,
  }

  state = {
    dnm: false
  }

  componentDidMount() {
    this.props.changeProfilePanelPerson(null);
  }

  render() {
    const noResultsView = this.state.dnm ?
      (
        <div>
          <p>{'You haven\'t requested not to meet anyone yet!'}</p>
          <Button
            label="View Recommendations"
            style={{width: '100%'}}
            primary
            onClick={() => {
              this.context.router.push('/')
            }} />
        </div>
      ) :
      (
        <div>
          <p>You have not yet requested meetings!</p>
          <Button
            label="Request One!"
            style={{width: '100%'}}
            primary
            onClick={() => {
              this.context.router.push('/')
            }} />
        </div>
      );

    const titlebtn = (
      <Button
        primary
        label={this.state.dnm ? "View Requested Meetings" : "View Do Not Meet" }
        onClick={() => {this.setState({ dnm: !this.state.dnm });}}
        />
    )

    const topContent = (
      <div className={styles.topContent}>
        <EventSubheader title={titlebtn} >
          <MediaQuery query='(min-device-width: 500px)'>
            {this.state.dnm ?
              (<span
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  flex: 1}}>
                These are the people you have requested to NOT meet with
              </span>) :
              (<span
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  flex: 1}}>
                These are the people you have requested to meet
              </span>)
            }
          </MediaQuery>
        </EventSubheader>
      </div>
    );

    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <RequestList
            topContent={topContent}
            filter={this.state.dnm ? x => x.doNotMeet : x => x.requested}
            noResultsView={noResultsView}
            />
        </div>
        <div className={styles.profilePanel}>
          <ProfilePanel
            person={this.props.profilePanelPerson}
            closePanel={() => {
              this.props.changeProfilePanelPerson(null);
            }}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    profilePanelPerson: state.panels.profilePanelPerson,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeProfilePanelPerson: (person) => dispatch(changeProfilePanelPerson(person))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Request)
