import Common from "@/utils/Common";

export const JWeiXin = {

  /**
   * 加载微信js
   * @param callback
   */
  loadJs: (callback) => {
    let url = './jweixin-1.4.0.js';
    Common.loadJsToScript(url, callback);
  },

  /**
   * 初始化微信配置
   */
  initConfig: (callback) => {
    console.log(window.isConfig);
    if (window.isConfig) {
      callback && callback();
    } else {
      setTimeout(() => {
        window.isConfig = true;
        callback && callback();
      }, 4000);
    }
  },

  /**
   * 做其他事情
   */
  doSomething: () => {
    JWeiXin.initConfig(() => {
      console.log('doSomething');
    })
  }

};
