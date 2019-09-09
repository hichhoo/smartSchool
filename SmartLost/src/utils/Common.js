import AppCommon from "@/utils/AppCommon";

export default {


  /**
   * 获取Url中的参数
   */
  getParamFormUrl: (key, host) => {
    let arr;
    let reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)');
    try {
      let testHost = window.location.href;
      if (host) {
        testHost = host;
      }
      if ((arr = testHost.split('?')[1].match(reg))) {
        return decodeURI(arr[2]);
      }
    } catch (e) {
    }
    return '';
  },

  /**
   * 是否为空
   * @param value
   * @returns {boolean}
   */
  isEmpty: (value) => {
    return value === undefined || value === null || value === '';
  },

  /**
   * 设置默认值
   * @param value
   * @param def
   */
  initValue: (value, def) => {
    return (value === undefined || value === null || value === '') ? def : value;
  },


  /**
   * 转换为json
   * @param value
   */
  parseJSON: (value) => {
    let obj;
    try {
      obj = JSON.parse(value);
    } catch (e) {
    }
    if (!obj) {
      obj = {};
    }
    return obj;
  },


  /**
   * 将array中的某个key用sep连接起来
   * @param array
   * @param key
   * @param sep
   */
  arrayKeys: (array = [], key = 'id', sep = ',') => {
    let result = '';
    array.forEach(item => {
      if (typeof item === 'object') {
        result = result + item[key];
      } else {
        result = result + item;
      }
      result = result + sep;
    });
    result = result.substring(0, result.length - sep.length);
    return result;
  },

  /**
   * 合并数据
   * @param obj
   * @param val
   */
  mergeObj: (obj, val) => {
    return {...obj, ...val};
  },


  /**
   * 获取文件的后缀
   * @param fileName
   * @return {*}
   */
  getFileExt: (fileName) => {
    let array = fileName.split('.');
    return '.' + array[array.length - 1];
  },


  /**
   * 分割对象
   * @param obj
   * @param sep
   */
  splitObj: (obj, sep = ',') => {
    if (obj) {
      return obj.split(sep);
    }
    return [];
  },


  /**
   * 加载js到script
   * @param url
   * @param callback
   */
  loadJsToScript: (url, callback) => {
    let oldScript = document.getElementById(url);
    if (oldScript) {
      if (oldScript.ready) {
        callback && callback();
        return;
      } else {
        document.body.removeChild(oldScript);
      }
    }
    let script = document.createElement('script');
    script.id = url;
    script.src = url;
    script.onload = script.onreadystatechange = () => {
      if (script.ready) {
        return;
      }
      if (!script.readyState //这是FF的判断语句，因为ff下没有readyState这个值，IE的readyState肯定有值
        || script.readyState === "loaded" || script.readyState === 'complete' // 这是IE的判断语句
      ) {
        script.ready = true;
        callback && callback();
      }
    };
    document.body.appendChild(script);
  },


  /**
   * 上传图片
   */
  uploadFile: (file) => {
    return new Promise((resove,reject) => {
      AppCommon.showLoading('图片上传中');
      let fileData = new FormData();
      fileData.append('file', file);
      let request = new XMLHttpRequest();
      request.open("POST", "/tools/File/upload_file_local");
      request.onreadystatechange = ev => {
        if (ev.currentTarget.readyState === 4) {
          let res = JSON.parse(ev.currentTarget.responseText);
          AppCommon.hideMessage();
          if (res.code === 200) {
            resove && resove(res.data);
          } else {
            reject && reject(res);
            AppCommon.showRespError(res);
          }
        }
      };
      request.send(fileData);
    })
  },


}


