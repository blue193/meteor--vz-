import React from 'react';
import {connect} from 'react-redux';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import Subheader from 'material-ui/Subheader';

import Loader from '_components/Loader';
import BetterAvatar from '_components/BetterAvatar';
import Button from '_components/Button';
import {renderIfElse} from 'lib/renderThunk';
import Api from 'lib/api';
import {printDiv} from 'lib/print';
import {colors} from 'styles/colors';

import {requestMeeting} from 'actions/event'
import {cancelMeetingRequest} from 'actions/event'
import {changeDoNotMeetPerson} from 'actions/modals'
import {changeDoNotMeetReason} from 'actions/modals'
import {requestDoNotMeet} from 'actions/event'
import {cancelDoNotMeet} from 'actions/event'

let ProfilePanel = class extends React.Component {
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
      this.setState({profileLoaded: false, questionsLoaded: false})
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
  }

  renderButtons = (person) => {
    return renderIfElse(!person.doNotMeet)(() => (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <Button
            size="small"
            label="DO NOT MEET"
            onClick={() => {
              this.props.changeDoNotMeetPerson(person);
            }}
            style={{marginBottom: 10}}
          />
          <Button
            size="small"
            primary
            label={person.requested ? "CANCEL REQUEST" : "REQUEST"}
            style={{ marginBottom: 10}}
            onClick={() => {
              if (person.requested) {
                this.props.cancelMeetingRequest(person);
              } else {
                this.props.requestMeeting(person);
              }
            }}
          />
          <Button
            size="small"
            label="PRINT USER PROFILE"
            style={{marginBottom: 10}}
            onClick={() => {
              printDiv('div_print');
            }}
          />
        </div>
      ), () => (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <Button
            size="small"
            label="CANCEL DO NOT MEET"
            style={{marginBottom: 10}}
            onClick={() => {
              this.props.cancelDoNotMeet(person);
            }}
          />
          <Button
            size="small"
            label="PRINT USER PROFILE"
            style={{marginBottom: 10}}
            onClick={() => {
              printDiv('div_print');
            }}
          />
        </div>
      )
    )
  }

  render() {
    if (!this.props.person) {
      return <div/>;
    }

    const profile = this.state.profile;
    const questions = this.state.questions;

    return (
      <div id="div_print" style={{
        overflowY: 'auto',
        maxWidth: 300,
        height: '100%',
        backgroundColor: '#fafafa',
        borderLeft: 'solid 1px #cccdcd'
      }}>
        <div style={{position: 'absolute', right: 0}}>
          <IconButton
            iconStyle={{width: 36, height: 36, fontSize: 36}}
            style={{width: 72, height: 72, padding: 16}}
            onTouchTap={(e) => {
              e.preventDefault();
              this.props.closePanel();
            }}>
            <FontIcon className="icon icon-arrows-remove"
                      style={{color: 'inherit', transition: 'none', fontSize: 16}}/>
          </IconButton>
        </div>
        {renderIfElse(!this.state.questionsLoaded || !this.state.profileLoaded)(() => (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: 100,
            width: 299
          }}>
            <Loader />
          </div>
        ), () => (
          <div style={{
            padding: '50px 30px 30px',
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            <BetterAvatar size={120}
                    src={this.props.person.image}
                    firstName={this.props.person.firstName}
                    lastName={this.props.person.lastName}/>
            <div style={{
              color: colors.grey1,
              fontSize: 24,
              fontWeight: 'bold',
              textAlign: 'center'
            }}>{profile.firstName} {profile.lastName}</div>
            <p
              style={{
                color: colors.grey4,
                fontSize: 18,
                marginTop: 10,
                textAlign: 'center'
              }}>
              {profile.title}{(profile.company ? ` at ${profile.company}` : '')}
            </p>
            <div style={{marginBottom: 20}}>
              <a style={{display: 'inline-block'}} href="#"><img src="img/charlie.png" role="presentation" /></a>
              <a style={{display: 'inline-block', marginLeft: 10}} href="#"><img src="img/accompany.png" role="presentation" /></a>
              <a style={{display: 'inline-block', marginLeft: 10}} href="#"><img src="img/linked_in.png" role="presentation" /></a>
            </div>
            {this.renderButtons(this.props.person)}
            <p
              style={{
                color: colors.grey4,
                fontSize: 14,
                fontWeight: 300,
                textAlign: 'center'
              }}>
                Phone: {profile.phone}<br></br>
                Website: {profile.website}<br></br>
                Email: {profile.email}<br></br>
                Location: {profile.address.city}, {profile.address.state}<br></br></p>

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
      </div>
    );
  }
}

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
    cancelDoNotMeet: (person) => dispatch(cancelDoNotMeet(person))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePanel)
