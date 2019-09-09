import React from "react";
import Flex from "@/components/Flex";
import PageContainer from "@/components/PageContainer";
import request from "@/https/request";
import AppCommon from "@/utils/AppCommon";
import detailLess from './detail.less';
import {ApplyState} from "@/pages/psychology/mine";
import {formatDate} from "@/components/DateView";

export const UserSex = {
  '0': '男',
  '1': '女',
};


export default class detail extends React.Component {

  constructor(props, context) {
    super(props, context);
    const {query} = this.props.location;
    this.state = {
      studentInfo: {}, applyDetail: {},
      query, loading: true,
    }
  }

  componentDidMount() {
    this.getStudentInfo();
    this.getApplyDetail();
  }

  /////////////////////////// 逻辑方法

  getStudentInfo() {
    const {query} = this.state;
    request('/api/Psychology/teacher_get_student_info', {
      method: 'POST', data: {student_id: query.student_id}
    }).then(res => {
      if (res.code === 200) {
        this.setState({studentInfo: res.data, loading: false})
      } else {
        AppCommon.showRespError(res);
      }
    })
  }

  /**
   * 获取详情
   */
  getApplyDetail() {
    const {query} = this.state;
    request('/api/Psychology/teacher_get_apply_detail', {method: 'POST', data: {apply_id: query.id}})
      .then(res => {
        if (res.code === 200) {
          this.setState({applyDetail: res.data});
        } else {
          AppCommon.showRespError(res);
        }
      })
  }

  /////////////////////////// 页面渲染

  renderStudent() {
    const {studentInfo} = this.state;
    return <Flex direction={"column"} className={detailLess.item}>
      <Flex className={detailLess.itemHeader}>学生信息</Flex>
      <Flex className={detailLess.itemBody} direction={"column"}>
        <Flex className={detailLess.label}>学生：{studentInfo.name}({studentInfo.id})</Flex>
        <Flex className={detailLess.label}>性别：{UserSex[studentInfo.sex]}</Flex>
        <Flex className={detailLess.label}>年级：{studentInfo.grade}</Flex>
        <Flex className={detailLess.label}>学院：{studentInfo.department_name}</Flex>
        <Flex className={detailLess.label}>专业：{studentInfo.profession_name}</Flex>
        <Flex className={detailLess.label}>班级：{studentInfo.class_name}</Flex>
        <Flex className={detailLess.label}>电话：{studentInfo.phone}/{studentInfo.short_phone}</Flex>
      </Flex>
    </Flex>
  }

  renderTeacher() {
    const {applyDetail} = this.state;
    return <Flex direction={"column"} className={detailLess.item}>
      <Flex className={detailLess.itemHeader} style={{background: 'orange'}}>教师信息</Flex>
      <Flex className={detailLess.itemBody} direction={"column"}>
        <Flex className={detailLess.label}>姓名：{applyDetail.teacher_name}({applyDetail.teacher_id})</Flex>
      </Flex>
    </Flex>
  }

  renderApply() {
    const {applyDetail} = this.state;
    return <Flex direction={"column"} className={detailLess.item}>
      <Flex className={detailLess.itemHeader} style={{background: 'green'}}>预约信息</Flex>
      <Flex className={detailLess.itemBody} direction={"column"}>
        <Flex className={detailLess.label}>预约状态：{ApplyState[applyDetail.state]}</Flex>
        <Flex className={detailLess.label}>
          预约时间：{formatDate(applyDetail.day, 'YYYY-MM-DD')}&nbsp;&nbsp;{applyDetail.time}
        </Flex>
        <Flex className={detailLess.label}>预约号码：{applyDetail.index}</Flex>
        <Flex className={detailLess.label}>预约理由：{applyDetail.apply_reason}</Flex>
      </Flex>
    </Flex>
  }

  render() {
    const {loading} = this.state;
    return <PageContainer title={'预约详情'} loading={loading}>
      <Flex direction={"column"}>
        {this.renderStudent()}
        {this.renderTeacher()}
        {this.renderApply()}
      </Flex>
    </PageContainer>
  }

}
