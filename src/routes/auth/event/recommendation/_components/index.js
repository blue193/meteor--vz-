import React from 'react';
import {connect} from 'react-redux';

import styles from './index.css';
import RequestList from 'routes/auth/event/_components/RequestList';
import EventSubheader from 'routes/auth/event/_components/Subheader';
import ProfilePanel from '../../_components/RequestList/ProfilePanel';

import {changeProfilePanelPerson} from 'actions/panels';

let Recommendations = class extends React.Component {
  static contextTypes = {
    router: React.PropTypes.any,
  };

  componentDidMount() {
    this.props.changeProfilePanelPerson(null);
  }

  render() {
    const topContent = (
      <div className={styles.topContent}>
        <EventSubheader>
         <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1}}>These are the people we recommend</span>
        </EventSubheader>
      </div>
    );

    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <RequestList
            topContent={topContent}
            filter={x => !x.requested || x.requested}
            shuffle
            limit={10}
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

export default connect(mapStateToProps, mapDispatchToProps)(Recommendations)
