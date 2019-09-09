import React from "react";
import PageContainer from "@/components/PageContainer";
import AppCommon from "@/utils/AppCommon";
import Common from "@/utils/Common";
import styles from "@/pages/leave/add.less";
import {Picker, SegmentedControl, DatePicker, Modal} from 'antd-mobile';
import LeaveApi from "@/https/apis/LeaveApi";
import {getLoginInfo} from "@/pages";
import Location from "@/components/Location";
import Flex from "@/components/Flex";
import Radio from "@/components/Radio";
import moment from "moment";
import {dateToSeconds, getMoment} from "@/components/DateView";
import request from "@/https/request";

const Tranways = [
  {label: '汽车', value: '汽车',}, {label: '火车', value: '火车',},
  {label: '飞机', value: '飞机',}, {label: '其它', value: '其它',},
];

export default class index extends React.Component {

  constructor(props, context) {
    super(props, context);
    let {query} = this.props.location;
    let loginInfo = getLoginInfo();
    this.state = {
      leave_id: query.id, student_id: query.student_id || loginInfo.id,
      is_show_stay: query.is_show_stay, is_show_arrive: query.is_show_arrive,
      oldState: '-1',

      loading: false,
      back_time: undefined,
      reason: "",
      leave_time: undefined,
      contact_phone: "",
      contact: "",
      state: "1",
      leave_way: "",
      transways: "",

      site: "",
      provSel: {},
      citySel: {},
      areaSel: {},
      streetSel: {},

      isBz: '-1', //是否是班长
    };
  }

  componentDidMount() {
    this.getMyls();
    this.checkIsBz();
  }

  ////////////////逻辑方法

  /**
   * 检查是否是班长
   */
  checkIsBz = () => {
    request('/api/User/check_is_bz', {method: 'POST', data: {}}).then(res => {
      if (res.code === 200) {
        this.setState({isBz: res.data});
      } else {
        AppCommon.showRespError(res);
      }
    })
  };

  /**
   * 获取我的填写情况
   */
  getMyls() {
    const {leave_id, student_id} = this.state;
    LeaveApi.getMyLs({leave_id, student_id}).then(res => {
      if (res.code === 200) {
        let back_time = getMoment(res.data.back_time);
        if (back_time) {
          back_time = back_time.toDate();
        }
        let leave_time = getMoment(res.data.leave_time);
        if (leave_time) {
          leave_time = leave_time.toDate();
        }

        let provSel = {};
        let citySel = {};
        let areaSel = {};
        let streetSel = {};
        let addressArr = Common.splitObj(res.data.address, '-/-');
        let site = addressArr[1];
        let arr = Common.splitObj(addressArr[0], '-');
        if ((arr.length > 0)) {
          provSel.label = arr[0];
        }
        if ((arr.length > 1)) {
          citySel.label = arr[1];
        }
        if ((arr.length > 2)) {
          areaSel.label = arr[2];
        }
        if ((arr.length > 3)) {
          streetSel.label = arr[3];
        }
        let oldState = res.data.state;
        this.setState({...res.data, oldState, back_time, leave_time, provSel, citySel, areaSel, streetSel, site})
      } else {
        AppCommon.showRespError(res);
      }
    })
  }

  /**
   * 确认到家
   */
  arrive = () => {
    Modal.alert('温馨提示', '确定要提交到达信息？', [
      {text: '取消'},
      {
        text: '确定', onPress: () => {
          AppCommon.showLoading('定位中');
          AppCommon.mapLocation().then(res => {
            let address = Common.splitObj(res.address, ' ');
            AppCommon.showLoading('提交到家');
            const {student_id, leave_id} = this.state;
            let params = {
              student_id, leave_id, province: address[0], city: address[1],
              district: Common.initValue(address[2], '其他'), township: Common.initValue(address[4], '其他'),
            };
            LeaveApi.arriveHome(params).then(res => {
              AppCommon.hideMessage();
              if (res.code === 200) {
                AppCommon.showToast('提交成功', 'success', () => {
                  AppCommon.routerBack();
                })
              } else {
                AppCommon.showRespError(res);
              }
            })
          }).catch(() => {
            AppCommon.showToast('定位失败，请重试', 'fail');
          });
        }
      },
    ]);
  };

