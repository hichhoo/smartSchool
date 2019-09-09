import React from 'react';
import request from "@/https/request";
import PageContainer from "@/components/PageContainer/index";
import Flex from "@/components/Flex/index";
import courseLess from './index.less';
import AppCommon from "@/utils/AppCommon";
import AssetsIcon from "@/components/AssetsIcon";
import Common from "@/utils/Common";

export default class teachers extends React.PureComponent {

  constructor(props, context) {
    super(props, context);
    this.state = {
      loading: true,
      modules: [],
    }
  }

  componentDidMount() {
    this.getTeachers();
  }

  //////////////////// 逻辑方法

  /**
   * 获取模块
   */
  getTeachers() {
    request('/api/Psychology/student_get_teacher', {method: 'POST', data: {}}).then(res => {
      if (res.code === 200) {
        this.setState({modules: res.data, loading: false});
      } else {
        AppCommon.showRespError(res);
      }
    })
  }

  /**
   * 跳转下一页面
   * @param item
   */
  goNext(item) {
    AppCommon.routerPush('/psychology/timetable', item);
  }

  //////////////////// 页面渲染

  render() {
    const {loading, modules} = this.state;
    return <PageContainer title={'选择心理老师'} loading={loading}>
      <Flex direction={"column"} className={courseLess.teachers}>
        {modules.map(item => {
          return <Flex
            key={item.teacher_id} className={courseLess.teacherItem} alignItems={"center"}
            onClick={() => this.goNext(item)}
          >
            <Flex itemGrow={1} direction={"column"} style={{width: 0}}>
              <Flex>{item.teacher_name}</Flex>
              <Flex className={courseLess.itemInfo}>{item.introduction}</Flex>
            </Flex>
            <AssetsIcon size={16} icon={'icon_back.png'}/>
          </Flex>
        })}
      </Flex>
    </PageContainer>
  }

}
