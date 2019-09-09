import React from "react";
import PageContainer from "@/components/PageContainer";
import AppCommon from "@/utils/AppCommon";
import InfoApi from "@/https/apis/InfoApi";
import Flex from "@/components/Flex";
import styles from "@/pages/info/index.less";
import moment from 'moment';


export default class index extends React.Component {


  state = {
    dataList: [],
    loading: true,
  };

  componentDidMount() {
    this.getData();
  }

  ////////////////////////////////// 逻辑方法

  /**
   * 获取数据
   */
  getData = () => {
    InfoApi.getInfo().then(res => {
      if (res.code === 200) {
        this.setState({dataList: res.data,loading:false});
      } else {
        AppCommon.showRespError(res);
      }
    })
  };
  time(record){
    return moment(record).format('YYYY-MM-DD')
  }

  ////////////////////////////////// 页面渲染

  render() {
    const {dataList, loading} = this.state;
    return <PageContainer title={'信息公示'} loading={loading}>
      <Flex direction={"column"}>
        {dataList.map(item => {
          return <Flex className={styles.card} onClick={()=>{
            AppCommon.routerPush('/info/detail?id='+item.id)
          }
          }>
                  <Flex direction={"row"} alignItems={"center"}>
                    <span className={styles.name}>{item.name}</span>
                    <span className={styles.time}>{this.time(dataList.add_time)}</span>
                  </Flex>
            <Flex direction={"column"}>
              <Flex className={styles.hline}></Flex>
              <span className={styles.smalltitle}>{item.summary}</span>
              {console.log(item)}
              <img className={styles.image} src={AppCommon.wrapperImgPath(item.cover)}/>
            </Flex>
          </Flex>
        })}
      </Flex>
    </PageContainer>;
  }
}

