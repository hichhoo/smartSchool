import request from "@/https/request";

export default {

  /**
   * 到校统计
   */
  getArrive: async(id) => {
  return request('/api/Arrive/get_as', {method:'POST',data:{id}});
  },

  /**
   *获取我的到校信息
   */
getMyAs: async (params)=>{
  return request('/api/Arrive/get_my_as',{method:'POST',data:{...params}});
  },
  /**
   *添加我的到校请求
   */
  submit: async (back_time,arrive_id,student_id,id,state )=>{
    return request('/api/Arrive/update_my_as_detail', {method:'POST',data:{back_time,arrive_id,student_id,id,state }})
  }
}
