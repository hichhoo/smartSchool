import React from "react";
import Flex from "@/components/Flex";
import PropTypes from "prop-types";

export default class Rate extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      mValue: 0,
    }
  }

  ///////////////////////////////// 逻辑方法

  /**
   * 选择触发
   * @param index
   */
  onChange = (index) => {
    const {disabled = false} = this.props;
    if (disabled) {
      return;
    }
    this.setState({mValue: index}, () => {
      const {onChange} = this.props;
      onChange && onChange(index);
    })
  };

  ///////////////////////////////// 页面渲染

  render() {
    const {mValue} = this.state;
    const {value, size = 14, count = 5} = this.props;
    let cValue = value || mValue;
    let imgs = [];
    for (let i = 1; i <= count; i++) {
      imgs.push(<img
        alt={''} key={i} style={{width: size, height: size}} onClick={this.onChange.bind(this, i)}
        src={i <= cValue ? require('./icon_star.png') : require('./icon_star_nor.png')}
      />)
    }
    return <Flex alignItems={"center"}>
      {imgs}
    </Flex>

  }
}

Rate.propTypes = {
  size: PropTypes.number,
  count: PropTypes.number,
  value: PropTypes.number,
  onChange: PropTypes.any,
  disabled: PropTypes.bool,
};
