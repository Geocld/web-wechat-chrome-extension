import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Badge from 'material-ui/Badge';
import Avatar from 'material-ui/Avatar';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';
import './App.css';

class App extends Component {

    state = {
        hasOpenWx: false,
        isLogin: false,
        userInfo: null,
        chatList: [] // 聊天列表
    }

    componentWillMount()  {

        // 监听content script那边发送过来的数据（聊天列表、用户列表）
        chrome.runtime.onMessage.addListener((request) => {
            if (request.chatList) {
                this.setState({
                    chatList: request.chatList.chatList
                });
                console.log(this.state.chatList)
            }
        });

        chrome.windows.getAll({
            populate: true
        }, (wins) => {
            wins.forEach(win => {
                win.tabs.forEach(tab => {
                    if (/wx\.qq\.com/ig.test(tab.url)) {
                        this.setState({
                            hasOpenWx: true
                        });

                        chrome.tabs.sendMessage(tab.id, {getChatList: true}, function(response){
                            console.log('message has send to wxobserve.js')
                        });

                        chrome.tabs.executeScript(tab.id, {
                            file: 'chrome/wxInfo.js'
                        }, res => {
                            let info = res[0];
                            if (!!info.avatar && !!info.nickname) { // 已登录，显示头像及昵称
                                this.setState({
                                    isLogin: true,
                                    userInfo: info
                                });
                            } else {
                                this.setState({
                                    isLogin: false
                                });
                            }
                        });
                    }
                });
            });
        });
    }

    viewWx = () => {
        let windowId = null;
        chrome.windows.getAll({
            populate: true
        }, function (windows) {
            windows.forEach(function (win) {
                if (win.tabs.length) {
                    win.tabs.forEach(function (tab) {
                        if (/wx\.qq\.com/ig.test(tab.url)) {
                            windowId = tab.windowId;
                        }
                    });
                }
            });

            if (windowId) {
                chrome.windows.update(windowId, {focused: true});
                window.close();
            } else {
                chrome.windows.create({
                    url: 'https://wx.qq.com',
                    type: 'popup',
                    focused: true
                }, function (w) {
                    console.log(w);
                    window.close();
                });
            }
        });
    }

    activeChat = (username) => {
        chrome.windows.getAll({
            populate: true
        }, (wins) => {
            wins.forEach(win => {
                win.tabs.forEach(tab => {
                    if (/wx\.qq\.com/ig.test(tab.url)) {
                        this.setState({
                            hasOpenWx: true
                        });

                        chrome.tabs.sendMessage(tab.id, {username: username}, function(response){
                            console.log('message has send to wxobserve.js')
                        });
                        this.viewWx();
                    }
                });
            });
        });
    }

    loginout = () => {
        chrome.windows.getAll({
            populate: true
        }, (wins) => {
            wins.forEach(win => {
                win.tabs.forEach(tab => {
                    if (/wx\.qq\.com/ig.test(tab.url)) {
                        this.setState({
                            hasOpenWx: true
                        });

                        chrome.tabs.sendMessage(tab.id, {loginout: true}, function(response){
                            console.log('message has send to wxobserve.js')
                        });
                        window.close();
                    }
                });
            });
        });
    }

    _renderLogo = () => {
        const {isLogin} = this.state;
        return (
            isLogin ? null : (
                <div className="wxLogo">
                    <img src={ require('./img/wx.jpg') } alt='' style={{width: '100%', verticalAlign: 'top'}}/>
                </div>
            )
        )
    }

    _renderUserInfo = () => {
        const {isLogin, userInfo} = this.state;
        return (
            (isLogin && !!userInfo) ? (
                <MuiThemeProvider>
                    <List>
                        <ListItem
                            disabled={true}
                            leftAvatar={
                                <Avatar src={ userInfo.avatar } />
                            }
                        >
                            <div className="nickname" style={{ position: 'relative' }}>
                                { userInfo.nickname }
                                <span className="loginout" onClick={this.loginout}>退出</span>
                            </div>
                        </ListItem>
                    </List>
                </MuiThemeProvider>
            ) : null
        )
    }

