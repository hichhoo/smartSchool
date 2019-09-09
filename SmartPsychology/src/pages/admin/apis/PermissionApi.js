import request from "@/https/request";

export default {

  getRoles: async () => {
    return request("/api/Permission/get_roles", {method: 'POST', data: {}});
  },

  getRoleUser: async ({role_id, target_id}) => {
    return request("/api/Permission/get_role_user", {method: 'POST', data: {role_id, target_id}});
  },

  getTargetDepartment: async ({role_id}) => {
    return request("/api/Permission/get_target_department", {method: 'POST', data: {role_id}});
  },

  getTargetTeacher: async (search) => {
    return request("/api/Permission/get_target_teacher", {method: 'POST', data: {search}});
  },

  getTargetStudent: async (search) => {
    return request("/api/Permission/get_target_student", {method: 'POST', data: {search}});
  },

  addRoleUser: async ({role_id, level, target_id, target_user_id}) => {
    return request("/api/Permission/add_role_user", {
      method: 'POST',
      data: {role_id, level, target_id, target_user_id}
    });
  },

  deldRoleUser: async ({role_id, level, target_id, target_user_id}) => {
    return request("/api/Permission/del_role_user", {
      method: 'POST',
      data: {role_id, level, target_id, target_user_id}
    });
  },


}
