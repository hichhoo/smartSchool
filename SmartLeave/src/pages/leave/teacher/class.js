import React from "react";
import PageContainer from "@/components/PageContainer";
import Flex from "@/components/Flex";
import request from "@/https/request";
import AppCommon from "@/utils/AppCommon";
import statLess from './stat.less';
import Common from "@/utils/Common";

const LeaveState = {
  '-1': '未填写',
  '0': '留校',
  '1': '离校',
};

const ArriveState = {
  '0': '未到家',
  '1': '已到家',
};

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

  /////////////////////////////////// 逻辑方法

  /**
   * 获取详情
   */
  getLsSituation() {
    let {query} = this.props.location;
    let params = {
      ...query, leave_id: query.leave_id,
      type: Common.initValue(query.type, '1'),
    };
    AppCommon.showLoading('加载中');
    request('/api/Leave/manager_get_ls_detail', {method: 'POST', data: params}).then(res => {
      AppCommon.hideMessage();
      if (res.code === 200) {
        this.setState({statList: res.data});
      } else {
        AppCommon.showRespError(res);
      }
    })
  }


  /**
   * 跳转到下一级
   * @param item
   */
  goNextStat(item) {
    const {query} = this.props.location;
    let params = {
      id: query.leave_id, student_id: item.student_id,
      is_show_arrive: query.is_show_arrive, is_show_stay: query.is_show_stay
    };
    AppCommon.routerPush('/leave/add', params);
  }

  /////////////////////////////////// 页面渲染

  /**
   * 渲染列表
   */
  renderList() {
    let {query} = this.props.location;
    const {statList} = this.state;
    return <Flex direction={"column"}>
      {statList.map(item => {
        return <Flex
          direction={"column"} key={item.student_id} className={statLess.item}
          onClick={() => this.goNextStat(item)}
        >
          <Flex className={statLess.itemHeader}>{item.name}({item.student_id})</Flex>
          <Flex className={statLess.itemBody} direction={"column"}>
            <Flex className={statLess.bodyItem}>
              <Flex itemGrow={1}>离校状态</Flex>
              <Flex>{LeaveState[item.state]}</Flex>
            </Flex>
            {query.is_show_arrive == '1' && item.state == '1' && <Flex className={statLess.bodyItem}>
              <Flex itemGrow={1}>是否到家</Flex>
              <Flex>{ArriveState[item.arrive_state]}</Flex>
            </Flex>}
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
