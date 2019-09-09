import React from "react";
import PageContainer from "@/components/PageContainer";
import AppCommon from "@/utils/AppCommon";
import styles from './index.less';
import Flex from "@/components/Flex";
import {Button, Modal, Picker} from "antd-mobile";
import Common from "@/utils/Common";
import {RoleLevelObj} from "@/pages/admin/add";
import PermissionApi from "@/pages/admin/apis/PermissionApi";
import ListContainer from "@/components/ListContainer";

const alert = Modal.alert;

export default class index extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.roleObj = {};
    this.departmentObj = {};

    this.state = {
      loading: true,
      roles: [],
      selRole: '',
      roleUser: [],

      departments: [],
      selDepartment: '',
      showDepartment: false,
    };
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
    if (roleItem.type === '3' && Common.isEmpty(selDepartment)) {
      this.getTargetDepartment();
      return;
    }
    AppCommon.showLoading("获取用户中");
    let target_id = selDepartment;
    if (roleItem.type !== '3') {
      target_id = '';
    }
    PermissionApi.getRoleUser({role_id: selRole, target_id}).then(res => {
      AppCommon.hideMessage();
      if (res.code === 200) {
        this.setState({roleUser: res.data, loading: false});
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


  /**
   * 删除角色
   */
  deleteUser(record) {
    const {selRole, selDepartment} = this.state;
    alert('温馨提示', '确定要删除该人员？', [
      {text: '取消'},
      {
        text: '确定', onPress: () => {
          AppCommon.showLoading("数据提交中");
          PermissionApi.deldRoleUser({
            role_id: selRole, target_id: selDepartment,
            level: record.role_level, target_user_id: record.user_id,
          }).then(res => {
            AppCommon.hideMessage();
            if (res.code === 200) {
              AppCommon.showToast('操作成功');
              this.getRoleUser();
            } else {
              AppCommon.showRespError(res);
            }
          })
        }
      },
    ])
  }

  ////////////////////// 页面渲染

  /**
   * 渲染角色用户
   */
  renderRoleUser() {
    const {roleUser} = this.state;
    return <ListContainer count={roleUser.length} tips={'暂无数据哟'}>
      <Flex direction={"column"}>
        {roleUser.map(item => {
          return <Flex key={item.user_id} className={styles.userItem}>
            <Flex itemGrow={1} alignItems={"center"}>
              {`${item.user_name}(${item.user_id}) , ${RoleLevelObj[item.role_level]}`}
            </Flex>
            <Flex
              className={styles.itemDelete} alignItems={"center"}
              onClick={() => this.deleteUser(item)}
            >删除</Flex>
          </Flex>
        })}
      </Flex>
    </ListContainer>
  }

  render() {
    const {roles, showDepartment, departments, loading} = this.state;

    return <PageContainer title={'人员管理'} loading={loading}>
      <div className={styles.index}>
        <Flex className={styles.label} alignItems={"center"}>
          <Flex className={styles.labelHeader} itemGrow={1}>人员列表</Flex>
          <Button className={styles.labelAdd} type={'primary'}
                  onClick={() => AppCommon.routerPush('/admin/add')}
          >添加人员</Button>
        </Flex>
        <Picker
          cols={1} data={roles}
          onOk={value => {
            let obj = this.roleObj[value[0]];
            this.setState({
              selRole: value[0], roleUser: [],
              showDepartment: obj.type === '3'
            }, this.getRoleUser);
          }}
        >
          <Flex className={styles.picker} style={{marginTop: 8}}>
            <Flex itemGrow={1}>角色选择：</Flex>
            <Flex className={styles.pickerSel}>{this.getRoleName()}</Flex>
          </Flex>
        </Picker>

        {showDepartment &&
        <Picker
          cols={1} data={departments}
          onOk={value => {
            this.setState({selDepartment: value[0]}, this.getRoleUser);
          }}
        >
          <Flex className={styles.picker}>
            <Flex itemGrow={1}>学院选择：</Flex>
            <Flex className={styles.pickerSel}>{this.getDepartmentName()}</Flex>
          </Flex>
        </Picker>
        }

        {this.renderRoleUser()}

      </div>
    </PageContainer>
  }


}
