import React from "react";
import Flex from "@/components/Flex";

export default class ListContainer extends React.PureComponent {

  render() {
    const {count = 0, tips = '暂无数据'} = this.props;

    return <div style={{height: '100%'}}>
      {count > 0 ? this.props.children : <Flex
        direction={"column"} style={{height: '40%'}} alignItems={"center"} justify={"center"}
      >
        <img alt={'logo'} src={require('./icon_empty.png')} style={{width: '20%'}}/>
        <div style={{marginTop: 16, color: '#ababab'}}>{tips}</div>
      </Flex>}
    </div>
  }

}





