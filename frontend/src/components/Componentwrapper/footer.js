import { Col, List, Row} from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import Dashboard from '../Dashboard';
import { FacebookOutlined, InstagramOutlined, YoutubeOutlined} from '@ant-design/icons';

function footer() {
    return (
        <div>
            {/* <List style={{ backgroundColor: 'yellow', padding: '2%' }}>
                <List.Item>

                    <List.Item.Meta title="yummytummy"
                        style={{ marginTop: 0, textAlign: "start", justifyContent: "flex-start" }}
                        description="SRH Heidelberg" />

                    <List.Item.Meta title="upma"
                        description={<div>
                            <p>how to make easy</p>
                            <p>how to make easy</p>
                            <p>how to make easy</p>
                            <p>how to make easy</p>
                        </div>} />

                    <List.Item.Meta title="About"
                        description="in this recipe we are making upma" />

                    <List.Item.Meta title="Contact"
                        description="in this recipe we are making upma" />
                </List.Item>

                        </List> */}
            <Row style={{ backgroundColor: 'yellow', padding: '2%', justifyContent: "space-between" }}>
                <div>
                    <h2>yummytummy</h2>
                    <p>Leave your cooking worries behind and embark on a delicious journey with our website's user-friendly recipes</p>

                </div>
                <div style={{display:'flex', flexDirection:'column'}}>
                    <h2>Recipes</h2>
                    <Link to={"/"} style={{ color: 'black', fontSize: 15 }}>
                        How to 
                    </Link>
                    <Link to={"/"} style={{ color: 'black', fontSize: 15 }}>
                        Kitchen Basics
                    </Link>
                </div>
                <div style={{display:'flex', flexDirection:'column'}}>
                    <h2>About</h2>
                    <Link to={"/"} style={{ color: 'black', fontSize: 15}}>
                        About us
                    </Link>
                    <Link to={"/"} style={{ color: 'black', fontSize: 15 }}>
                        contact
                    </Link>

                </div>

                <div style={{display:'flex', flexDirection:'column'}}>
                    <h2>Contact</h2>
                    <Link to={"https://www.facebook.com/login/"} style={{ color: 'black', fontSize: 15 }}>
                    <FacebookOutlined 
                    style={{
                        fontSize: "25px",
                        color:'white',
                        background:'blue'}}
                         /> {"   "}
                        facebook
                    </Link>

                    <Link to={"https://www.instagram.com/accounts/login/"} style={{ color: 'black', fontSize: 15 }}>
                    <InstagramOutlined 
                          style={{
                            fontSize: "25px",
                            color:'#E4405F',
                            background:'white'}}
                            /> {"   "}
                        instagram
                    </Link>

                    <Link to={"https://www.youtube.com/"} style={{ color: 'black' }}>
                    <YoutubeOutlined 
                    style={{
                        fontSize: "25px",
                        color:'white',
                        background:'red'}}
                    /> {"   "}
                        youtube
                    </Link>
                </div>
            </Row>
        </div>
    )
}

export default footer