import React from "react";
import PageContainer from "@/components/PageContainer";
import AppCommon from "@/utils/AppCommon";
import Flex from "@/components/Flex";
import styles from "@/pages/arrive/index.less";
import moment from "moment";
import ArriveApi from "@/https/apis/ArriveApi";
import ListContainer from "@/components/ListContainer";


export default class index extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      data: [],
      loading: false,
    };
  }

  componentDidMount() {
    this.getArrive();
  }

  ////////////////////////////////// 逻辑方法

  /**
   * 获取数据
   */

  getArrive = () => {
    const {id} = this.state;
    ArriveApi.getArrive(id).then(res => {
      if (res.code === 200) {
        this.setState({data: res.data, loading: false});
      } else {
        AppCommon.showRespError(res);
      }
    })
  };

  renderList() {
    const {data} = this.state;
    let start_time = moment(data.start_time).format('YYYY-MM-DD');
    let add_time = moment(data.add_time).format('YYYY-MM-DD');
    return <ListContainer count={data.length}>
      <div>
        {data.map(item => {
          return <Flex
            direction={"row"} className={styles.card}  key={item.id}
            onClick={() => AppCommon.routerPush('/arrive/add',{...item})}
          >
            <Flex direction={"column"}>
              <div className={styles.name}>{item.name}</div>
              {/*{item.state == "0" ? <div className={styles.status}>正在统计</div> : <div className={styles.status1}>已结束</div>}*/}
              <div className={styles.span1}>开始时间：{start_time}</div>
              <div className={styles.span1}>添加时间：{add_time}</div>
              <div className={styles.span}>&nbsp;节日期间：{item.state == "0" ? '在校':'离校'}</div>
            </Flex>
          </Flex>
        })}
        <div className={styles.bottom}>- - 数据全部加载完成 - -</div>
      </div>
    </ListContainer>
  }

  ////////////////////////////////// 页面渲染
  render() {
    const {loading} = this.state;
    return <PageContainer title={'到校统计'} loading={loading}>
      <Flex direction={"column"}>
        {this.renderList()}
      </Flex>
    </PageContainer>;
  }
}