  /**
   * 提交方法
   */
  submit = () => {
    let {
      transways, back_time, reason, leave_time, contact_phone, contact, student_id, leave_id,
      state, leave_way, site
    } = this.state;
    let params = {state, leave_id, student_id, transways, reason, contact_phone, contact, leave_way};
    if (state == '1') {
      if (Common.isEmpty(leave_time)) {
        AppCommon.showToast('请选择离校时间', 'fail');
        return;
      }
      if (Common.isEmpty(back_time)) {
        AppCommon.showToast('请选择返校时间', 'fail');
        return;
      }
      const {provSel, citySel, areaSel, streetSel} = this.state;
      params.address = provSel.label + '-' + citySel.label + '-' + areaSel.label + '-' + streetSel.label + '-/-' + site;
      params.back_time = dateToSeconds(back_time);
      params.leave_time = dateToSeconds(leave_time);
    }
    AppCommon.showLoading('提交中');
    LeaveApi.submit(params).then(res => {
      AppCommon.hideMessage();
      if (res.code === 200) {
        AppCommon.showToast('提交成功');
        this.getMyls();
      } else {
        AppCommon.showRespError(res);
      }
    })
  };

  ////////////////////////////////// 页面渲染

  /**
   * 当前状态
   * @returns {*}
   */
  renderStatus() {
    let {state, isBz, leave_id, is_show_stay, is_show_arrive} = this.state;
    let tips = '未选择，请点击下方选择';
    if (state == "1") {
      tips = '已选择离校';
    }
    if (state == "0") {
      tips = '已选择留校';
    }
    return <Flex direction={"column"}>
      <Flex className={styles.topStatus}>
        <Flex itemGrow={1}>当前状态：{tips}</Flex>
        {isBz != '-1' &&
        <Flex
          onClick={() => AppCommon.routerPush('/leave/teacher/stat1', {
            leave_id, is_show_stay, is_show_arrive
          })}
        >统计管理</Flex>}
      </Flex>
      <Flex style={{height: 40}}/>
    </Flex>;
  }

  /**
   * 留校
   * @returns {*}
   */
  renderStay() {
    const {is_show_stay, state, oldState} = this.state;
    if (is_show_stay == '0' || state != '0') {
      return;
    }
    if (oldState == '0') {
      return <Flex justify={"center"} style={{margin: '30% 12px'}}>
        你已选择留校，可切换tab变更为离校。
      </Flex>
    } else {
      return <Flex className={styles.stayBtn} justify={"center"} onClick={this.submit}>确认留校</Flex>
    }
  }

