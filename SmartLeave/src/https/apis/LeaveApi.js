import request from "@/https/request";

export default {

  /**
   * 离校统计
   */
  get_Leave: async (id) => {
    return request('/api/Leave/get_ls', {method: 'POST', data: {id}});
  },

  /**
   *目的地地区
   */

  getArea: async (type, target_id, id) => {
    return request('/tools/area/get_administrative_division', {method: 'POST', data: {type, target_id, id}})
  },

  /**
   * 获取我的离校填写
   */
  getMyLs: async (params) => {
    return request('/api/Leave/get_my_ls', {method: 'POST', data: {...params}});
  },

  /**
   *获取板块号
   */
  getLs: async (id) => {
    return request('/api/Leave/get_ls', {method: 'POST', data: {id}});
  },

  /**
   * 更新离校记录
   */
  submit: async (params) => {
    return request('/api/Leave/update_my_ls', {method: 'POST', data: {...params}});
  },
  /**
   * 发送到家请求
   */
  arriveHome: async (params) => {
    return request('/api/Leave/arrive_home', {method: 'POST', data: {...params}})
  }
}
