import React from 'react';
import {connect} from 'react-redux';
import TextTruncate from 'react-text-truncate';
import MediaQuery from 'react-responsive';

import {GridList, GridTile} from 'material-ui/GridList';
import {List, ListItem} from 'material-ui/List';
import Paper from 'material-ui/Paper';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {red600} from 'material-ui/styles/colors';
import Divider from 'material-ui/Divider';

import {renderIfElse} from 'lib/renderThunk';
import {renderIf} from 'lib/renderThunk';
import InterestDescription from 'routes/auth/event/people/_components/InterestDescription';
import BetterAvatar from '_components/BetterAvatar';
import Button from '_components/Button';
import {makeResponsiveGridList} from '_components/GridList';
import SnackBar from './SnackBar';
import styles from './index.css';

import {fetchPeople} from 'actions/event'
import {requestMeeting} from 'actions/event'
import {prioritizeRequest} from 'actions/event'
import {cancelMeetingRequest} from 'actions/event'
import {fetchDoNotMeetReasons} from 'actions/event'
import {changeDoNotMeetPerson} from 'actions/modals'
import {changeDoNotMeetReason} from 'actions/modals'
import {requestDoNotMeet} from 'actions/event'
import {cancelDoNotMeet} from 'actions/event'
import {changeProfilePanelPerson} from 'actions/panels'

import {colors} from 'styles/colors';
import {leftIcon, rightIcon} from 'styles/icons';

const PER_PAGE = 40;

const ResponsiveGridList = makeResponsiveGridList(GridList);

