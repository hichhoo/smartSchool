import React from 'react';
import request, {getLoginInfo} from "@/https/request";
import PageContainer from "@/components/PageContainer/index";
import Flex from "@/components/Flex/index";
import courseLess from './timetable.less';
import AppCommon from "@/utils/AppCommon";
import Common from "@/utils/Common";
import {getMoment} from "@/components/DateView";
import ListContainer from "@/components/ListContainer";
import {Modal} from "antd-mobile";

export const Weekend = {
  '0': {sub: '全', name: '全'},
  '1': {sub: '一', name: '星期一'},
  '2': {sub: '二', name: '星期二'},
  '3': {sub: '三', name: '星期三'},
  '4': {sub: '四', name: '星期四'},
  '5': {sub: '五', name: '星期五'},
  '6': {sub: '六', name: '星期六'},
  '7': {sub: '日', name: '星期天'},
};

export default class teachers extends React.PureComponent {

  constructor(props, context) {
    super(props, context);
    this.userInfo = getLoginInfo();
    let teacher_id = Common.getParamFormUrl('teacher_id');
    this.state = {
      teacher_id: Common.initValue(teacher_id, this.userInfo.id),
      teacher: {},
      time: [],
      week: 0,
    }
  }

  componentDidMount() {
    this.getTimetable();
  }

  //////////////////// 逻辑方法

  /**
   * 获取模块
   */
  getTimetable = () => {
    const {teacher_id, week} = this.state;
    request('/api/Psychology/student_get_timetable', {method: 'POST', data: {teacher_id}}).then(res => {
      if (res.code === 200) {
        let time = res.data.time.filter(item => {
          if (week == 0) {
            return true;
          }
          return week == getMoment(item.day).format('E');
        });
        this.setState({teacher: res.data.teacher, time, loading: false});
      } else {
        AppCommon.showRespError(res);
      }
    })
  };

  /**
   * 提交预约
   */
  studentApply = (item) => {
    let params = {p_id: item.id, apply_reason: ''};
    Modal.alert('请输入预约原因', <Flex direction={"column"}>
      <textarea
        placeholder={'请输入预约原因'} rows={3} className={courseLess.textArea}
        onChange={e => {
          params.apply_reason = e.target.value;
        }}
      />
    </Flex>, [
      {text: '取消'},
      {
        text: '确定', onPress: () => {
          AppCommon.showLoading('预约中');
          request('/api/Psychology/student_apply', {method: 'POST', data: params}).then(res => {
            if (res.code === 200) {
              AppCommon.showToast('预约成功');
              this.getTimetable();
            } else {
              AppCommon.showRespError(res);
            }
          })
        }
      },
    ], 'android')
  };

  /**
   * 预约详情
   * @param item
   */
  goApplyDetail = (item) => {
    // TODO
  };


  //////////////////// 页面渲染

  /**
   * 渲染周选择
   */
  renderWeekend() {
    const {week} = this.state;
    let weekItem = [];
    for (let i = 0; i < 8; i++) {
      weekItem.push(<Flex
        key={i} className={week == i ? courseLess.weekItemSel : courseLess.weekItem}
        justify={"center"} alignItems={"center"}
        onClick={() => this.setState({week: i}, this.getTimetable)}
      >
        {Weekend[i].sub}
      </Flex>)
    }

    return <Flex className={courseLess.week} justify={"space-between"}>
      {weekItem}
    </Flex>
  }

  /**
   * 预约时间
   * @returns {*}
   */
  renderTimeList() {
    const {time} = this.state;
    return <ListContainer count={time.length} tips={'暂无排班哦'}>
      <Flex direction={"column"}>
        {time.map(item => {
          let dayMoment = getMoment(item.day);
          let controlFlex = undefined;
          if (this.userInfo.user_type == '1' && Common.isEmpty(item.student_id)) {
            controlFlex = <Flex className={courseLess.itemBtn} onClick={this.studentApply.bind(this, item)}>点击预约</Flex>
          }
          if (this.userInfo.user_type == 2 && !Common.isEmpty(item.student_id)) {
            controlFlex = <Flex
              className={courseLess.itemBtnDetail}
              onClick={this.goApplyDetail.bind(this, item)}>预约详情</Flex>
          }

          return <Flex
            key={item.id} className={courseLess.timeItem} direction={"column"}
          >
            <Flex>日期：{dayMoment.format('YYYY-MM-DD')} {Weekend[dayMoment.format('E')].name}</Flex>
            <Flex>时间段：{item.time}</Flex>
            <Flex>预约号码：{item.index}</Flex>
            <Flex>状态：{Common.isEmpty(item.student_id) ? '可预约' : '已预约'}</Flex>

            <Flex className={courseLess.itemControl} justify={"flex-end"}>
              {controlFlex}
            </Flex>

          </Flex>
        })}
      </Flex>
    </ListContainer>
  }


  render() {
    const {loading, teacher} = this.state;
    return <PageContainer title={'排班表'} loading={loading}>
      <Flex direction={"column"} className={courseLess.timetable}>
        <Flex direction={"column"} className={courseLess.header}>
          <Flex>{teacher.teacher_name}</Flex>
          <Flex>联系电话：{teacher.office_phone}</Flex>
          <Flex>个人简介：{teacher.introduction}</Flex>
        </Flex>
        {this.renderWeekend()}
        {this.renderTimeList()}
      </Flex>
    </PageContainer>
  }

}
