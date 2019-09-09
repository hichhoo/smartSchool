import React from "react";
import PageContainer from "@/components/PageContainer";
import AppCommon from "@/utils/AppCommon";
import Common from "@/utils/Common";
import styles from "@/pages/arrive/add.less";
import {Button,DatePicker,Flex,List,WhiteSpace} from 'antd-mobile';
import {getLoginInfo} from "@/pages";
import ArriveApi from "@/https/apis/ArriveApi";


export default class index extends  React.Component{
  constructor(props,context){
    super(props,context);
    let {query} = this.props.location;
    let loginInfo = getLoginInfo();
    this.state = {
      arrive_id:query.id,
      student_id: loginInfo.id,
      loading:false,
      back_time:undefined,
      state:1,
    }
  };

  componentDidMount() {
    this.getMyAs();
  }


  //////////////逻辑方法


  /**
   * 获取我的到校信息
   */

  getMyAs(){
    const {arrive_id,id,student_id} = this.state;
    ArriveApi.getMyAs({arrive_id,id,student_id}).then(res=>{
      if(res.code === 200){
        let back_time = new Date(res.data.back_time * 1000);
        let arrive_time = new Date(res.data.arrive_time * 1000);
        this.setState({...res.data,back_time,arrive_time})
      }else{
        AppCommon.showRespError(res);
      }
    })
  }

  /**
   * 提交方法
   */
  submit=()=>{
    let{back_time,arrive_id,student_id,id,state} = this.state;
    if(Common.isEmpty(back_time)){
      AppCommon.showToast('请选择到校日期','fail');
      return;
    }
    back_time = parseInt(back_time.getTime()/1000,10);
    AppCommon.showLoading('提交中');
    ArriveApi.submit(back_time,arrive_id,student_id,id,state).then(res =>{
      AppCommon.hideMessage();
      if(res.code === 200){
        AppCommon.showToast('提交成功');
      }else{
        AppCommon.showRespError(res);
      }
    })
  };
//////////////页面渲染
  render() {
    const {back_time,state,loading} = this.state;

  return <PageContainer title={'到校统计'} loading={loading}>
    {state == '1' &&     <Flex direction={"column"}>
      <List renderHeader={() => '到校时间'} className={styles.wid}>
        <DatePicker
          mode="date" title="到校时间" value={back_time}
          onChange={back_time => this.setState({back_time})}
        >
          <List.Item arrow="horizontal">到校时间</List.Item>
        </DatePicker>
      </List>
      <WhiteSpace/>
      <WhiteSpace/>
      <WhiteSpace/>
      <Button type={"primary"} className={styles.but} onClick={this.submit}>确认到校</Button>
    </Flex>}
    {state == '0' &&<Button type={"primary"} className={styles.but1} onClick={this.submit}>本人在校</Button>}
  </PageContainer>;
}
}

