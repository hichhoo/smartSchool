import router from 'umi/router';
import {stringify} from "qs";
import Common from "./Common";
import {Toast} from 'antd-mobile';

export default {

  /**
   * 显示提示消息
   * @param msg
   * @param type
   * @param callback
   */
  showToast: (msg, type = 'success', callback) => {
    Toast[type](msg, 2, callback);
  },

  /**
   * 显示网络请求错误
   * @param res
   */
  showRespError: (res) => {
    if (res && res.code !== 200) {
      Toast.hide();
      Toast.fail(res.message);
    }
  },


  /**
   * 显示加载框
   * @param msg
   */
  showLoading: (msg = '数据处理中，请稍等') => {
    Toast.loading(msg, 0);
  },

  /**
   * 隐藏message组件
   */
  hideMessage: () => {
    Toast.hide();
  },

  /**
   * 分发到modal
   * @param type
   * @param payload
   * @param callback
   */
  dispatch: ({type, payload, callback}) => {
    window.g_app._store.dispatch({
      type, payload, callback,
    });
  },

  /**
   * 返回上一级
   */
  routerBack: () => {
    router.goBack();
  },

  /**
   * 跳转指定目录
   * @param path
   * @param params
   */
  routerPush: (path, params) => {
    if (!Common.isEmpty(params)) {
      path = path + "?" + stringify(params);
    }
    router.push(path);
  },


  /**
   * 图片资源
   * @param path
   */
  wrapperImgPath: (path = '') => {
    let imgHost = 'http://res.hzpjkj.com';
    if (path === '') {
      return imgHost;
    }
    if (path.substring(0, 4) === 'http') {
      return path;
    }
    return imgHost + path;
  },


  /**
   * 分页配置
   * @returns {{size: string, pageSize: number, showTotal: (function(*, *): string)}}
   */
  pagination: () => {
    return {
      pageSize: 20,
      showSizeChanger: true,
      pageSizeOptions: ['20', '30', '50'],
      current: 1,
      showTotal: (total, current) => {
        return "共 " + total + ' 条数据';
      }
    }
  },


  /**
   * 扫描二维码
   */
  scanQRCode: (callback) => {
    Common.loadJsToScript('./yb_h5.js', () => {
      window.scanCallback = (info) => {
        if (!Common.isEmpty(info)) {
          if (info.indexOf('-') !== -1) {
            callback && callback(info.split('-')[1]);
          }
        }
      };
      window.encode_fun && window.encode_fun();
    })

  }


}
