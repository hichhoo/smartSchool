/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import {extend} from "umi-request";
import {Toast} from "antd-mobile";
import Common from "@/utils/Common";

const codeMessage = {
  200: "服务器成功返回请求的数据。",
  201: "新建或修改数据成功。",
  202: "一个请求已经进入后台排队（异步任务）。",
  204: "删除数据成功。",
  400: "发出的请求有错误，服务器没有进行新建或修改数据的操作。",
  401: "用户没有权限（令牌、用户名、密码错误）。",
  403: "用户得到授权，但是访问是被禁止的。",
  404: "发出的请求针对的是不存在的记录，服务器没有进行操作。",
  406: "请求的格式不可得。",
  410: "请求的资源被永久删除，且不会再得到的。",
  422: "当创建一个对象时，发生一个验证错误。",
  500: "服务器发生错误，请检查服务器。",
  502: "网关错误。",
  503: "服务不可用，服务器暂时过载或维护。",
  504: "网关超时。",
};


/**
 * 保存登录信息
 */
export function saveLoginInfo() {
  let id = Common.getParamFormUrl('id');
  let session = Common.getParamFormUrl('session');
  let user_type = Common.getParamFormUrl('user_type');
  let module_id = Common.getParamFormUrl('module_id');
  let environment_type = Common.getParamFormUrl('environment_type');
  sessionStorage.setItem('login_info', JSON.stringify({id, session, user_type, module_id, environment_type}));
}


/**
 * 获取登录信息
 */
export function getLoginInfo() {
  return Common.parseJSON(sessionStorage.getItem('login_info'));
}


/**
 * 异常处理程序
 */
const errorHandler = error => {
  const {response = {}} = error;
  const errortext = codeMessage[response.status] || response.statusText;
  Toast.fail(errortext);
};

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler, // 默认错误处理
  credentials: "include", // 默认请求是否带上cookie,
  requestType: "form", // 表单提交post请求
});

//请求拦截器
request.interceptors.request.use((url, options) => {
  let newOptions = {...options};
  // 添加固定参数
  if (Common.isEmpty(newOptions.data.id)) {
    let userInfo = getLoginInfo();
    newOptions.data = {
      ...newOptions.data, ...userInfo
    }
  }

  return {url, options: newOptions};
});

export default request;
