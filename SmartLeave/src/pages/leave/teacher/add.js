import React from "react";
import PageContainer from "@/components/PageContainer";
import Flex from "@/components/Flex";
import addLess from './add.less';
import {DatePicker} from "antd-mobile";
import moment from "moment";
import Common from "@/utils/Common";
import AppCommon from "@/utils/AppCommon";
import request from "@/https/request";
import {dateToSeconds} from "@/components/DateView";

export default class add extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      name: '',
      start_time: undefined, end_time: undefined,
      student_leave_time: undefined, student_back_time: undefined,
      is_show_stay: 1, is_show_arrive: 1,
    }
  }

  ///////////////////////////// 逻辑方法

  /**
   * 提交
   */
  submit = () => {
    const {
      name, start_time, end_time, student_leave_time, student_back_time,
      is_show_stay, is_show_arrive
    } = this.state;
    if (Common.isEmpty(name)) {
      AppCommon.showToast('请输入统计名称');
      return;
    }
    if (Common.isEmpty(start_time)) {
      AppCommon.showToast('请选择统计开始时间');
      return;
    }
    if (Common.isEmpty(end_time)) {
      AppCommon.showToast('请选择统计结束时间');
      return;
    }
    if (Common.isEmpty(student_leave_time)) {
      AppCommon.showToast('请选择离校开始时间');
      return;
    }
    if (Common.isEmpty(student_back_time)) {
      AppCommon.showToast('请选择返校截止时间');
      return;
    }
    AppCommon.showLoading('提交中');
    request('/api/Leave/manager_add_ls', {
      method: 'POST',
      data: {
        name, is_show_arrive, is_show_stay,
        start_time: dateToSeconds(start_time), end_time: dateToSeconds(end_time),
        student_back_time: dateToSeconds(student_back_time),
        student_leave_time: dateToSeconds(student_leave_time),
      }
    }).then(res => {
      AppCommon.hideMessage();
      if (res.code === 200) {
        AppCommon.showToast('提交成功', 'success', () => {
          AppCommon.routerBack();
        })
      } else {
        AppCommon.showRespError(res);
      }
    })
  };


  ///////////////////////////// 页面渲染

  render() {
    const {
      name, start_time, end_time, student_leave_time, student_back_time,
      is_show_stay, is_show_arrive
    } = this.state;
    return <PageContainer title={'添加离校统计'} loading={false}>
      <Flex direction={"column"} className={addLess.add}>
        <Flex className={addLess.item}>
          <Flex className={addLess.label}>统计名称：</Flex>
          <Flex itemGrow={1} style={{width: 0}}>
            <input
              placeholder={'请输入统计名称'} value={name}
              onChange={e => this.setState({name: e.target.value})}
            />
          </Flex>
        </Flex>

        <DatePicker
          value={start_time}
          onChange={date => this.setState({start_time: date})}
        >
          <Flex className={addLess.item}>
            <Flex className={addLess.label}>开始时间：</Flex>
            <Flex style={{width: 0}} itemGrow={1}>{
              start_time ? moment(start_time).format('YYYY-MM-DD HH:mm') : '请选择统计开始时间'
            }</Flex>
          </Flex>
        </DatePicker>

        <DatePicker
          value={end_time}
          onChange={date => this.setState({end_time: date})}
        >
          <Flex className={addLess.item}>
            <Flex className={addLess.label}>结束时间：</Flex>
            <Flex style={{width: 0}} itemGrow={1}>{
              end_time ? moment(end_time).format('YYYY-MM-DD HH:mm') : '请选择统计结束时间'
            }</Flex>
          </Flex>
        </DatePicker>

        <Flex className={addLess.item} onClick={() => this.setState({is_show_stay: 1 - is_show_stay})}>
          <Flex className={addLess.label}>留校按钮：</Flex>
          <Flex itemGrow={1} style={{width: 0}}>{is_show_stay == '1' ? '显示' : '不显示'}</Flex>
        </Flex>
        <Flex className={addLess.item} onClick={() => this.setState({is_show_arrive: 1 - is_show_arrive})}>
          <Flex className={addLess.label}>到家统计：</Flex>
          <Flex itemGrow={1} style={{width: 0}}>{is_show_arrive == '1' ? '打开' : '关闭'}</Flex>
        </Flex>

        <DatePicker
          value={student_leave_time}
          onChange={date => this.setState({student_leave_time: date})}
        >
          <Flex className={addLess.item}>
            <Flex className={addLess.label}>学生离校开始时间：</Flex>
            <Flex style={{width: 0}} itemGrow={1}>{
              student_leave_time ? moment(student_leave_time).format('YYYY-MM-DD HH:mm') : '请选择离校开始时间'
            }</Flex>
          </Flex>
        </DatePicker>

        <DatePicker
          value={student_back_time}
          onChange={date => this.setState({student_back_time: date})}
        >
          <Flex className={addLess.item}>
            <Flex className={addLess.label}>学生返校截止时间：</Flex>
            <Flex style={{width: 0}} itemGrow={1}>{
              student_back_time ? moment(student_back_time).format('YYYY-MM-DD HH:mm') : '请选择返校截止时间'
            }</Flex>
          </Flex>
        </DatePicker>

        <Flex
          className={addLess.submitBtn} justify={"center"} onClick={this.submit}
        >提交统计</Flex>

      </Flex>
    </PageContainer>
  }

}
