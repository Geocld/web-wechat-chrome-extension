import React, {Component} from 'react';
import './App.css';

class App extends Component {

    state = {
        hasOpenWx: false,
        isLogin: false,
        userInfo: null,
        chatList: [] // 聊天列表
    }

    componentWillMount() {

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
                <div className="user-info">
                    <span><img className="avatar" src={ userInfo.avatar } alt="avatar"/></span>
                    <span className="nickname">{ userInfo.nickname }</span>
                </div>
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
            <div className="btn-wrap">
                <span className="btn" onClick={this.viewWx}>{ isLogin ? '进入完整版' : '登陆' }</span>
            </div>
        )
    }

    render () {
        return (
            <div className="wrap">
                <h2 className="title">欢迎使用微信网页版</h2>
                { this._renderLogo() }
                { this._renderUserInfo() }
                { this._renderUnRead() }
                { this._renderButton() }
            </div>
        );
    }
}

export default App;
