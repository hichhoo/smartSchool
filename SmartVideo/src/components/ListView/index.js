import React from "react";
import Flex from "@/components/Flex";
import {ActivityIndicator} from "antd-mobile";


export default class index extends React.Component {

  constructor(props, context) {
    super(props, context);
    const {pageSize = 10} = this.props;
    this.state = {
      pageNo: 1, pageSize,
      moreStatus: 0, // 0-还有更多，1-正在加载中，2-没有更多
    };
  }

  componentDidMount() {
    this.addScrollListener();
  }

  ///////////////////////////////////// 逻辑方法

  /**
   * 添加滑动监听
   */
  addScrollListener() {
    window.addEventListener("scroll", (e) => {
      let loadMore = document.getElementById('loadMore');
      if (loadMore) {
        let top = loadMore.getBoundingClientRect().top;
        let windowHeight = window.innerHeight;
        let isShowing = top - windowHeight < 0;
        if (isShowing) {
          this.doLoadMore();
        }
      }
    }, false)
  }

  /**
   * 触发加载更多
   */
  doLoadMore() {
    const {onLoadMore} = this.props;
    const {pageNo, pageSize, moreStatus} = this.state;
    if (moreStatus !== 0) {
      return;
    }
    if (onLoadMore) {
      this.setState({moreStatus: 1});
      let pageObj = {pageNo: pageNo + 1, pageSize};
      let promiseObj = onLoadMore(pageObj);
      try {
        promiseObj.then(res => {
          let currentTotal = this.props.children.length;
          this.setState({
            ...pageObj,
            moreStatus: currentTotal < pageObj.pageNo * pageObj.pageSize ? 2 : 0
          });
        }).catch(e => {
          this.setState({moreStatus: 2});
        })
      } catch (e) {
        this.setState({moreStatus: 2});
      }
    }
  }


  ///////////////////////////////////// 页面渲染

  render() {
    const {moreStatus} = this.state;
    const {children} = this.props;

    let moreView = '';
    if (moreStatus === 2) {
      moreView = <Flex
        justify={"center"} alignItems={"center"} style={{height: 40}}
      >我是有底线的</Flex>;
    } else {
      moreView = <Flex
        justify={"center"} alignItems={"center"} style={{height: 40}}>
        <ActivityIndicator text={'正在加载中'}/>
      </Flex>
    }

    return <div>
      {children}
      {children.length > 0 &&
      <div id={'loadMore'}>{moreView}</div>
      }
    </div>

  }

}
