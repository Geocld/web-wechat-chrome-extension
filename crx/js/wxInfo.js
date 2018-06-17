/**
 * Created by lijiahao on 2018/6/15.
 */
function getWxInfo () {
    const avatar = document.getElementsByClassName("avatar")[0].getElementsByTagName("img")[0];
    const nickname = document.getElementsByClassName("nickname")[0].getElementsByClassName("display_name")[0].innerText;
    const chatItems = document.getElementsByClassName("main")[0].getElementsByClassName("chat_item");
    const loginDom = document.getElementsByClassName("login");
    let login = false;
    if (!loginDom.length) {
        login = true;
    } else if (loginDom.length && loginDom[0].offsetParent === null) {
        login = true;
    }
    let unreadCount = 0;
    for (let i = 0; i < chatItems.length; i++) {
        if (chatItems[i].getElementsByTagName("i") && chatItems[i].getElementsByTagName("i")[0]) {
            unreadCount += +chatItems[i].getElementsByTagName("i")[0].innerText;
        }
    }
    return {
        avatar: avatar.src,
        nickname: nickname,
        unreadCount: unreadCount,
        login: login
    }
}

getWxInfo();