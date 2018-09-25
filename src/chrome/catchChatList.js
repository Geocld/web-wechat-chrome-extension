var wxList = window.angular.element(document.getElementsByClassName('chat_list')[0]).scope().chatList;
var data = {
    chatList: wxList
}
// send message to content script
window.postMessage({"data": JSON.parse(JSON.stringify(data))}, '*');