import React from "react";
import PageContainer from "@/components/PageContainer";
import AppCommon from "@/utils/AppCommon";
import LostApi from "@/https/apis/LostApi";
import Flex from "@/components/Flex";
import styles from "@/pages/Lost/mine.less";
import { Button} from 'antd-mobile';
import badface from '@/assets/badface.png';




export default class index extends React.Component {
  constructor(props, context) {
    super(props, context);
    let { query } = this.props.location;
    this.state = {
      id: query.id,
      data: [],
      loading: true,
    };
  }
  componentDidMount() {
    this.get_my_if();
  }

  ////////////////////////////////// 逻辑方法

  /**
   * 获取数据
   */

  get_my_if() {
    const { id } = this.state;
    LostApi.get_my_if(id).then(res => {
      if (res.code === 200) {
        this.setState({ data: res.data, loading: false });
      } else {
        AppCommon.showRespError(res);
      }
    })
  }

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
      return <Flex direction={"column"} className={styles.all}>
        <div className={styles.title}>
          <span className={styles.txt}>我的<br></br></span>
          <span className={styles.txt}>失物</span>
        </div>
        <span className={styles.title1}>{item.name}</span>
        <span className={styles.title2}>2018-03-19 08:57:38</span>
        <span className={styles.spa1}>物品编号：{item.id}</span>
        <span className={styles.spa}>物品名称：{item.name}</span>
        <span className={styles.spa}>丢失时间：{item.time}</span>
        <span className={styles.spa}>丢失地点：{item.place}</span>
        <span className={styles.spa}>物品描述：{item.content}</span>
        <img className={styles.image} src={AppCommon.wrapperImgPath(item.image)} />
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
    return <PageContainer title={'我的失物'} loading={loading}>
      {this.renderList()}
        <Button className={styles.button} type="primary" onClick={() => AppCommon.routerPush('/lost')}>返回</Button>
      <div className={styles.bottom}></div>
    </PageContainer>;
  }
}
function callback(key) {
  console.log(key);
}

