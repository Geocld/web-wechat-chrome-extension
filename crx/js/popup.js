function viewWx () {
    var windowId = null;
    chrome.browserAction.setBadgeText({text: ''});
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
            chrome.windows.update(windowId, { focused: true });
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

document.addEventListener('DOMContentLoaded', function () {
    const USER_INFO = document.getElementById("user_info");
    const LOGIN_BTN = document.getElementById("login_btn");
    const ACCESS_BTN = document.getElementById("access_btn");
    const VIEW_BTN = document.getElementById("view_btn");
    const UNREAD = document.getElementById("unread");
    const LOGO = document.getElementById("wx-logo");
    let hasOpenWx =  false;

    chrome.windows.getAll({
        populate: true
    }, function (wins) {
        wins.forEach(function (win) {
            win.tabs.forEach(function (tab) {
                if (/wx\.qq\.com/ig.test(tab.url)) {
                    hasOpenWx = true;
                    chrome.tabs.executeScript(tab.id, {
                       file: 'js/wxInfo.js'
                    }, function (res) {
                        var info = res[0];
                        if (!!info.avatar && !!info.nickname) { // 已登录，显示头像及昵称
                            document.getElementsByClassName("unread")[0].style.display = 'block';
                            USER_INFO.innerHTML = `<span><img class="avatar" src="${info.avatar}" alt="avatar"></span><span class="nickname">${info.nickname}</span>`
                            if (info.unreadCount) {
                                if (info.unreadCount < 999) {
                                    UNREAD.innerText = `未读消息(${info.unreadCount})`;
                                } else if (info.unreadCount >= 999) {
                                    UNREAD.innerText = `未读消息(999}+)`;
                                }
                                VIEW_BTN.style.display = 'inline-block';
                            }
                            ACCESS_BTN.style.display = 'inline-block';
                            LOGIN_BTN.style.display = 'none';
                            LOGO.style.display = 'none';
                        } else {
                            ACCESS_BTN.style.display = 'none';
                            LOGIN_BTN.style.display = 'inline-block';
                        }
                    });
                }
            });
            if (!hasOpenWx) {
                ACCESS_BTN.style.display = 'none';
                LOGIN_BTN.style.display = 'inline-block';
            }
        });
    });


    LOGIN_BTN.addEventListener("click", viewWx);
    ACCESS_BTN.addEventListener("click", viewWx);
    VIEW_BTN.addEventListener("click", viewWx);
});