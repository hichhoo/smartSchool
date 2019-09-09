import request from "@/https/request";

export default {

  getInfo: async () => {
    return request("/api/Info/get_info", {method: 'POST', data: {}});
  },
  getContent: async  (info_id) => {
    return  request("/api/Info/get_content",{method: 'POST', data: {info_id}});
  }
}