    _renderUnRead = () => {
        const {isLogin, userInfo} = this.state;
        if (!isLogin) {
            return null;
        } else {
            let readStr = '';
            if (!!userInfo && !userInfo.unreadCount) {
                readStr = '暂无未读消息';
            } else if (!!userInfo && userInfo.unreadCount <= 999) {
                readStr = `未读消息(${userInfo.unreadCount})`;
            } else if (!!userInfo && userInfo.unreadCount > 999) {
                readStr = '未读消息(999+)';
            }
            return (
                <div className="unread">
                    <span className="unread-num">{ readStr }</span>
                    <span className="view" onClick={this.viewWx} style={{ 'display': userInfo.unreadCount ? 'inline-block' : 'none' }}>查看></span>
                </div>
            )
        }
    }

    _renderButton = () => {
        const { isLogin } = this.state;
        return (
            <div style={{ borderTop: '1px solid rgba(255, 255, 255, .4)' }}>
                <MuiThemeProvider>
                    <FlatButton label={ isLogin ? '进入完整版' : '登录' }
                                fullWidth={true}
                                labelStyle={{ color: '#fff' }}
                                onClick={this.viewWx}
                    />
                </MuiThemeProvider>
            </div>
        )
    }

    _renderChatList = () => {
        const {isLogin, userInfo, chatList} = this.state;
        if (!isLogin) {
            return null;
        } else {
            if (!chatList.length) {
                return (
                    <MuiThemeProvider>
                        <div style={{textAlign: 'center'}}>
                            <CircularProgress />
                            <div style={{fontSize: '12px', paddingBottom: '10px'}}>聊天列表获取中...</div>
                        </div>
                    </MuiThemeProvider>
                )
            }
            return (
                <MuiThemeProvider>
                    <List className="list">
                        {
                            chatList.map((item, idx) => {
                                return (
                                    <div key={idx}>
                                        <ListItem
                                            leftAvatar={
                                                !!item.NoticeCount ?
                                                    item.MMInChatroom && item.Statues == 0 ? (
                                                    <Badge
                                                        style={{ top: '-2px', left: '4px' }}
                                                        badgeContent={''}
                                                        secondary={true}
                                                        badgeStyle={{
                                                            top: 20,
                                                            right: 20,
                                                            width: '12px',
                                                            height: '12px',
                                                            fontSize: '10px',
                                                            backgroundColor: '#d44139'
                                                        }}
                                                    >
                                                        <Avatar src={'https://wx.qq.com' + item.HeadImgUrl} />
                                                    </Badge>
                                                ) : (
                                                    <Badge
                                                        style={{ top: '-2px', left: '4px' }}
                                                        badgeContent={item.NoticeCount}
                                                        secondary={true}
                                                        badgeStyle={{
                                                            width: 16,
                                                            height: 16,
                                                            top: 20,
                                                            right: 20,
                                                            backgroundColor: '#d44139'
                                                        }}
                                                    >
                                                        <Avatar src={'https://wx.qq.com' + item.HeadImgUrl} />
                                                    </Badge>
                                                )
                                             : (
                                                    <Avatar src={'https://wx.qq.com' + item.HeadImgUrl} />

                                                )
                                            }
                                            primaryText={
                                                <div className="chatNickName">
                                                    { item.NickName }
                                                    {
                                                        !!item.MMDigestTime ? <span className="time">{ item.MMDigestTime }</span> : null
                                                    }
                                                </div>
                                            }
                                            secondaryText={
                                                <p>
                                                    <span style={{color: '#989898', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block'}}>
                                                        {!!item.NoticeCount && item.MMInChatroom && item.Statues == 0 ? `[${item.NoticeCount}条]${item.MMDigest}` : item.MMDigest}
                                                    </span>
                                                </p>
                                            }
                                            secondaryTextLines={1}
                                            onClick={() => {
                                                this.activeChat(item.UserName);
                                            }}
                                        />
                                        <Divider inset={true} style={{backgroundColor: '#292c33'}} />
                                    </div>
                                )
                            })
                        }
                    </List>
                </MuiThemeProvider>
            )
        }
    }

    render () {
        const { isLogin } = this.state;
        return (
            <div className="wrap">
                {
                    isLogin ? null : (<h2 className="title">欢迎使用微信网页版</h2>)
                }

                { this._renderLogo() }
                { this._renderUserInfo() }
                { this._renderChatList() }
                { this._renderButton() }
            </div>
        );
    }
}

export default App;
