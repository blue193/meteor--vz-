import React from 'react';
import Loader from '_components/Loader';
import Api from 'lib/api';
import Subheader from 'material-ui/Subheader';
import styles from './index.css';

export default class extends React.Component {
  state = {
    loaded: false,
    questions: []
  }

  componentDidMount() {
    Api
      .getQuestionResponses(this.props.id ? { userId: this.props.id } : {})
      .then(questions => {
        this.setState({ questions, loaded: true });
        if (this.props.questionsLoaded) {
          this.props.questionsLoaded();
        }
      });
  }

  render() {
    if (!this.state.loaded) {
      return <Loader />;
    }

    return (
      <form className={styles.container}>
        {this.state.questions.map((question) => {
          if (question.typeText) {
            return (
              <div key={question.id}>
                <Subheader style={{padding:0, lineHeight: 1.5, margin: '10px 0'}}>{question.prompt}</Subheader>
                <p>{question.answer.response}</p>
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
                <Subheader style={{padding:0, lineHeight: 1.5, margin: '10px 0'}}>{question.prompt}</Subheader>
                {options.map(option => {
                  return (
                    <p key={option.id}>{option.text}</p>
                  );
                })}
              </div>
            );
          }
        })}
      </form>
    );
  }
}
