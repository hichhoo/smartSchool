import React from "react";
import radioNor from './radio_nor.png';
import radioSel from './radio_sel.png';
import PropTypes from "prop-types";

export default class Radio extends React.Component {

  render() {
    const {checked, size = 24} = this.props;
    return <img alt={'radio'} src={checked ? radioSel : radioNor} style={{width: size, height: size}}/>
  }

}

Radio.propTypes = {
  size: PropTypes.number,
  checked: PropTypes.bool,
};
