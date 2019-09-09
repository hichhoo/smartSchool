import React from 'react';
import Common from "@/utils/Common";
import AppCommon from "@/utils/AppCommon";

export function saveLoginInfo(params) {
  sessionStorage.setItem('login_info', JSON.stringify(params));
}


/**
 * 获取登录信息
 */
export function getLoginInfo() {
  return Common.parseJSON(sessionStorage.getItem('login_info'));
}

/**
 * 当前环境
 * @type {{}}
 */
export const EnvironmentType = {
  '1': "App登录",
  '2': "手机网页登录",
  '3': "电脑网页登录",
  '101': "微信登录",
  '102': "易班登录"
};

export default class index extends React.Component {


  constructor(props, context) {
    super(props, context);
    let id = Common.getParamFormUrl('id');
    let session = Common.getParamFormUrl('session');
    let user_type = Common.getParamFormUrl('user_type');
    let module_id = Common.getParamFormUrl('module_id');
    let environment_type = Common.getParamFormUrl('environment_type');
    saveLoginInfo({id, session, user_type, module_id, environment_type});
    AppCommon.routerPush('/arrive');
  }

  ///////////////////// 页面渲染

  render() {
    return <div/>;
  }

}

