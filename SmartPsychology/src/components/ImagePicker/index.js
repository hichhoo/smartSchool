import React from "react";
import PropTypes from "prop-types";
import Flex from "@/components/Flex";
import iconAdd from './icon_add.png';
import iconClose from './icon_close.png';

export default class ImagePicker extends React.Component {

  state = {
    inputValue: '',
  };

  ////////////////////////////////// 逻辑方法


  ////////////////////////////////// 页面渲染

  render() {
    const {files = [], showUpload = false, editAble = false, style, onChange} = this.props;
    const {inputValue} = this.state;
    let width = window.innerWidth / 5;
    let itemStyle = {
      width, height: width, objectFit: 'cover',
      boxSizing: 'border-box', borderRadius: '3px',
    };

    return <Flex wrap={"wrap"} style={style}>
      {files.map(path => {
        return <Flex style={{...itemStyle, marginRight: 10}} key={path}>
          <img alt={''} src={path} style={itemStyle}/>
          {editAble && <img
            alt={''} src={iconClose}
            style={{width: 20, height: 20, position: 'absolute', top: 0, right: 0, padding: 2}}
            onClick={() => {
              editAble && onChange && onChange(path, 'delete');
            }}
          />}
        </Flex>
      })}
      {(editAble && showUpload) &&
      <Flex>
        <img
          alt={''} src={iconAdd}
          style={{...itemStyle, border: '1px solid #dbdbdb', padding: 12}}
        />
        <input
          type={'file'} value={inputValue} style={{...itemStyle, opacity: 0, position: 'absolute', top: 0, left: 0}}
          onChange={e => {
            editAble && onChange && onChange(e.target.files[0], 'add');
            this.setState({inputValue})
          }}
        />
      </Flex>}
    </Flex>
  }

}

ImagePicker.propTypes = {
  files: PropTypes.array,
  style: PropTypes.any,
  showUpload: PropTypes.bool,
  editAble: PropTypes.bool,
  onChange: PropTypes.any,
};
