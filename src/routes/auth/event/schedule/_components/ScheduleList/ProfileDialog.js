import React from 'react';
import {connect} from 'react-redux';

import Dialog from 'material-ui/Dialog';
import Subheader from 'material-ui/Subheader';

import Loader from '_components/Loader';
import {renderIfElse} from 'lib/renderThunk';
import {printDiv} from 'lib/print';
import BetterAvatar from '_components/BetterAvatar';
import Button from '_components/Button';
import Api from 'lib/api';

import {colors} from 'styles/colors';

import {requestMeeting} from 'actions/event'
import {cancelMeetingRequest} from 'actions/event'
import {requestDoNotMeet} from 'actions/event'
import {cancelDoNotMeet} from 'actions/event'
import {changeDoNotMeetPerson} from 'actions/modals'
import {changeDoNotMeetReason} from 'actions/modals'
import {changeMeetingWithPerson} from 'actions/modals'


let ProfileDialog = class extends React.Component {

  state = {
    profileLoaded: false,
    questionsLoaded: false,
    profile: null,
    questions: []
  };

  componentWillReceiveProps(nextProps) {
    if (!nextProps.person)
      return;

    if (this.props.person !== nextProps.person) {
      this.setState({profileLoaded: false, questionsLoaded: false});
      this.reloadPerson(nextProps.person)
    }
  }

  reloadPerson = (person) => {
    Api
      .getProfile({userId: person.id})
      .then(profile => {
        this.setState({
          profile: profile,
          profileLoaded: true
        });
      });
    Api
      .getQuestionResponses({userId: person.id})
      .then(questions => {
        this.setState({
          questions,
          questionsLoaded: true
        });
      });
  };

  actions = (person) => {
    return [
      <Button
        primary
        label={person.requested ? "CANCEL REQUEST" : "REQUEST"}
        onClick={() => {
          this.props.changeMeetingWithPerson(null);
          if (person.requested) {
            this.props.cancelMeetingRequest(person);
          } else {
            this.props.requestMeeting(person);
          }
        }}
      />,
    ];
  };

  render() {
    if (!this.props.person) {
      return <div/>;
    }

    const profile = this.state.profile;
    const questions = this.state.questions;

    return (
      <Dialog
        title={(
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <div style={{display: 'flex'}}>
              <BetterAvatar
                src={this.props.person.image}
                size={40}
                firstName={this.props.person.firstName}
                lastName={this.props.person.lastName}
                style={{marginRight: 10}}/>
              <div
                style={{marginRight: 10}}>
                <div
                  style={{
                    color: colors.grey1,
                    fontSize: 18,
                    fontWeight: 'bold',
                    lineHeight: 1,
                    marginRight: 10
                  }}>
                  {this.props.person.firstName} {this.props.person.lastName}
                </div>
                {profile &&
                  <p
                    style={{
                      color: colors.grey4,
                      fontSize: 14,
                      margin: 0,
                      fontWeight: 'bold',
                      lineHeight: 1.3
                    }}>
                    {profile.title}
                  </p>
                }
                {profile && profile.company &&
                <p
                    style={{
                      color: colors.grey4,
                      fontSize: 12,
                      margin: 0,
                      lineHeight: 1
                    }}>
                    {profile.company}
                  </p>
                }
              </div>
              <div
                style={{marginTop: 10}}>
                <a style={{display: 'inline-block'}} href="#"><img src="img/charlie.png" role="presentation" /></a>
                <a style={{display: 'inline-block', marginLeft: 10}} href="#"><img src="img/accompany.png" role="presentation" /></a>
                <a style={{display: 'inline-block', marginLeft: 10}} href="#"><img src="img/linked_in.png" role="presentation" /></a>
              </div>
            </div>
            <Button
              size="small"
              label="PRINT USER PROFILE"
              style={{float: "right", marginTop: 10}}
              onClick={() => {
                printDiv('div_print_profile');
              }}
            />
          </div>
        )}
        actions={this.actions(this.props.person)}
        modal={false}
        open={this.props.open}
        onRequestClose={() => {
          this.setState({ showQuestions: true });
          this.props.closeDialog();
        }}
        autoScrollBodyContent={true}>
        {renderIfElse(!this.state.questionsLoaded || !this.state.profileLoaded)(() => (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: 50,
          }}>
            <Loader />
          </div>
        ), () => (
          <div
            id='div_print_profile'
            style={{
            padding: '10px 30px 30px',
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'wrap',
            justifyContent: 'space-between'
          }}>
            <p
              style={{
                color: colors.grey4,
                fontSize: 14,
                fontWeight: 300,
                textAlign: 'left'
              }}>
              Phone: {profile.phone}<br />
              Email: {profile.email}</p>
            <p
              style={{
                color: colors.grey4,
                fontSize: 14,
                fontWeight: 300,
              }}>
              {profile.website}</p>

            <div style={{textAlign: 'left', width: '100%'}}>
              {questions.map((question) => {
                if (question.typeText) {
                  return (
                    <div key={question.id}>
                      <Subheader style={{
                        color: colors.grey4,
                        fontSize: 14,
                        fontWeight: 300,
                        padding: 0,
                        lineHeight: 1.5
                      }}>{question.prompt}</Subheader>
                      <p style={{
                        color: colors.grey1,
                        fontSize: 14
                      }}>{question.answer.response}</p>
                    </div>
                  );
                } else {
                  // treat checkbox and radio as the same
                  const optionIds = question.answer.option ? [question.answer.option] : question.answer.options;
                  const options = optionIds.reduce((result, opt) => {
                    const displayOpt = question.options.find(o => o.id === opt);
                    return displayOpt ? [...result, displayOpt] : result;
                  }, []);

                  return (
                    <div key={question.id}>
                      <Subheader style={{
                        color: colors.grey4,
                        fontSize: 14,
                        fontWeight: 300,
                        padding: 0,
                        lineHeight: 1.5
                      }}>{question.prompt}</Subheader>
                      {options.map(option => {
                        return (
                          <p style={{
                            color: colors.grey1,
                            fontSize: 14
                          }} key={option.id}>{option.text}</p>
                        );
                      })}
                    </div>
                  );
                }
              })}
            </div>
          </div>
        ))}
      </Dialog>
    );
  }
};


const mapStateToProps = (state) => {
  return {
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    requestMeeting: (person) => dispatch(requestMeeting(person)),
    cancelMeetingRequest: (person) => dispatch(cancelMeetingRequest(person)),
    changeDoNotMeetPerson: (person) => dispatch(changeDoNotMeetPerson(person)),
    changeDoNotMeetReason: (reason) => dispatch(changeDoNotMeetReason(reason)),
    requestDoNotMeet: (person, reason) => dispatch(requestDoNotMeet(person, reason)),
    cancelDoNotMeet: (person) => dispatch(cancelDoNotMeet(person)),
    changeMeetingWithPerson: (person) => dispatch(changeMeetingWithPerson(person))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDialog)