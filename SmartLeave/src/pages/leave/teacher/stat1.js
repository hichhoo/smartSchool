import React from "react";
import PageContainer from "@/components/PageContainer";
import Flex from "@/components/Flex";
import request from "@/https/request";
import AppCommon from "@/utils/AppCommon";
import statLess from './stat.less';
import Common from "@/utils/Common";

export default class stat1 extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      statList: [],
    }
  }

  componentDidMount() {
    this.getLsSituation();
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    if (this.props.location.search !== nextProps.location.search) {
      this.getLsSituation(nextProps);
    }
    return true;
  }

  /////////////////////////////////// 逻辑方法

  /**
   * 获取详情
   */
  getLsSituation(props) {
    let {query} = (props || this.props).location;
    let params = {
      ...query, leave_id: query.leave_id,
      type: Common.initValue(query.type, '1'),
    };
    AppCommon.showLoading('加载中');
    request('/api/Leave/get_ls_situation', {method: 'POST', data: params}).then(res => {
      AppCommon.hideMessage();
      if (res.code === 200) {
        this.setState({statList: res.data});
      } else {
        AppCommon.showRespError(res);
        AppCommon.routerBack();
      }
    })
  }


  /**
   * 跳转到下一级
   * @param item
   */
  goNextStat(item) {
    let {query} = this.props.location;
    let type = Common.initValue(query.type, '1');
    let params = {...query, type: parseInt(type, 10) + 1};
    if (type == 1) {
      params.campus_id = item.id;
    } else if (type == 2) {
      params.department_id = item.id;
    } else if (type == 3) {
      params.profession_id = item.id;
    }
    if (type <= 3) {
      AppCommon.routerPush('/leave/teacher/stat1', params);
    } else {
      params.class_id = item.id;
      AppCommon.routerPush('/leave/teacher/class', params);
    }
  }

  /////////////////////////////////// 页面渲染

  /**
   * 渲染列表
   */
  renderList() {
    const {statList} = this.state;
    return <Flex direction={"column"}>
      {statList.map(item => {
        return <Flex
          direction={"column"} key={item.id} className={statLess.item}
          onClick={() => this.goNextStat(item)}
        >
          <Flex className={statLess.itemHeader}>{item.name}(点击查看详情)</Flex>
          <Flex className={statLess.itemBody} direction={"column"}>
            <Flex className={statLess.bodyItem}>
              <Flex itemGrow={1}>未参加统计人数</Flex>
              <Flex>{item.noWrite}</Flex>
            </Flex>
            <Flex className={statLess.bodyItem}>
              <Flex itemGrow={1}>离校人数</Flex>
              <Flex>{item.leave}</Flex>
            </Flex>
            <Flex className={statLess.bodyItem}>
              <Flex itemGrow={1}>留校人数</Flex>
              <Flex>{item.stay}</Flex>
            </Flex>
          </Flex>
        </Flex>
      })}
    </Flex>
  }

  render() {
    return <PageContainer title={'离校统计'} loading={false}>
      <Flex direction={"column"}>
        {this.renderList()}
      </Flex>
    </PageContainer>
  }

}
