import React from 'react';
import request from "@/https/request";
import PageContainer from "@/components/PageContainer/index";
import Flex from "@/components/Flex";
import courseLess from './index.less';
import AppCommon from "@/utils/AppCommon";
import Common from "@/utils/Common";
import {formatDate} from "@/components/DateView";
import {Modal} from "antd-mobile";
import Rate from "@/components/Rate";

export const ApplyState = {
  '1': '待审核',
  '2': '预约成功',
  '3': '被拒绝',
  '4': '已取消',
  '5': '咨询完成',
};

export default class teachers extends React.PureComponent {

  constructor(props, context) {
    super(props, context);
    this.state = {
      loading: true,
      modules: [],
    }
  }

  componentDidMount() {
    this.getMyApply();
  }

  //////////////////// 逻辑方法

  /**
   * 获取模块
   */
  getMyApply() {
    request('/api/Psychology/student_my_apply', {method: 'POST', data: {}}).then(res => {
      if (res.code === 200) {
        this.setState({modules: res.data, loading: false});
      } else {
        AppCommon.showRespError(res);
      }
    })
  }

  /**
   * 学生评价
   */
  studentEvaluate = (item) => {
    let params = {score: 0, apply_id: item.id, evaluate: ''};
    Modal.alert('评价', <Flex direction={"column"}>
      <Flex direction={"column"}>
        <Flex>打个分：</Flex>
        <Rate count={10} size={20} onChange={value => params.score = value}/>
      </Flex>
      <Flex style={{marginTop: 6}}>说点啥：</Flex>
      <textarea
        placeholder={'请输入评价内容'} rows={3} className={courseLess.textArea}
        onChange={e => {
          params.evaluate = e.target.value;
        }}
      />
    </Flex>, [
      {text: '取消'},
      {
        text: '确定', onPress: () => {
          AppCommon.showLoading('提交中');
          request('/api/Psychology/student_evaluate', {method: 'POST', data: params}).then(res => {
            if (res.code === 200) {
              AppCommon.showToast('评价成功');
              this.getMyApply();
            } else {
              AppCommon.showRespError(res);
            }
          })
        }
      },
    ], 'android')
  };

  /**
   * 学生评价
   */
  cancelApply = (item) => {
    let params = {apply_id: item.id, reason: ''};
    Modal.alert('请输入取消原因', <Flex direction={"column"}>
      <textarea
        placeholder={'请输入取消原因'} rows={3} className={courseLess.textArea}
        onChange={e => {
          params.reason = e.target.value;
        }}
      />
    </Flex>, [
      {text: '取消'},
      {
        text: '确定', onPress: () => {
          AppCommon.showLoading('取消中');
          request('/api/Psychology/student_cancel', {method: 'POST', data: params}).then(res => {
            if (res.code === 200) {
              AppCommon.showToast('取消成功');
              this.getMyApply();
            } else {
              AppCommon.showRespError(res);
            }
          })
        }
      },
    ], 'android')
  };

  //////////////////// 页面渲染

  render() {
    const {loading, modules} = this.state;

    return <PageContainer title={Common.getParamFormUrl('name')} loading={loading}>
      <Flex direction={"column"} className={courseLess.mine}>
        {modules.map(item => {

          let itemArr = [];
          if (item.state == '1') {
            // 待审核
            itemArr.push(<Flex key={6} className={courseLess.itemControl} justify={"flex-end"}>
              <Flex className={courseLess.itemBtnCancel} onClick={this.cancelApply.bind(this, item)}>取消预约</Flex>
            </Flex>)
          } else if (item.state == '2') {

          } else if (item.state == '3' || item.state == '4') {
            itemArr.push(<Flex key={1}>取消者：{item.cancel_user_name}</Flex>);
            itemArr.push(<Flex key={2}>取消原因：{item.cancel_reason}</Flex>);
            itemArr.push(<Flex key={3}>取消时间：{formatDate(item.cancel_time, 'YYYY-MM-DD HH:mm:ss')}</Flex>);
          } else if (item.state == '5') {
            itemArr.push(<Flex key={4}>分数：{item.score}</Flex>);
            itemArr.push(<Flex key={5}>评价：{Common.initValue(item.evaluate, '无')}</Flex>);
            if (Common.isEmpty(item.evaluate)) {
              itemArr.push(<Flex key={6} className={courseLess.itemControl} justify={"flex-end"}>
                <Flex className={courseLess.itemBtn} onClick={this.studentEvaluate.bind(this, item)}>进行评价</Flex>
              </Flex>)
            }
          }

          return <Flex
            key={item.id} className={courseLess.mineItem} direction={"column"}
          >
            <Flex className={courseLess.itemTitle} justify={"space-between"}>
              <Flex>{item.teacher_name}</Flex>
              <Flex>{formatDate(item.day, 'YYYY-MM-DD')}</Flex>
            </Flex>
            <Flex className={courseLess.itemBody} direction={"column"}>
              <Flex>申请原因：{item.apply_reason}</Flex>
              <Flex>预约时间段：{item.time}</Flex>
              <Flex>预约号码：{item.index}</Flex>
              <Flex>预约状态：{ApplyState[item.state]}</Flex>
              {itemArr}
            </Flex>
          </Flex>
        })}
      </Flex>
    </PageContainer>
  }

}
