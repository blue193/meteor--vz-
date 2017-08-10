import React from 'react';
import MediaQuery from 'react-responsive';

export const makeResponsiveGridList = (Component) => {
  return class Wrapped extends React.Component {
    constructor () {
      super(...arguments);
      this.state = { ...this.state }
    }
    render () {
      const props = Object.assign({}, this.props);
      delete props['subCols'];
      return (
        <div style={{width: '100%'}}>
          <MediaQuery query='(min-device-width: 2424px)'>
            <Component { ...props } { ...this.state } cols={5 - this.props.subCols} />
          </MediaQuery>
          <MediaQuery query='(min-device-width: 1720px) and (max-device-width: 2424px)'>
            <Component { ...props } { ...this.state } cols={4 - this.props.subCols} />
          </MediaQuery>
          <MediaQuery query='(min-device-width: 1360px) and (max-device-width: 1720px)'>
            <Component { ...props } { ...this.state } cols={3 - this.props.subCols} />
          </MediaQuery>
          <MediaQuery query='(min-device-width: 624px) and (max-device-width: 1360px)'>
            <Component { ...props } { ...this.state } cols={this.props.subCols >= 2 ? 1 : 2 - this.props.subCols} />
          </MediaQuery>
          <MediaQuery query='(max-device-width: 624px)'>
            <Component { ...props } { ...this.state } cols={1} />
          </MediaQuery>
        </div>
      );
    }
  }
};

export default makeResponsiveGridList;