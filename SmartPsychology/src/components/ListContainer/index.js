import React from "react";
import Flex from "@/components/Flex";
import PropTypes from "prop-types";

export default class ListContainer extends React.PureComponent {

  render() {
    const {count = 0, tips = '暂无数据'} = this.props;

    return <div style={{height: '100%'}}>
      {count > 0 ? this.props.children : <Flex
        direction={"column"} style={{padding: '20% 0'}} alignItems={"center"} justify={"center"}
      >
        <img alt={'logo'} src={require('./icon_empty.png')} style={{width: '20%'}}/>
        <div style={{marginTop: 12, color: '#ababab', fontSize: 12}}>{tips}</div>
      </Flex>}
    </div>
  }
}

ListContainer.propTypes = {
  count: PropTypes.number,
  tips: PropTypes.string,
};





