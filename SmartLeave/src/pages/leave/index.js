import React from "react";
import PageContainer from "@/components/PageContainer";
import AppCommon from "@/utils/AppCommon";
import Flex from "@/components/Flex";
import LeaveApi from "@/https/apis/LeaveApi";
import ListContainer from "@/components/ListContainer";
import {formatDate} from "@/components/DateView";
import styles from "@/pages/leave/index.less";
import TeacherWrapper, {isTeacher} from "@/components/TeacherWrapper";
import AssetsIcon from "@/components/AssetsIcon";

const StatState = {
  '0': '正在统计',
  '1': '已结束',
};

export default class index extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      data: [],
      loading: true,
    };
  }

  componentDidMount() {
    this.getLeaveList();
  }

  ////////////////////////////////// 逻辑方法

  /**
   * 获取数据
   */
  getLeaveList = () => {
    const {id} = this.state;
    LeaveApi.get_Leave(id).then(res => {
      if (res.code === 200) {
        let data = res.data;
        this.setState({data, loading: false});
      } else {
        AppCommon.showRespError(res);
      }
    })
  };

  ////////////////////////////////// 页面渲染

  renderList() {
    const {data} = this.state;
    return <ListContainer count={data.length}>
      <Flex direction={"column"}>
        {data.map(item => {
          let colorStyle = {color: '#6B8E23'};
          if (item.state != '0') {
            colorStyle.color = 'red';
          }
          return <Flex
            direction={"column"} className={styles.card} key={item.id}
            onClick={() => {
              if (isTeacher()) {
                AppCommon.routerPush('/leave/teacher/stat1', {
                  leave_id: item.id, is_show_stay: item.is_show_stay, is_show_arrive: item.is_show_arrive
                });
              } else {
                AppCommon.routerPush('/leave/add', {...item});
              }
            }}
          >
            <Flex className={styles.name}>{item.name}</Flex>
            <Flex style={colorStyle}>{StatState[item.state]}</Flex>
            <Flex>开始时间：{formatDate(item.start_time, 'YYYY-MM-DD')}</Flex>
            <Flex>结束时间：{formatDate(item.end_time, 'YYYY-MM-DD')}</Flex>
          </Flex>
        })}
      </Flex>
    </ListContainer>
  }

  render() {
    const {loading} = this.state;
    return <PageContainer title={'离校统计'} loading={loading}>
      <Flex direction={"column"} className={styles.index}>
        {this.renderList()}

        <TeacherWrapper>
          <AssetsIcon
            alignItems={'center'} justify={'center'} size={18}
            className={styles.addBtn} icon={'icon_add.png'}
            onClick={() => AppCommon.routerPush('/leave/teacher/add')}
          />
        </TeacherWrapper>

      </Flex>
    </PageContainer>;
  }
}
