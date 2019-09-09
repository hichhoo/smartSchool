import React from "react";
import {getLoginInfo} from "@/pages";

/**
 * 是否是老师
 * @returns {boolean}
 */
export function isTeacher() {
  return getLoginInfo().user_type == '2';
}

export default class TeacherWrapper extends React.Component {

  render() {
    if (!isTeacher()) {
      return null;
    } else {
      return this.props.children;
    }
  }

}
