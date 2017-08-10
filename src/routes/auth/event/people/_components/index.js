import React from 'react';
import {connect} from 'react-redux';
import Joyride from 'react-joyride';

import styles from './index.css';
import RequestList from '../../_components/RequestList';
import SortBar from '../../_components/SortBar';
import SideFilter from '../../_components/SideFilter';
import AlphabetFilter from '../../_components/AlphabetFilter';
import ProfilePanel from '../../_components/RequestList/ProfilePanel';
import Button from '_components/Button';

import {changeProfilePanelPerson} from 'actions/panels'
import {toggleShowFilterPanel} from 'actions/panels'


let People = class extends React.Component {
  static contextTypes = {
    router: React.PropTypes.any,
  };

  state = {
    limitResultsToIds: null,
    limitResultsToAB: null,
    sortBy: 'First',
    viewMode: 'grid',
    showRecommendation: false
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.search !== this.props.location.search) {
      this.setState({
        limitResultsToIds: null,
        sortBy: 'First',
      });

      if (this.showJoyride()) {
        this.joyride.reset(true);
        this.joyride.start(true);
      }
    }
  }

  changeQuery = (q) => {
    this.context.router.push({
      path: '/',
      query: q,
    });
  }

  showAllQuery = () => {
    return this.props.location.query.showAll || !window.USE_RECOMMENDATION_SERVICE;
  }

  componentDidMount() {
    this.props.changeProfilePanelPerson(null);
    if (this.showJoyride()) {
      this.joyride.start(true);
    }
  }

  onJoyride = (event) => {
    if (event.type === 'finished') {
      window.localStorage.setItem('joyride:people', 'true');
    }
  }

  joyrideSteps() {
    return [
      {
        title: 'Sort',
        text: 'Click this button to sort results.',
        selector: '#sortButton',
        position: 'bottom'
      },
      {
        title: 'Search',
        text: 'Click here to type words to search by.',
        selector: '#searchButton',
        position: 'bottom'
      },
      {
        title: 'Filter',
        text: 'Click here to filter results to specific people or categories.',
        selector: '#filterButton',
        position: 'bottom'
      }
    ];
  }

  showJoyride() {
    return window.localStorage.getItem('joyride:people') !== 'true';
  }

  render() {
    const noResultsView = this.showAllQuery() ? (
        <div>
          <p>No People to Show!</p>
        </div>
      ) : (
        <div>
          <p>No Recommended Results!</p>
          <Button
            primary
            label="View All People"
            style={{width: '100%'}}
            onClick={() => {
              this.changeQuery({showAll: true});
            }}/>
        </div>
      );

    const topContent = (
      <div className={styles.topContent}>
        <SortBar
          sortBy={this.state.sortBy}
          viewMode={this.state.viewMode}
          showRecommendation={this.state.showRecommendation}
          onTapFilterPanel={() => this.props.toggleShowFilterPanel()}
          onTapViewMode={() => this.setState({viewMode: this.state.viewMode === 'grid' ? 'list' : 'grid'})}
          onToggleShowRecommendation={() => this.setState({showRecommendation: !this.state.showRecommendation})}
          onSortByChange={(sortBy) => {
            const sortOpts = ['First', 'Last', 'Company'];
            this.setState({
              sortBy: sortOpts[sortOpts.indexOf(sortBy)],
            });
          }}
        />
      </div>
    );

    const joyride = this.showJoyride() ? (
        <Joyride
          ref={c => (this.joyride = c)}
          type="continuous"
          steps={this.joyrideSteps()}
          locale={{back: 'Back', close: 'Close', last: 'Next', next: 'Next', skip: 'Skip'}}
          callback={this.onJoyride}
          showOverlay={false}
        />
      ) : null;

    return (
      <div style={{display: 'flex', flexDirection: 'row', height: 'inherit', width: '100%'}}>
        {joyride}
        <div className={styles.filtersView}>
          <SideFilter
            show={this.props.showFilterPanel}
            limitResultsToIds={(ids) => {
              this.setState({limitResultsToIds: ids})
            }}
          />
          <AlphabetFilter
            show={this.props.showFilterPanel}
            limitResultsToAB={(char) => {
              this.setState({limitResultsToAB: char})
            }}
          />
        </div>
        <div className={styles.content}>
          <RequestList
            filter={x => !x.requested || x.requested}
            topContent={topContent}
            limitResultsToIds={this.state.limitResultsToIds}
            limitResultsToAB={this.state.limitResultsToAB}
            recommendation={window.USE_RECOMMENDATION_SERVICE}
            noResultsView={noResultsView}
            sortBy={this.state.sortBy}
            viewMode={this.state.viewMode}
            shuffle={this.state.showRecommendation}
            limit={this.state.showRecommendation ? 10 : null }
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
    showFilterPanel: state.panels.showFilterPanel
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeProfilePanelPerson: (person) => dispatch(changeProfilePanelPerson(person)),
    toggleShowFilterPanel: () => dispatch(toggleShowFilterPanel())
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(People)