let RequestList = class extends React.Component {
  state = {
    page: 1
  }

  componentDidMount() {
    this.props.fetchPeople();
    this.props.fetchDoNotMeetReasons();
  }

  componentWillUnmount() {
  }

  componentWillReceiveProps(nextProps) {
  }

  goToPage = (page) => (e) => {
    e.preventDefault();
    this.setState({page})
  };

  prevPage = (e) => {
    e.preventDefault();
    this.setState({page: this.state.page - 1});
  }

  nextPage = (e) => {
    e.preventDefault();
    this.setState({page: this.state.page + 1});
  }

  renderButtons = (person) => {
    return (
      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', flex: 'none'}}>
        {person.doNotMeet
          ?  <Button
                size="small"
                label="CANCEL DO NOT MEET"
                onClick={() => {
                  this.props.cancelDoNotMeet(person);
                }}
                style={{marginRight: 10}}
              />
          : !person.requested &&
              <Button
               size="small"
               label="DO NOT MEET"
               onClick={() => {
                 this.props.changeDoNotMeetPerson(person);
               }}
               style={{marginRight: 10}}
             />
        }
        {person.requested &&
          <div style={{marginRight: 10, textAlign: 'center'}}>
            <SelectField
              labelStyle={{fontSize: 12, color: colors.grey3, lineHeight: 1, top: 0, padding: 7, borderRadius: 14, height: 28, width: 80, border: 'solid 1px #6d7275'}}
              menuItemStyle={{fontSize: 12}}
              underlineStyle={{display: 'none'}}
              iconStyle={{display: 'none'}}
              value={person.priority}
              onTouchTap={(e) => {
                e.stopPropagation()
              }}
              onChange={(e, index) => {
                const priority = index + 1;
                this.props.prioritizeRequest(person, priority);
              }}
              style={{ width: 80, height: 20 }}>
              <MenuItem value={1} primaryText="High" />
              <MenuItem value={2} primaryText="Medium" />
              <MenuItem value={3} primaryText="Low" />
            </SelectField>
          </div>
        }
        {!person.doNotMeet &&
          <Button
            size="small"
            label={person.requested ? "CANCEL REQUEST" : "REQUEST"}
            primary
            onClick={() => {
              if (person.requested) {
                this.props.cancelMeetingRequest(person);
              } else {
                this.props.requestMeeting(person);
              }
            }}
            style={{marginRight: 10}}
          />
        }
      </div>
    );
  };

  render() {
    const pageinationStart = (this.state.page - 1) * PER_PAGE;

    let matchedPeople = this.props.people.filter(this.props.filter)
      .filter(person => {
          if (this.props.filterPeopleIds == null) return true;
          return this.props.filterPeopleIds.indexOf(person.id) !== -1;
      })
      .filter(person => {
        if (!this.props.limitResultsToAB) return true;
        return person.firstName.toLowerCase().startsWith(this.props.limitResultsToAB);
      })
      .filter(person => {
        if (!this.props.clientSearchTerm) return true;
        let caseTerm = this.props.clientSearchTerm.toLowerCase();
        return ['company', 'name', 'phone', 'title', 'website'].some((prop) => {
          if (!person[prop]) return false;
          return person[prop].toLowerCase().indexOf(caseTerm) !== -1;
        });
      });

    if (this.props.shuffle)
      matchedPeople.sort(() => {return 0.5 - Math.random()});

    if (this.props.limit)
      matchedPeople = matchedPeople.slice(0, this.props.limit);

    if (this.props.sortBy) {
      matchedPeople = matchedPeople.sort((a, b) => {
        let sortProp;
        if (this.props.sortBy === 'First') {
          sortProp = 'firstName';
        } else if (this.props.sortBy === 'Last') {
          sortProp = 'lastName';
        } else if (this.props.sortBy === 'Company') {
          sortProp = 'company';
        }

        if (a[sortProp] < b[sortProp]) return -1;
        if (a[sortProp] > b[sortProp]) return 1;
        return 0;
      });
    }

    const dialogs = (
      <div>
        {renderIf(this.props.doNotMeetPerson)(() => (
          <Dialog
            title={(
              <div style={{
                color: colors.orange0,
                fontSize: 18,
                fontWeight: 'bold'
              }}>
                <span style={{color: '#000'}}>Do Not Meet </span>
                {this.props.doNotMeetPerson.firstName} {this.props.doNotMeetPerson.lastName}
              </div>
            )}
            actions={[
              <Button
                size="small"
                label="CANCEL"
                onClick={() => {
                  this.props.changeDoNotMeetPerson(null);
                  this.props.changeDoNotMeetReason(null);
                }}
                style={{marginRight: 10}}
              />,
              <Button
                primary
                disabled={!this.props.doNotMeetReason}
                size="small"
                label="DO NOT MEET"
                onClick={() => {
                  this.props.requestDoNotMeet(this.props.doNotMeetPerson, this.props.doNotMeetReason)
                }}
                style={{marginRight: 10}}
              />
            ]}
            actionsContainerStyle={{padding: 15}}
            contentStyle={{maxWidth: 600}}
            modal={false}
            open={!!this.props.doNotMeetPerson}
            onRequestClose={() => {
              this.props.changeDoNotMeetPerson(null);
              this.props.changeDoNotMeetReason(null);
            }}
          >
            <form>
              <div
                style={{color: colors.grey5, fontSize: 13}}>Reason <span>(Optional)</span></div>
              <RadioButtonGroup
                style={{paddingTop: 15, fontSize: 12, color: '#3a3a3a'}}
                name="doNotMeetReason"
                valueSelected={this.props.doNotMeetReason}
                onChange={(_, val) => this.props.changeDoNotMeetReason(val)}
              >
                {this.props.doNotMeetReasons.map((reason) => (
                  <RadioButton key={reason.id} value={reason} label={reason.reason}/>
                ))}
              </RadioButtonGroup>
            </form>
          </Dialog>
        ))}
      </div>
    );

    const peopleToDisplay = matchedPeople.slice(pageinationStart, pageinationStart + PER_PAGE);
    const totalPages = Math.ceil(matchedPeople.length / PER_PAGE);

    const pageinationBtn = (i, isCurrent) => (
      <FlatButton
        key={i}
        label={i}
        labelStyle={{
          color: colors.grey3,
          fontWeight: 'bold',
          fontSize: 12,
          paddingLeft: 12,
          paddingRight: 12,
          verticalAlign: 'top',
          lineHeight: '31px'
        }}
        backgroundColor={isCurrent ? colors.orange1 : 'transparent'}
        style={{minWidth: null, borderRadius: '50%', width: 30, height: 30}}
        disabled={isCurrent}
        onTouchTap={this.goToPage(i)}
      />
    )

    // based on https://gist.github.com/kottenator/9d936eb3e4e3c3e02598 thankfully... dont have time for this crap...
    const paginationAlg = (c, m) => {
      const current = c;
      const last = m;
      const delta = 1;
      const left = current - delta;
      const right = current + delta + 1;

      let range = [];
      let rangeWithDots = [];
      let l;

      for (let i = 1; i <= last; i++) {
        if (i === 1 || i === last || (i >= left && i < right)) {
          range.push(i);
        }
      }

      for (let i of range) {
        if (l) {
          if (i - l === 2) {
            const pg = l + 1;
            rangeWithDots.push(pageinationBtn(pg, pg === current));
          } else if (i - l !== 1) {
            rangeWithDots.push(
              <span key={`ellip-${i}`}>&middot;&middot;&middot;</span>
            );
          }
        }
        rangeWithDots.push(pageinationBtn(i, i === current));
        l = i;
      }

      return rangeWithDots;
    }

    const pagination = (totalPages <= 1) ? null : (
        <div className={styles.pagination}>
          <FlatButton
            disabled={this.state.page === 1}
            icon={leftIcon}
            style={{minWidth: null, margin: '0 1px', lineHeight: '40px'}}
            onTouchTap={this.prevPage}
          />
          {paginationAlg(this.state.page, totalPages)}
          <FlatButton
            disabled={this.state.page === totalPages}
            icon={rightIcon}
            style={{minWidth: null, margin: '0px 1px', lineHeight: '40px'}}
            onTouchTap={this.nextPage}
          />
        </div>
      );

    const reasoningmessage = 'Recommended because: Similar locations, hotel room size, meeting space, availability, and type of events/meetings';
    const reasoning = (
      renderIf(peopleToDisplay.length && this.props.recommendation)(() => (
        <div>
          <InterestDescription children={reasoningmessage}/>
          <Divider />
        </div>
      ))
    );

    return (
      <div className={styles.container}>
        <div className={styles.innerContainer}>
          {this.props.topContent}
          {reasoning}
          {renderIfElse(!peopleToDisplay.length)(() => (
            <div className={styles.noResults}>
              <Paper style={{padding: 10}}>
                {this.props.noResultsView || 'No Results'}
                {this.props.additionalErrorMessage ?
                  <p style={{color: red600}} children={this.props.additionalErrorMessage}/> : null}
              </Paper>
            </div>
          ), () => (
            <div
              style={{
                overflowY: 'scroll',
                padding: 10,
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-around',
                backgroundColor: (this.props.viewMode === 'grid' ? '#eeeeee' : '#fff'),
                height: '100%'
              }}>
              {renderIfElse(this.props.viewMode === 'grid')(() => (
                <ResponsiveGridList
                  cellHeight='auto'
                  subCols={(this.props.profilePanelPerson === null ? 0 : 1) + (this.props.showFilterPanel ? 1 : 0)}
                  style={{width: '100%', alignContent: 'flex-start'}}
                >
                  {peopleToDisplay.map((person, ndx) => (
                    <GridTile key={person.id} style={{minWidth: 300}}>
                      <div
                        style={{
                          backgroundColor: '#fff',
                          margin: 10,
                          display: 'flex',
                          flexDirection: 'column',
                          padding: '40px 40px 20px 40px',
                          borderRadius: 3,
                          height: 230
                        }}>
                        <div style={{display: 'flex', flexDirection: 'row', minHeight: 100, flexGrow: 1}}>
                          <BetterAvatar
                            size={48}
                            src={person.image}
                            style={{marginRight: 10}}
                            firstName={person.firstName}
                            lastName={person.lastName}/>

                          <div>
                            <div style={{
                              color: colors.grey1,
                              fontSize: 18,
                              fontWeight: 'bold'
                            }}>{person.firstName} {person.lastName}
                            </div>
                            <div style={{
                              color: colors.grey4,
                              fontSize: 16,
                              marginTop: 5,
                              marginBottom: 5
                            }}><TextTruncate line={3} truncateText="..." text={(person.title ? person.title : '') + (person.company ? ` at ${person.company}` : '')}/></div>
                            <div style={{fontSize: 10, textDecoration: 'none', color: colors.orange1, cursor: 'pointer', display: 'inline'}}
                                 onTouchTap={(e) => {
                                   e.preventDefault();
                                   this.props.changeProfilePanelPerson(person);
                                 }}>VIEW PROFILE</div>
                          </div>
                        </div>
                        <Divider style={{margin: '15px 0'}}/>
                        {this.renderButtons(person)}
                      </div>
                    </GridTile>
                  ))}
                </ResponsiveGridList>
              ), () => (
                <List style={{width: '100%', alignContent: 'flex-start', backgroundColor: '#fff'}}>
                  {peopleToDisplay.map((person, ndx) => (
                    <ListItem key={person.id} innerDivStyle={{padding: 0, borderBottom: 'solid 1px #cccdcd'}} hoverColor='#fafafa' style={{cursor: 'auto'}}>
                      <MediaQuery query='(min-device-width: 500px)'>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: 10
                          }}>
                          <div style={{display: 'flex', flexDirection: 'row', minHeight: 60, alignItems: 'center'}}>
                            <BetterAvatar
                              size={50}
                              src={person.image}
                              style={{marginRight: 10}}
                              firstName={person.firstName}
                              lastName={person.lastName}/>
                            <div>
                              <div style={{
                                color: colors.grey1,
                                fontSize: 16,
                                fontWeight: 'bold'
                              }}>{person.firstName} {person.lastName}
                              </div>
                              <p style={{
                                color: colors.grey1,
                                fontSize: 14,
                                fontWeight: 300,
                                margin: '2px 0'
                              }}>{person.title}{(person.company ? ` at ${person.company}` : '')}</p>
                              <div style={{fontSize: 10, textDecoration: 'none', color: colors.orange1, cursor: 'pointer', display: 'inline'}}
                                   onTouchTap={(e) => {
                                     e.preventDefault();
                                     this.props.changeProfilePanelPerson(person);
                                   }}>VIEW PROFILE</div>
                            </div>
                          </div>
                          {this.renderButtons(person)}
                        </div>
                      </MediaQuery>
                      <MediaQuery query='(max-device-width: 499px)'>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            margin: 10
                          }}>
                          <div style={{display: 'flex', flexDirection: 'row', minHeight: 60, alignItems: 'center', marginBottom: 10}}>
                            <BetterAvatar
                              size={50}
                              src={person.image}
                              style={{marginRight: 10}}
                              firstName={person.firstName}
                              lastName={person.lastName}/>
                            <div>
                              <div style={{
                                color: colors.grey1,
                                fontSize: 16,
                                fontWeight: 'bold'
                              }}>{person.firstName} {person.lastName}
                              </div>
                              <p style={{
                                color: colors.grey1,
                                fontSize: 14,
                                fontWeight: 300,
                                margin: '2px 0'
                              }}>{person.title}{(person.company ? ` at ${person.company}` : '')}</p>
                              <div style={{fontSize: 10, textDecoration: 'none', color: colors.orange1, cursor: 'pointer', display: 'inline'}}
                                   onTouchTap={(e) => {
                                     e.preventDefault();
                                     this.props.changeProfilePanelPerson(person);
                                   }}>VIEW PROFILE</div>
                            </div>
                          </div>
                          {this.renderButtons(person)}
                        </div>
                      </MediaQuery>
                    </ListItem>
                  ))}
                </List>
              ))}
            </div>
          ))}
        </div>
        {pagination}
        {dialogs}
        <SnackBar message={this.props.snackMessage || ''}/>
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    people: state.event.people,
    doNotMeetReasons: state.event.doNotMeetReasons,
    additionalErrorMessage: state.event.additionalErrorMessage,
    clientSearchTerm: state.global.searchTerm,
    snackMessage: state.global.snackMessage,
    doNotMeetPerson: state.modals.doNotMeetPerson,
    doNotMeetReason: state.modals.doNotMeetReason,
    profilePanelPerson: state.panels.profilePanelPerson,
    showFilterPanel: state.panels.showFilterPanel,
    filterPeopleIds: state.event.searchedPeopleIds
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchPeople: () => dispatch(fetchPeople()),
    requestMeeting: (person) => dispatch(requestMeeting(person)),
    prioritizeRequest: (person, priority) => dispatch(prioritizeRequest(person, priority)),
    cancelMeetingRequest: (person) => dispatch(cancelMeetingRequest(person)),
    fetchDoNotMeetReasons: () => dispatch(fetchDoNotMeetReasons()),
    changeDoNotMeetPerson: (person) => dispatch(changeDoNotMeetPerson(person)),
    changeDoNotMeetReason: (reason) => dispatch(changeDoNotMeetReason(reason)),
    requestDoNotMeet: (person, reason) => dispatch(requestDoNotMeet(person, reason)),
    cancelDoNotMeet: (person) => dispatch(cancelDoNotMeet(person)),
    changeProfilePanelPerson: (person) => dispatch(changeProfilePanelPerson(person))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(RequestList)