  /**
   * 渲染离校
   */
  renderLeave() {
    const {state, reason, leave_way, contact, contact_phone, back_time, leave_time, site} = this.state;
    const {provSel, citySel, areaSel, streetSel, oldState, is_show_arrive} = this.state;

    if (state != '1') {
      return;
    }
    let textValue = reason;
    if (reason == '旅游' || reason == '回家') {
      textValue = '';
    }
    return <Flex direction={"column"}>

      <Flex direction={"column"}>
        <Flex className={styles.itemLabel}>离校原因</Flex>
        <Flex direction={"column"} className={styles.itemBody}>
          <Flex
            alignItems={"center"} style={{borderBottom: '1px solid #eeeeee'}}
            onClick={() => this.setState({reason: '回家'})}
          >
            <Radio size={16} checked={reason == '回家'}/>
            <Flex style={{marginLeft: 8}}>回家</Flex>
          </Flex>
          <Flex
            alignItems={"center"} style={{borderBottom: '1px solid #eeeeee'}}
            onClick={() => this.setState({reason: '旅游'})}
          >
            <Radio size={16} checked={reason == '旅游'}/>
            <Flex style={{marginLeft: 8}}>旅游</Flex>
          </Flex>
          <Flex alignItems={"center"} style={{margin: '8px 0'}}>
            <Radio size={16} checked={!Common.isEmpty(textValue)}/>
            <Flex style={{marginLeft: 8, width: 0}} itemGrow={1}>
              <textarea
                placeholder={'其他原因请在此处填写'} value={textValue} className={styles.textarea} rows={3}
                onChange={e => this.setState({reason: e.target.value})}
              />
            </Flex>
          </Flex>
        </Flex>
      </Flex>

      <Flex direction={"column"}>
        <Flex className={styles.itemLabel}>离校方式</Flex>
        <Picker
          data={Tranways} cols={1}
          onChange={(values) => this.setState({leave_way: values[0]})}
        >
          <Flex className={styles.itemBody}>
            <Flex itemGrow={1}>离校方式</Flex>
            <Flex>{Common.initValue(leave_way, '请选择')}</Flex>
          </Flex>
        </Picker>
      </Flex>

      <Flex direction={"column"}>
        <Flex className={styles.itemLabel}>地址(离校目的地)</Flex>
        <Location
          provSel={provSel} citySel={citySel} areaSel={areaSel} streetSel={streetSel}
          onChange={values => {
            this.setState({
              provSel: values[0], citySel: values[1],
              areaSel: values[2], streetSel: values[3]
            });
          }}
        />
        <Flex>
          <textarea
            placeholder={'详细地址'} value={site} className={styles.addressSite} rows={4}
            onChange={e => this.setState({site: e.target.value})}
          />
        </Flex>
      </Flex>

      <Flex direction={"column"}>
        <Flex className={styles.itemLabel}>紧急联系人信息</Flex>
        <Flex direction={"column"} className={styles.itemBody}>
          <Flex alignItems={"center"} style={{borderBottom: '1px solid #eeeeee'}}>
            <Flex>姓名：</Flex>
            <Flex itemGrow={1} style={{width: 0}}>
              <input
                placeholder={'联系人姓名'} value={contact}
                onChange={e => this.setState({contact: e.target.value})}
              />
            </Flex>
          </Flex>
          <Flex alignItems={"center"}>
            <Flex>电话：</Flex>
            <Flex itemGrow={1} style={{width: 0}}>
              <input
                placeholder={'联系人电话'} value={contact_phone}
                onChange={e => this.setState({contact_phone: e.target.value})}
              />
            </Flex>
          </Flex>
        </Flex>
      </Flex>

      <Flex direction={"column"}>
        <Flex className={styles.itemLabel}>时间</Flex>
        <Flex direction={"column"} className={styles.itemBody}>
          <DatePicker value={leave_time} onChange={date => this.setState({leave_time: date})}>
            <Flex alignItems={"center"} style={{borderBottom: '1px solid #eeeeee'}}>
              <Flex>离校时间：</Flex>
              <Flex itemGrow={1} style={{width: 0}}>
                {leave_time ? moment(leave_time).format('YYYY-MM-DD HH:mm') : '请选择离校时间'}
              </Flex>
            </Flex>
          </DatePicker>
          <DatePicker value={back_time} onChange={date => this.setState({back_time: date})}>
            <Flex alignItems={"center"}>
              <Flex>返校时间：</Flex>
              <Flex itemGrow={1} style={{width: 0}}>
                {back_time ? moment(back_time).format('YYYY-MM-DD HH:mm') : '请选择返校时间'}
              </Flex>
            </Flex>
          </DatePicker>
        </Flex>
      </Flex>

      <Flex className={styles.leaveBtn} justify={"center"} onClick={this.submit}>提交</Flex>

      {is_show_arrive == "1" && oldState !== "-1" &&
      <Flex
        className={styles.leaveBtn} style={{margin: '0 12px 12px'}} justify={"center"}
        onClick={this.arrive}
      >确认到家</Flex>}

    </Flex>
  }

  render() {
    const {is_show_stay, loading, state} = this.state;

    return <PageContainer title={'离校统计'} loading={loading}>
      <Flex direction={"column"}>
        {this.renderStatus()}
        {is_show_stay == '1' &&
        <SegmentedControl
          values={['留校', '离校']} style={{margin: '10px 12px 0 12px', height: '32px'}}
          selectedIndex={parseInt(state, 10)}
          onChange={e => {
            this.setState({state: e.nativeEvent.selectedSegmentIndex})
          }}
        />}

        {this.renderStay()}
        {this.renderLeave()}
      </Flex>
    </PageContainer>;
  }

}

