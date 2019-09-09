import React from "react";
import PageContainer from "@/components/PageContainer";
import AppCommon from "@/utils/AppCommon";
import Flex from "@/components/Flex";
import {Button, InputItem, Picker} from "antd-mobile";
import Common from "@/utils/Common";
import styles from './index.less';
import PermissionApi from "@/pages/admin/apis/PermissionApi";
import Radio from "@/components/Radio";

export const RoleLevel = [
  {value: '1', label: '普通成员'},
  {value: '2', label: '管理员'},
];

export const RoleLevelObj = {
  '1': '普通成员',
  '2': '管理员',
};

export default class index extends React.Component {

  state = {
    roles: [],
    selRole: '',
    roleUser: [],

    departments: [],
    selDepartment: '',
    showDepartment: false,

    selLevel: '1',

    teachers: [],
    students: [],
    selTargetUserId: '',

  };

  componentWillMount() {
    this.roleObj = {};
    this.departmentObj = {};
  }

  componentDidMount() {
    this.getRoles();
  }

  ////////////////////////// 逻辑方法


  getRoles() {
    PermissionApi.getRoles().then(res => {
      if (res.code === 200) {
        let roles = res.data.map(item => {
          this.roleObj[item.id] = item;
          return {value: item.id, label: item.name};
        });
        this.setState({roles, selRole: res.data[0].id}, this.getRoleUser);
      } else {
        AppCommon.showRespError(res);
      }
    })
  }

  /**
   * 获取角色下的用户
   */
  getRoleUser = () => {
    const {selRole, selDepartment} = this.state;
    let roleItem = this.roleObj[selRole];
    if (roleItem.type !== '0' && Common.isEmpty(selDepartment)) {
      this.getTargetDepartment();
      return;
    }
    PermissionApi.getRoleUser({role_id: selRole, target_id: selDepartment})
      .then(res => {
        if (res.code === 200) {
          this.setState({roleUser: res.data});
        } else {
          AppCommon.showRespError(res);
        }
      })
  };

  /**
   * 获取角色对应的学院
   */
  getTargetDepartment() {
    const {selRole} = this.state;
    PermissionApi.getTargetDepartment({role_id: selRole}).then(res => {
      if (res.code === 200) {
        let departments = res.data.map(item => {
          this.departmentObj[item.id] = item;
          return {value: item.id, label: item.name};
        });
        this.setState({departments});
      } else {
        AppCommon.showRespError(res);
      }
    })
  }


  /**
   * 获取role名称
   */
  getRoleName() {
    let obj = this.roleObj[this.state.selRole];
    if (obj) {
      return obj.name;
    }
    return '请选择';
  }

  getDepartmentName() {
    let obj = this.departmentObj[this.state.selDepartment];
    if (obj) {
      return obj.name;
    }
    return '请选择';
  }

  getRoleLevel() {
    const {selLevel} = this.state;
    return RoleLevel.find(item => item.value === selLevel);
  }

  /**
   * 搜索用户
   */
  searchUser = () => {
    AppCommon.showLoading('查找中');
    PermissionApi.getTargetStudent(this.searchId).then(res => {
      AppCommon.hideMessage();
      if (res.code === 200) {
        this.setState({students: res.data});
      } else {
        AppCommon.showRespError(res);
      }
    });
    PermissionApi.getTargetTeacher(this.searchId).then(res => {
      if (res.code === 200) {
        this.setState({teachers: res.data});
      } else {
        AppCommon.showRespError(res);
      }
    })
  };

  /**
   * 提交人员
   */
  submitUser = () => {
    const {selLevel, selRole, selDepartment, selTargetUserId} = this.state;
    if (Common.isEmpty(selTargetUserId)) {
      AppCommon.showToast('请选择负责人', 'fail');
      return;
    }
    PermissionApi.addRoleUser({
      level: selLevel, role_id: selRole, target_id: selDepartment,
      target_user_id: selTargetUserId
    }).then(res => {
      if (res.code === 200) {
        AppCommon.showToast('添加成功');
        this.setState({teachers: [], students: [], selTargetUserId: ''});
      } else {
        AppCommon.showRespError(res);
      }
    })
  };

  ////////////////////// 页面渲染

  /**
   * 渲染结果
   */
  renderSearch() {
    const {teachers, students, selTargetUserId} = this.state;
    let data = teachers.concat(students);
    return <Flex direction={"column"}>
      {data.map(item => {
        return <Flex
          key={item.id} className={styles.radioItem} alignItems={"center"}
          onClick={() => this.setState({selTargetUserId: item.id})}
        >
          <Flex itemGrow={1} alignItems={"center"}>{`${item.name}（${item.id}）`}</Flex>
          {selTargetUserId === item.id && <Radio size={16} checked/>}
        </Flex>
      })}
    </Flex>

  }

  render() {
    const {roles, showDepartment, departments} = this.state;

    return <PageContainer title={'工作人员添加'} loading={false}>
      <Flex className={styles.index + ' ' + styles.overflowHide} direction={"column"}>
        <Flex direction={"column"} itemGrow={1} className={styles.overflowAuto}>
          <Picker
            cols={1} data={RoleLevel}
            onOk={value => {
              this.setState({selLevel: value[0]});
            }}
          >
            <Flex className={styles.picker}>
              <Flex itemGrow={1}>权限级别：</Flex>
              <Flex className={styles.pickerSel}>{this.getRoleLevel().label}</Flex>
            </Flex>
          </Picker>
          <Picker
            cols={1} data={roles}
            onOk={value => {
              let obj = this.roleObj[value[0]];
              this.setState({selRole: value, showDepartment: obj.type === '3'}, this.getRoleUser);
            }}
          >
            <Flex className={styles.picker}>
              <Flex itemGrow={1}>角色选择：</Flex>
              <Flex className={styles.pickerSel}>{this.getRoleName()}</Flex>
            </Flex>
          </Picker>

          {showDepartment &&
          <Picker
            cols={1} data={departments}
            onOk={value => {
              this.setState({selDepartment: value}, this.getRoleUser);
            }}
          >
            <Flex className={styles.picker}>
              <Flex itemGrow={1}>学院选择：</Flex>
              <Flex className={styles.pickerSel}>{this.getDepartmentName()}</Flex>
            </Flex>
          </Picker>
          }

          <Flex className={styles.pickerInput} alignItems={"center"}>
            <Flex itemGrow={1} alignItems={"center"}>负责人查找：</Flex>
            <Flex className={styles.pickerSel}>
              <InputItem
                placeholder={'输入学号/工号进行搜索'}
                onChange={value => {
                  this.searchId = value;
                }}
              />
            </Flex>
            <Flex
              className={styles.searchBtn} alignItems={"center"}
              onClick={this.searchUser}>查找</Flex>
          </Flex>
          {this.renderSearch()}

        </Flex>

        <Flex>
          <Button
            className={styles.confirmBtn} type={"primary"}
            onClick={this.submitUser}
          >提交</Button>
        </Flex>
      </Flex>
    </PageContainer>
  }


}
