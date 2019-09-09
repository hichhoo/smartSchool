import React from "react";
import PageContainer from "@/components/PageContainer";
import AppCommon from "@/utils/AppCommon";
import LostApi from "@/https/apis/LostApi";
import Flex from "@/components/Flex";
import styles from "@/pages/Lost/notice.less";
import {  Button} from 'antd-mobile';

export default class index extends React.Component {
    constructor(props, context) {
        super(props, context);
        let { query } = this.props.location;
        this.state = {
            id: query.id,
            data: {},
            loading: true,
        };
    }

    componentDidMount() {
        this.get_publicinfo();
    }

    ////////////////////////////////// 逻辑方法

    /**
     * 获取数据
     */

    get_publicinfo() {
        const { id } = this.state;
        LostApi.get_publicinfo(id).then(res => {
            if (res.code === 200) {
                this.setState({ data: res.data, loading: false });
            } else {
                AppCommon.showRespError(res);
            }
        })
    };


    ////////////////////////////////// 页面渲染

    render() {
        const { data, loading } = this.state;
        console.log(data.content);
        return <PageContainer title={'公告'} loading={loading}>
            <Flex direction={"column"}>
            <div className={styles.con}>
            {data.content}
            <span>→→→食堂一楼大堂副理值班时间：</span>
            <br></br>
            <br></br>
            <span>周一至周五：中午11:30-13:00,下午16:30-18:00 </span>
            <br></br>
            <br></br>
            <span>周六：中午12:00-13:00</span>
            <br></br>
            <br></br>
            <span>1.我捡到了别人的失物怎么办？</span>
            <br></br>
            <br></br>
            <span>答：交到食堂一楼大堂副理处就ok了，她们会进行后续工作的。</span>
            <br></br>
            <br></br>
            <span>2.我丢了东西怎么办？</span>
            <br></br>
            <br></br>
            <span>答：及时发布寻物启事（寻物启事审核需要一段时间，不会立马出现的哟） 
                接下来，多多关注“物主连连看”，等着你的失物被人捡到，去食堂一楼大堂副理
                处领取就行啦。</span>
            <br></br>
            <br></br>
            <span>3. 线上拾到物品信息，与，食堂一楼大堂副理处失物招领柜子里的物品，时时同步。</span>
            </div>
                <Button className={styles.button} type="primary" 
                onClick={() => AppCommon.routerPush('/lost')}>返回</Button>
            <div className={styles.bottom}></div>
            </Flex>
        </PageContainer>;
    }
}

