import React from 'react';
import {saveLoginInfo} from "@/https/request";
import AppCommon from "@/utils/AppCommon";
import './index.less';

export default class index extends React.PureComponent {

  constructor(props, context) {
    super(props, context);
    saveLoginInfo();
  }

  componentDidMount() {
    AppCommon.routerPush('/psychology');
  }

  //////////////////// 页面渲染

  render() {
    return null;
  }

}
