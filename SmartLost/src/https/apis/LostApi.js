import request from "@/https/request";

export default {

  /**
   * index 失物招领全部信息：卡类，雨伞等
   */
  get_If: async (info_id, tag, state, type) => {
    return request("/api/Lost/get_lf", { method: 'POST', data: { info_id, tag, state, type } });
  },
  /**
   * 提交寻物启事
   */
  submit: async (images, name, id, time, place, tag, type, content, campus_id) => {
    return request('/api/Lost/add_lf', { method: 'POST', data: { images, name, id, time, place, tag, type, content, campus_id } });
  },
  /**
   * 我的寻物启事
   */
  get_my_if: async (id) => {
    return request('/api/Lost/get_my_lf', { method: 'POST', data: { id } });
  },
  /**
   * 公告
   */
  get_publicinfo: async (id) => {
    return request('/api/Lost/get_public_info', { method: 'POST', data: { id } });
  },

  // upload_pic: async (file) => {
  //   return request('/tools/File/upload_file_local', { method: 'POST', data: { file } });
  // },
  /**
   * 获取失物类型
   */
  get_type: async (id) => {
    return  request('/api/Lost/get_type', { method: 'POST', data: { id }});
  },
  /**
   * 获取校区
   */
  get_campus: async (module_id,submodule_id,session,id) => {
    return request('/api/School/get_campus', {method: 'POST', data: {module_id,submodule_id,session,id}});
  }
}
