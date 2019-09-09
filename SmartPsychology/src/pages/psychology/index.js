import React from 'react';
import request from "@/https/request";
import PageContainer from "@/components/PageContainer/index";
import Flex from "@/components/Flex/index";
import courseLess from './index.less';
import AppCommon from "@/utils/AppCommon";
import AssetsIcon from "@/components/AssetsIcon";
import Common from "@/utils/Common";

export default class index extends React.PureComponent {

  constructor(props, context) {
    super(props, context);
    this.state = {
      loading: true,
      modules: [],
    }
  }

  componentDidMount() {
    this.getModeList();
  }

  //////////////////// 逻辑方法

  /**
   * 获取模块
   */
  getModeList() {
    request('/api/Psychology/get_mobile_module', {method: 'POST', data: {}}).then(res => {
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
    let path = '';
    if (item.id == '281005') {
      path = '/psychology/teachers';
    } else if (item.id == '281009') {
      path = '/psychology/mine'
    } else if (item.id == '281006') {
      path = '/psychology/timetable'
    } else if (item.id == '281007') {
      // 预约记录
      path = '/psychology/teacher/apply'
    } else if (item.id == '281008') {
      // 心理咨询记录
      path = '/psychology/teacher/record'
    } else if (item.id == '0') {
      // 人员管理
      path = '/admin'
    }
    if (Common.isEmpty(path)) {
      AppCommon.showToast('模块开发中', 'fail');
      return;
    }
    AppCommon.routerPush(path, item);
  }


  //////////////////// 页面渲染

  render() {
    const {loading, modules} = this.state;
    return <PageContainer title={'心理预约'} loading={loading}>
      <Flex direction={"column"} className={courseLess.index}>
        {modules.map(item => {
          return <Flex
            key={item.id} className={courseLess.indexItem}
            onClick={() => this.goNext(item)}
          >
            <Flex itemGrow={1}>{item.name}</Flex>
            <AssetsIcon size={14} icon={'icon_back.png'}/>
          </Flex>
        })}
      </Flex>
    </PageContainer>
  }

}
