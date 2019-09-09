import React from 'react';
import request from "@/https/request";
import PageContainer from "@/components/PageContainer/index";
import Flex from "@/components/Flex/index";
import courseLess from './index.less';
import AppCommon from "@/utils/AppCommon";
import {Tabs} from "antd-mobile";
import ListContainer from "@/components/ListContainer";
import {getMoment} from "@/components/DateView";
import {Weekend} from "@/pages/psychology/timetable";
import {ApplyState} from "@/pages/psychology/mine";

const NeedHandle = {
  '0': '全部',
  '1': '待审批'
};

export default class apply extends React.PureComponent {

  constructor(props, context) {
    super(props, context);
    this.state = {
      loading: true,
      modules: [],
      need_handle: '0'
    }
  }

  componentDidMount() {
    this.getApplyList();
  }

  //////////////////// 逻辑方法

  /**
   * 获取模块
   */
  getApplyList = () => {
    const {need_handle, loading} = this.state;
    !loading && AppCommon.showLoading('获取中');
    request('/api/Psychology/teacher_get_apply', {method: 'POST', data: {need_handle}}).then(res => {
      AppCommon.hideMessage();
      if (res.code === 200) {
        this.setState({modules: res.data, loading: false});
      } else {
        AppCommon.showRespError(res);
      }
    })
  };


  /**
   * 审核预约
   */
  judgeApply = (item) => {

  };


  //////////////////// 页面渲染

  renderList() {
    const {modules} = this.state;
    return <ListContainer count={modules.length}>
      <Flex direction={"column"} style={{marginTop: 6}}>
        {modules.map(item => {
          let dayMoment = getMoment(item.day);
          let btns = [];
          if (item.state == '1') {
            btns.push(<Flex
              className={courseLess.itemBtnJudge} key={1}
              onClick={this.judgeApply.bind(this, item)}
            >审批预约</Flex>)
          }

          return <Flex
            key={item.id} className={courseLess.applyItem} direction={"column"}
          >
            <Flex>学生姓名：{item.name}({item.student_id})</Flex>
            <Flex>日期：{dayMoment.format('YYYY-MM-DD')}, {Weekend[dayMoment.format('E')].name}</Flex>
            <Flex>时间段：{item.time}</Flex>
            <Flex>预约号码：{item.index}</Flex>
            <Flex>状态：{ApplyState[item.state]}</Flex>
            <Flex className={courseLess.itemControl} justify={"flex-end"}>
              {btns}
              <Flex
                className={courseLess.itemBtnDetail}
                onClick={() => AppCommon.routerPush('/psychology/teacher/detail', item)}
              >预约详情</Flex>
            </Flex>
          </Flex>
        })}
      </Flex>
    </ListContainer>
  }

  render() {
    const {loading, need_handle} = this.state;
    return <PageContainer title={'预约记录'} loading={loading}>
      <Flex direction={"column"} className={courseLess.apply}>
        <Tabs
          page={parseInt(need_handle)}
          tabs={Object.keys(NeedHandle).map(key => {
            return {title: NeedHandle[key], value: key};
          })}
          onTabClick={tab => {
            this.setState({need_handle: tab.value}, this.getApplyList)
          }}
        />
        {this.renderList()}
      </Flex>
    </PageContainer>
  }

}

