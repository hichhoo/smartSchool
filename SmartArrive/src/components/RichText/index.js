import React from "react";
import styles from './index.less';
import PropTypes from "prop-types";


export default class RichText extends React.Component {

  constructor(props, context) {
    super(props, context);
    let content = this.props.content;
    this.state = {content};
  }

  componentWillReceiveProps(nextProps, nextContext) {
    this.setState({content: nextProps.content});
  }


  render() {
    const {content} = this.state;
    const {style} = this.props;
    return <div className={styles.richText} style={style}>
       <pre>
        <div dangerouslySetInnerHTML={{__html: content}}/>
        </pre>
    </div>
  }

}

RichText.propTypes = {
  style: PropTypes.any,
  content: PropTypes.any,
};
