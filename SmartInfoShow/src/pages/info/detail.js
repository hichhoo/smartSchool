import React from "react";
import PageContainer from "@/components/PageContainer";
import AppCommon from "@/utils/AppCommon";
import RichText from "@/components/RichText";
import InfoApi from "@/https/apis/InfoApi";
import Flex from "@/components/Flex";
import styles from "@/pages/info/detail.less";
import moment from "moment";
import Common from "@/utils/Common";

export default class index extends React.Component {
  constructor(props, context) {
    super(props, context);
    let {query} = this.props.location;
    this.state = {
      info_id: query.id,
      data: {},
      loading: true,
    };
  }

  componentDidMount() {
    this.getContent();
  }

  ////////////////////////////////// 逻辑方法

  /**
   * 获取数据
   */
  getContent = () => {
    const {info_id} = this.state;
    InfoApi.getContent(info_id).then(res => {
      if (res.code === 200) {
        this.setState({data: res.data,loading:false});
      } else {
        AppCommon.showRespError(res);
      }
    })
  };


  ////////////////////////////////// 页面渲染

  render() {
    const {data, loading} = this.state;
    let addtime = moment(data.add_time*1000).format('YYYY-MM-DD');
    return <PageContainer title={Common.initValue(data.name,'公示详情')} loading={loading}>
      <Flex direction={"column"}>
        <Flex direction={"row"} justify={"flex-start"} className={styles.name}>
          {data.summary}
        </Flex>
        <Flex direction={"row"} className={styles.publisher}>
          <span className={styles.time}>发布时间：{addtime}</span>
          <span className={styles.time}>&nbsp;发布人：{data.publisher}</span>
        </Flex>
        <Flex direction={"column"}>
          <img className={styles.image} src={AppCommon.wrapperImgPath(data.cover)}/>
        </Flex>
        <Flex direction={"row"} justify={"center"} className={styles.content}>
          <RichText content={data.content}/>
        </Flex>
      </Flex>
    </PageContainer>;
  }
}

