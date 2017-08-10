import React from 'react';
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';

import {colors} from 'styles/colors';

const ALPHABETS = "abcdefghijklmnopqrstuvwxyz".split('');

export default class AlphabetFilter extends React.Component {
  state = {
    selected: null
  };

  render() {
    return (
      <div style={{
        overflowY: 'auto',
        borderRight: 'solid 1px #cccdcd',
        minWidth: 50,
        height: 'inherit',
        display: this.props.show ? '' : 'none'
      }}>
        <List>
          {ALPHABETS.map((ab, ndx) => (
            <ListItem
              key={ab}
              innerDivStyle={{padding: '5px 10px'}}
              onTouchTap={(e) => {
                e.preventDefault();
                if (ab === this.state.selected) {
                  this.setState({selected: null});
                  this.props.limitResultsToAB(null);
                }
                else {
                  this.setState({selected: ab});
                  this.props.limitResultsToAB(ab);
                }
              }}
            >
              <Avatar
                color='#2d2d2d'
                backgroundColor={this.state.selected === ab ? colors.orange1 : 'transparent'}
                size={30} style={{fontSize: 14}}>{ab.toUpperCase()}</Avatar>
            </ListItem>
          ))}
        </List>
      </div>
    );
  }
}
