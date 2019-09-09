import React from "react";
import PageContainer from "@/components/PageContainer";
import AppCommon from "@/utils/AppCommon";
import VideoApi from "@/https/apis/VideoApi";
import styles from "@/pages/smartvideo/index.less";
import pen from '@/assets/pen.png';
import ListView from "@/components/ListView";

export default class index extends React.Component {
  constructor(props, context) {
    super(props, context);
    let { query } = this.props.location;
    this.pageObj = {pageNo:1}
    this.state = {
      id: query.id,
      list: [],
      loading: true,
    };
  }
  componentDidMount() {
    this.get_video();
  }
  ////////////////////////////////// 逻辑方法
  /**
   * 获取数据
   */
  get_video(resolve,reject) {
    const { id } = this.state;
    VideoApi.get_video(id,this.pageObj.pageNo).then(res => {
      if (res.code === 200) {
        let list = res.data;
        if(this.pageObj.pageNo !== 1){
          list = this.state.list.concat(res.data);
        }
        this.setState(({list,loading:false}));
        resolve && resolve();
      } else {
        AppCommon.showRespError(res);
        reject && reject();
      }
    })
  }
  ////////////////////////////////// 页面渲染
  render() {
    const { list, loading } = this.state;
    console.log(list);
    return <PageContainer title={'视频'} loading={loading}>
      <div>
        <div>
          <ListView
            onLoadMore={pageObj => {
              this.pageObj = pageObj;
              return new Promise((resolve, reject) => {
                this.getRecordList(resolve,reject);
              })
            }}
          >
      {list.map(item => {
        return  <div className={styles.card} onClick={()=> {
          AppCommon.routerPush('/smartvideo/get_content?id='+item.id)}}>
        <iframe src="http://player.youku.com/embed/XMzcwNTY3NTM2MA"
           className={styles.video} frameborder={0} allowfullscreen></iframe>
        <span>{item.name}</span>
        <span>{item.summary}</span>
        <div>
          <span className={styles.publisher}>{item.publisher}</span>
          <img className={styles.pen} alt={"图片无法显示"} src={pen}/>
        </div>
        </div>
      })}
      </ListView>
      </div>
      <div className={styles.clear}></div>
      </div>
    </PageContainer>;
  }
}



