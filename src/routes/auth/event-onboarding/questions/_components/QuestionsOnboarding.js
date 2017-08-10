import React from 'react';
import {Step, Stepper, StepLabel, StepContent} from 'material-ui/Stepper';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';

import Api from 'lib/api';
import Session from 'lib/session';
import Button from '_components/Button';

export default class extends React.Component {
  static contextTypes = {
    router: React.PropTypes.any,
  }

  state = {
    questions: [],
    answers: {},
    stepIndex: 0,
  };

  canSubmit() {
    return true;
  }

  setStateAndPersist(state) {
    Session.saveState(Session.QUESTIONS_STATE, { ...this.state, state });
    this.setState(state);
  }

  componentDidMount() {
    const persistedState = Session.loadState(Session.QUESTIONS_STATE);
    const retryCount = Session.loadState(Session.QUESTIONS_COMPLETED).count || false;

    Api
    .getQuestionResponses()
    .then(questions => {
      const answers = questions.reduce((memo, next) => {
        if (next.answer.option) {
          memo[next.id] = { option: next.answer.option, type: 'radio' };
        } else if (next.answer.response) {
          memo[next.id] = { response: next.answer.response, type: 'text' };
        } else if (next.answer.options.length) {
          memo[next.id] = { options: next.answer.options, type: 'checkbox' };
        }
        return memo;
      }, {});

      const fullState = { ...persistedState, questions, answers: { ...answers, ...persistedState.answers } };
      this.setState(fullState);

      if (retryCount && retryCount < 3) {
        this._submitState(fullState);
      }
    });
  }

  handleNext = () => {
    this.setStateAndPersist({stepIndex: this.state.stepIndex + 1});
  };

  handlePrev = () => {
    this.setStateAndPersist({stepIndex: this.state.stepIndex - 1});
  };

  jumpTo = (stepIndex) => {
    this.setStateAndPersist({stepIndex})
  };

  renderStepActions(step) {
    const {stepIndex} = this.state;

    return (
      <div style={{margin: '12px 0'}}>
        <Button
          primary
          size="small"
          disabled={stepIndex === this.state.questions.length - 1 && !this.canSubmit()}
          label={stepIndex === this.state.questions.length - 1 ? 'Finish' : 'Next'}
          onClick={this.handleNext}
          style={{marginRight: 12}}
        />
        {stepIndex > 0 && (
          <Button
            label="Back"
            disabled={stepIndex === 0}
            size="small"
            onClick={this.handlePrev}
          />
        )}
      </div>
    );
  }

  updateCheckbox = (question, option) => (e, val) => {
    const existingAnswer = this.state.answers[question.id] || { options: [], type: 'checkbox' };
    const updatedAnswer = val ?
      { type: 'checkbox', options: existingAnswer.options.concat(option.id) } :
      { type: 'checkbox', options: existingAnswer.options.filter((id) => id !== option.id) };

    this.setStateAndPersist({
      answers: {
        ...this.state.answers,
        [question.id]: updatedAnswer,
      },
    });
  }

  checkboxState = (question, option) => {
    const existing = this.state.answers[question.id];
    if (!existing) return false;
    return existing.options.indexOf(option.id) !== -1;
  }

  updateRadio = (question) => (e, val) => {
    this.setStateAndPersist({
      answers: {
        ...this.state.answers,
        [question.id]: { option: val, type: 'radio' },
      },
    });
  }

  radioState = (question) => {
    const existing = this.state.answers[question.id];
    if (!existing) return null;
    return existing.option;
  }

  updateText = (question) => (e, val) => {
    this.setStateAndPersist({
      answers: {
        ...this.state.answers,
        [question.id]: { response: val, type: 'text' },
      },
    });
  }

  textState = (question) => {
    const existing = this.state.answers[question.id];
    if (!existing) return '';
    else return existing.response;
  }

  _submitState(state) {
    const previousRetries = Session.loadState(Session.QUESTIONS_COMPLETED).count || 0;
    Session.saveState(Session.QUESTIONS_COMPLETED, { count: previousRetries + 1 });

    const responses = Object.keys(state.answers).map((questionId) => {
      return {
        ...this.state.answers[questionId],
        questionId,
      };
    });

    Api
      .answerQuestions(responses)
      .then(() => {
        Session.removeState(Session.QUESTIONS_COMPLETED);
        Session.removeState(Session.QUESTIONS_STATE);
        if (this.props.onSave) this.props.onSave();
      });
  }

  submit = () => {
    if (this.canSubmit()) {
      this._submitState(this.state);
    }
  }

  renderQuestionOptions = (question) => {
    if (question.typeCheckbox) {
      return (
        <div>
          {question.options.map(option => (
            <Checkbox
              key={option.id} label={option.text}
              checked={this.checkboxState(question, option)}
              onCheck={this.updateCheckbox(question, option)}
              />
          ))}
        </div>
      );
    } else if (question.typeRadio) {
      return (
        <RadioButtonGroup
          name={question.id}
          valueSelected={this.radioState(question)}
          onChange={this.updateRadio(question)}
          >
          {question.options.map(option => (
            <RadioButton
              key={option.id}
              label={option.text}
              value={option.id} />
          ))}
        </RadioButtonGroup>
      );
    } else {
      return (
        <div>
          <TextField
            onChange={this.updateText(question)}
            value={this.textState(question)}
            multiLine={true}
            />
        </div>
      );
    }
  };

  renderQuestions = (questions) => {
    return questions.map((question, ndx) => {
      return (
        <Step key={question.id} style={{marginTop: 6}}>
          <StepLabel onTouchTap={() => this.jumpTo(ndx)} style={{height: 'auto', cursor: 'pointer'}}>
            {question.prompt}
          </StepLabel>
          <StepContent style={{marginTop: 6}}>
            {this.renderQuestionOptions(question)}
            {this.renderStepActions(0)}
          </StepContent>
        </Step>
      );
    });
  };

  render() {
    const {stepIndex, questions} = this.state;
    if (questions.length === 0) return <div/>;
    const finished = stepIndex >= questions.length;
    const canSubmit = this.canSubmit();

    return (
      <form>
        <Stepper linear={false} activeStep={stepIndex} orientation="vertical">
          {this.renderQuestions(questions)}
        </Stepper>
        {finished && (
          <Button
            primary
            style={{marginTop: 10, width: '100%'}}
            label={this.props.buttonText}
            onClick={this.submit}
            disabled={!canSubmit}
          />
        )}
      </form>
    );
  }
}
