import React from 'react';
import {connect} from 'react-redux';
import TextField from 'material-ui/TextField';
import {changeSearchTerm} from 'actions/global';


let SearchBar = (props, context) => (
  props.showSearchPanel ?
  <div
    style={{
      borderBottom: 'solid 1px #cccdcd',
      padding: '0 20px'
    }}>
    <TextField
      hintText="Search"
      hintStyle={{fontSize: 14}}
      fullWidth={true}
      underlineShow={false}
      onChange={(e) => {
        props.changeSearchTerm(e.target.value)
      }}
    />
  </div> : <div/>
);

const mapStateToProps = (state) => {
  return {
    showSearchPanel: state.panels.showSearchPanel
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeSearchTerm: (text) => dispatch(changeSearchTerm(text))
  };
};

SearchBar = connect(mapStateToProps, mapDispatchToProps)(SearchBar);

export default SearchBar;
