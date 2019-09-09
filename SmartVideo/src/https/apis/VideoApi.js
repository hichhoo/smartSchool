import request from "@/https/request";

export default {

  /**
   * 
   */
  get_video: async (id) => {
    return request("/api/Video/get_video", { method: 'POST', data: { id } });
  },
  get_content: async (id, video_id) => {
    return request("/api/Video/get_content", { method: 'POST', data: { id, video_id } });
  },
}
