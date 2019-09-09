import React from "react";
import PageContainer from "@/components/PageContainer";
import AppCommon from "@/utils/AppCommon";
import VideoApi from "@/https/apis/VideoApi";
import Flex from "@/components/Flex";
import styles from "@/pages/smartvideo/get_content.less";
import moment from "moment";
import Common from "@/utils/Common";
import { Tabs, Button, Menu } from 'antd';
import pen from '@/assets/pen.png';

const { SubMenu } = Menu;

export default class index extends React.Component {
  constructor(props, context) {
    super(props, context);
    let { query } = this.props.location;
    this.state = {
      video_id: query.id,
      data: [],
      loading: true,
    };
  }
  ff
  componentDidMount() {
    this.get_content();
  }

  ////////////////////////////////// 逻辑方法

  /**
   * 获取数据
   */
  //首次打开获得卡类/证照数据
  get_content() {
    const { id,video_id } = this.state;
    VideoApi.get_content(id,video_id).then(res => {
      if (res.code === 200) {
        this.setState({ data: res.data, loading: false });
      } else {
        AppCommon.showRespError(res);
      }
    })
  };


  ////////////////////////////////// 页面渲染

  render() {
    const { data, loading } = this.state;
    console.log(data);
    let addtime = moment(data.add_time * 1000).format('YYYY-MM-DD');
    return <PageContainer title={'物主连连看'} loading={loading}>
           
        <div className={styles.card}>
        <iframe src="http://player.youku.com/embed/XMzcwNTY3NTM2MA" 
           className={styles.video} frameborder={0} allowfullscreen></iframe>
        <div className={styles.name}>{data.name}</div>
        <div className={styles.publisher}>作者：{data.publisher}</div>
        <div className={styles.count}>浏览量:{data.count}</div>
        <div className={styles.time}>发布时间：{addtime}</div>
        <div className={styles.line}></div>
        <div className={styles.summary}>{data.summary}</div>
        <div>
        </div>
        </div>
    </PageContainer>;
  }
}
