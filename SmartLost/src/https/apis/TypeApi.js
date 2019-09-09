import request from "@/https/request";

export default {

  getStation: async () => {
    return request("/api/Type/get_station", {method: 'POST', data: {}});
  },

  getTravel: async () => {
    return request('/api/Type/get_travel', {method: 'POST', data: {}});
  },

  getNation: async () => {
    return request('/api/Type/get_nation', {method: 'POST', data: {}});
  },

  getPolitics: async () => {
    return request('/api/Type/get_politics', {method: 'POST', data: {}});
  },

  getReligion: async () => {
    return request('/api/Type/get_religion', {method: 'POST', data: {}});
  },

}
