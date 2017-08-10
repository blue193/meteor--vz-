import React from 'react';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import Checkbox from 'material-ui/Checkbox';

import Api from 'lib/api';
import {renderIfElse} from 'lib/renderThunk';
import Loader from '_components/Loader';
import {searchQuery} from 'actions/event';
import {connect} from 'react-redux';

const styles = {
  wrapper: {
    overflowY: 'auto',
    borderRight: 'solid 1px #cccdcd',
    minWidth: 225,
    height: 'inherit'
  },
  questionList: {
    root: {
      padding: '30px 10px'
    },
    subHeader: {
      maxWidth: 230,
      lineHeight: '20px',
      color: '#3a3a3a',
      fontSize: 13,
      marginBottom: 10
    },
    listItem: {
      root: {
        fontSize: 12,
        color: '#3a3a3a',
        lineHeight: 0
      },
      innerDiv: {
        padding: '16px 16px 16px 45px'
      }
    }
  }
};

class SideFilter extends React.Component {
  state = {
    loaded: false,
    questions: [],
    checkedResults: {},
  };

  componentDidMount() {
    Api
      .getFilters()
      .then(questions => {
        this.setState({questions, loaded: true});
      });
  }

  componentWillReceiveProps(nextProps) {
  }

  filterResults = (checkedList) => {
    console.log(checkedList);
    // not ideal!
    const qas = Object.keys(checkedList).reduce((res, k) => {
      const answerIds = Object.keys(checkedList[k]);
      if (!answerIds.some(id => !!checkedList[k][id])) return res;
      return res + ';' + k + ':' + answerIds.reduce((res1, k1) => {
          return checkedList[k][k1] ? (res1 + k1 + ',') : res1;
        }, '');
    }, '');

      this.props.searchQuery(qas);

  };

  render() {
    return (
      <div style={{...styles.wrapper, display: this.props.show ? '' : 'none'}}>
        {renderIfElse(!this.state.loaded)(() => (
          <Loader />
        ), () => (
          <div>
            {this.state.questions.filter(q => !q.typeText).map((question) => {
              // treat checkbox and radio as the same
              return (
                <div key={question.id}>
                  <List style={styles.questionList.root}>
                    <Subheader
                      style={styles.questionList.subHeader}>{question.prompt}</Subheader>
                    {question.options.map(option => {
                      const checked = (this.state.checkedResults[question.id] && this.state.checkedResults[question.id][option.id]) || false;
                      return (
                        <ListItem
                          key={option.id}
                          innerDivStyle={styles.questionList.listItem.innerDiv}
                          style={styles.questionList.listItem.root}
                          primaryText={option.text}
                          leftCheckbox={<Checkbox style={{top: 4}} checked={checked} onCheck={(e, val) => {
                              // e.preventDefault();
                              const checkedList = {
                                checkedResults: {
                                  ...this.state.checkedResults,
                                  [question.id]: {
                                    ...this.state.checkedResults[question.id],
                                    [option.id]: val,
                                  },
                                },
                              };
                              this.setState(checkedList);
                              this.filterResults(checkedList.checkedResults);
                            }}/>}
                        />
                      );
                    })}
                  </List>
                  <Divider style={{backgroundColor: '#cccdcd'}}/>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
    return {
        searchQuery: (qas) => dispatch(searchQuery(qas))
    }
};

export default connect(null, mapDispatchToProps)(SideFilter)