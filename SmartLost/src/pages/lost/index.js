import React from "react";
import PageContainer from "@/components/PageContainer";
import AppCommon from "@/utils/AppCommon";
import LostApi from "@/https/apis/LostApi";
import Flex from "@/components/Flex";
import styles from "@/pages/Lost/index.less";
import moment from "moment";
import badface from '@/assets/badface.png';
import {  WhiteSpace, Badge, Button, Tabs} from 'antd-mobile';

const tabs = [
  { title: <Badge >卡类/证照</Badge> },
  { title: <Badge>雨伞</Badge> },
  { title: <Badge>衣饰</Badge> },
  { title: <Badge>书本</Badge> },
  { title: <Badge>电子产品</Badge> },
  { title: <Badge>其他</Badge> },
];

export default class index extends React.Component {
  constructor(props, context) {
    super(props, context);
    let { query } = this.props.location;
    this.state = {
      info_id: query.id,
      data: [],
      loading: true,
    };
  }
  
  componentDidMount() {
    this.get_If();
  }

  ////////////////////////////////// 逻辑方法

  /**
   * 获取数据
   */
  //首次打开获得卡类/证照数据
  get_If = (index)=> {
    const { info_id } = this.state;
    console.log(index)
    LostApi.get_If(info_id, index||"0", "0", index||"0").then(res => {
      if (res.code === 200) {
        this.setState({ data: res.data, loading: false });
      } else {
        AppCommon.showRespError(res);
      }
    })
  };


  renderList() {
    const { data } = this.state;
    if(data == ""){
    return <Flex direction={"column"} align-items={"center"}>
      <img className={styles.badface} src={badface}/>
      <div className={styles.bottom}>没有找到任何数据</div>
    </Flex>
  }else{
    return <div>
    {data.map(item => {
      return <Flex direction={"column"}>
        <div className={styles.title}>
          <span className={styles.txt}>寻物<br></br></span>
          <span className={styles.txt}>启事</span>
        </div>
        <span className={styles.title1}>{item.name}</span>
        <span className={styles.title2}>2018-03-19 08:57:38</span>
        <span className={styles.spa1}>物品编号：{item.id}</span>
        <span className={styles.spa}>物品名称：{item.name}</span>
        <span className={styles.spa}>拾取时间：{item.time}</span>
        <span className={styles.spa}>拾取地点：{item.place}</span>
        <span className={styles.spa}>物品描述：{item.content}</span>
        <img className={styles.image} src={AppCommon.wrapperImgPath(item.image)}/>
        <div className={styles.line}></div>
      </Flex>
    })}
    <div className={styles.bottom}>- - 数据全部加载完成 - -</div>
  </div>

  }
}

  ////////////////////////////////// 页面渲染

  render() {
    const { data, loading } = this.state;
    let addtime = moment(data.add_time * 1000).format('YYYY-MM-DD');
    return <PageContainer title={'物主连连看'} loading={loading}>
      <Flex>
    <Tabs tabs={tabs}
      initialPage={1}
      // onChange={(tab, index) => { console.log(index); }}
      onTabClick={(tab,index) => { this.get_If(index)}}
    >
    </Tabs>



    <WhiteSpace />
    <WhiteSpace />
    </Flex>
      {this.renderList()}
      <Flex className={styles.but}>
        <Button type="primary"  className={styles.button1}
        onClick={() => AppCommon.routerPush('/lost/find')}>寻物启事</Button>
        <Button type="primary"  className={styles.button2}
        onClick={() => AppCommon.routerPush('/lost/mine')}>我的失物</Button>
        <Button type="primary" className={styles.button3}
        onClick={() => AppCommon.routerPush('/lost/notice')}>公告</Button>
        </Flex>
      <div className={styles.bottom}></div>
    </PageContainer>;
  }
}

