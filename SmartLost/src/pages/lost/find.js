import React from "react";
import PageContainer from "@/components/PageContainer";
import AppCommon from "@/utils/AppCommon";
import LostApi from "@/https/apis/LostApi";
import Flex from "@/components/Flex";
import Common from "@/utils/Common";
import {Picker, WhiteSpace, Button, List, InputItem, TextareaItem} from 'antd-mobile';
import styles from "@/pages/lost/find.less";
import ImagePicker from "@/components/ImagePicker";

//设置校区，卡类选择类容
const campus_idVaule = [
  {
    label:
      (<div>
        <span>小和山校区</span>
      </div>),
    value: '1',
  },
  {
    label:
      (<div>
        <span>安吉校区</span>
      </div>),
    value: '2',
  }
];
export default class index extends React.Component {
  constructor(props, context) {
    super(props, context);
    let {query} = this.props.location;
    this.state = {
      id: query.id,
      data: [],
      loading: false,
      campus_id: "",
      cols: 1,
      campus_idValue: "",
      type: "",
      typeValue: [],
      campusVaule:[],
      name: "",
      time: "",
      place: "",
      tag: "",
      content: "",
      images: "",
      files: "",
    };
  }

  componentDidMount() {
    this.get_type();
    this.get_campus();
  }

////////////////逻辑方法
  //获取类型
  get_type() {
    const {id} = this.state;
    LostApi.get_type(id).then(res => {
      if (res.code === 200) {
        this.setState({typeValue: res.data, loading: false});
      } else {
        AppCommon.showRespError(res);
      }
    })
  }

  //获取校区
  get_campus() {
    const {id} = this.state;
    LostApi.get_campus("21", "1", "123456", id).then(res => {
      if (res.code === 200) {
        this.setState({campusVaule: res.data, loading: false});
      } else {
        AppCommon.showRespError(res);
      }
    })
  }

  //修改校区
  onChangecampus_id = (campus_idVaule) => {
    this.setState({
      campus_id: campus_idVaule,
    });
  };
  //修改物品类型
  onChangetype = (typeValue) => {
    this.setState({
      type: typeValue,
    });
  };
  //图片上传
  onChange = (file, method) => {
    let oldImage = this.state.images;
    let images = '';
    if (method === 'add') {
      Common.uploadFile(file).then(path => {
        if (!Common.isEmpty(oldImage)) {
          images = oldImage + ',' + path;
        } else {
          images = path;
        }
        this.setState({
          images: images
        })
      }).catch(e => {
        console.log(e);
      })
    }
  }
  //提交方法
  submit = (images, name, id, time, place, tag, type, content, campus_id) => {
    LostApi.submit(images, name, id, time, place, tag, type, content, campus_id).then(res => {
      if (res.code === 200) {
        alert('成功');
      } else {
        AppCommon.showRespError(res);
      }
    })
  }
  ////////////////////////////////// 页面渲染
  render() {
    const {
      typeValue, loading, id, type, campus_id,
      name, time, place, tag, content, images,campusVaule
    } = this.state;



    const tType = typeValue.map(item => {
      return {label: item.name, value: item.id}
    });

    const campusV = campusVaule.map(item => {
      return {label: item.name, value: item.id}
    });

    return <PageContainer title={'物主连连看'} loading={loading}>
      <Flex direction={"column"}>
        <List>
          <Picker
            data={campus_idVaule}
            value={this.state.campus_id}
            cols={1}
            onChange={this.onChangecampus_id}
          >
            <List.Item arrow="horizontal">校区</List.Item>
          </Picker>
        </List>
        <WhiteSpace></WhiteSpace>
        <WhiteSpace></WhiteSpace>
        <List>
          <Picker
            data={tType}
            value={this.state.type}
            cols={1}
            onChange={this.onChangetype}
          >
            <List.Item arrow="horizontal">类型</List.Item>
          </Picker>
        </List>
        <WhiteSpace></WhiteSpace>
        <InputItem
          type={type}
          placeholder="请填写物品名称"
          clear
          onChange={(value) => this.setState({name: value})}
          onBlur={(value) => this.setState({name: value})}
        >物品名称</InputItem>
        <List renderHeader={() => ''}>
          <InputItem
            type={type}
            placeholder="请填写丢失时间"
            clear
            onChange={(value) => this.setState({time: value})}
            onBlur={(value) => this.setState({time: value})}
          >丢失时间</InputItem>
        </List>
        <List renderHeader={() => ''}>
          <InputItem
            type={type}
            placeholder="请填写丢失地点"
            clear
            onChange={(value) => this.setState({place: value})}
            onBlur={(value) => this.setState({place: value})}
          >丢失地点</InputItem>
        </List>
        <List renderHeader={() => ''}>
          <InputItem
            type={type}
            placeholder="请填写物主信息"
            clear
            onChange={(value) => this.setState({tag: value})}
            onBlur={(value) => this.setState({tag: value})}
          >物主信息</InputItem>
        </List>
        <List renderHeader>
          <TextareaItem
            rows={5}
            count={300}
            placeholder="请填写物品描述（300个字符以内）"
            ref={el => this.autoFocusInst = el}
            autoHeight
            onChange={(value) => this.setState({content: value})}
            onBlur={(value) => this.setState({content: value})}
          />
        </List>
        <WhiteSpace></WhiteSpace>
        <WhiteSpace></WhiteSpace>
        <Flex className={styles.imgPick}>
          <ImagePicker className={styles.inline} files={Common.splitObj(images, ',')} onChange={this.onChange}
          />
        </Flex>
        <Button className={styles.but2} type="primary" onClick={() => this.submit(images, name,
          id, time, place, tag, type, content, campus_id)}>提交</Button>
        <Button className={styles.but} type="primary"
                onClick={() => AppCommon.routerPush('/lost')}>返回</Button>
        <div className={styles.bottom}></div>
      </Flex>
    </PageContainer>;
  }
}
