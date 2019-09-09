import React from "react";
import {Picker} from "antd-mobile";
import request from "@/https/request";
import AppCommon from "@/utils/AppCommon";
import Common from "@/utils/Common";
import styles from "@/components/Location/index.less";
import Flex from "@/components/Flex";

export default class index extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      provList: [],
      cityList: [],
      areaList: [],
      streetList: [],

      provSel: {},
      citySel: {},
      areaSel: {},
      streetSel: {},
    };
  }

  componentDidMount() {
    this.getAddress(1);
  }

  //////////////////////// 逻辑方法

  /**
   * 获取对应的数据
   */

  getAddress(type, target_id = 0) {
    request('/tools/area/get_administrative_division', {method: 'POST', data: {target_id, type}}).then(res => {
      if (res.code === 200) {
        let arr = res.data.map(item => {
          return {label: item.name, value: item.id, obj: item};
        });
        arr.push({value: 0, label: '其他'});
        let newState = {};
        if (type == 1) {
          newState.provList = arr;
        } else if (type == 2) {
          newState.cityList = arr;
        } else if (type == 3) {
          newState.areaList = arr;
        } else if (type == 4) {
          newState.streetList = arr;
        }
        this.setState({...newState});
      } else {
        AppCommon.showRespError(res);
      }
    })
  }


  onSelectValue = () => {
    const {provSel, citySel, areaSel, streetSel} = this.state;
    const {onChange} = this.props;
    onChange && onChange([provSel, citySel, areaSel, streetSel]);
  };

  //////////////////////// 页面渲染

  render() {
    const {provList, cityList, areaList, streetList} = this.state;
    let provSel = Common.initValue(this.props.provSel, this.state.provSel);
    let citySel = Common.initValue(this.props.citySel, this.state.citySel);
    let areaSel = Common.initValue(this.props.areaSel, this.state.areaSel);
    let streetSel = Common.initValue(this.props.streetSel, this.state.streetSel);

    return <Flex direction={"column"} className={styles.location}>
      <Picker
        data={provList} cols={1}
        onOk={values => {
          let obj = provList.find(item => item.value == values[0]);
          this.setState({provSel: obj, citySel: {}, areaSel: {}, streetSel: {}}, () => {
            this.onSelectValue();
            this.getAddress(2, obj.value);
          })
        }}
      >
        <Flex className={styles.item}>
          <Flex itemGrow={1} className={styles.label}>省份</Flex>
          <Flex>{Common.initValue(provSel.label, '请选择省份')}</Flex>
        </Flex>
      </Picker>
      <Picker
        data={cityList} cols={1} value={[citySel.value]}
        onOk={values => {
          let obj = cityList.find(item => item.value == values[0]);
          if (Common.isEmpty(obj)) {
            return;
          }
          this.setState({citySel: obj, areaSel: {}, streetSel: {}}, () => {
            this.onSelectValue();
            this.getAddress(3, obj.value)
          })
        }}
      >
        <Flex className={styles.item}>
          <Flex itemGrow={1} className={styles.label}>城市</Flex>
          <Flex>{Common.initValue(citySel.label, '请选择城市')}</Flex>
        </Flex>
      </Picker>
      <Picker
        data={areaList} cols={1} value={[areaSel.value]}
        onOk={values => {
          let obj = areaList.find(item => item.value == values[0]);
          if (Common.isEmpty(obj)) {
            return;
          }
          this.setState({areaSel: obj, streetSel: {}}, () => {
            this.onSelectValue();
            this.getAddress(4, obj.value)
          })
        }}
      >
        <Flex className={styles.item}>
          <Flex itemGrow={1} className={styles.label}>地区</Flex>
          <Flex>{Common.initValue(areaSel.label, '请选择地区')}</Flex>
        </Flex>
      </Picker>
      <Picker
        data={streetList} cols={1} value={[streetSel.value]}
        onOk={values => {
          let obj = streetList.find(item => item.value == values[0]);
          if (Common.isEmpty(obj)) {
            return;
          }
          this.setState({streetSel: obj}, this.onSelectValue)
        }}
      >
        <Flex className={styles.item} style={{border: 'none'}}>
          <Flex itemGrow={1} className={styles.label}>街道</Flex>
          <Flex>{Common.initValue(streetSel.label, '请选择街道')}</Flex>
        </Flex>
      </Picker>

    </Flex>;
  }
}
