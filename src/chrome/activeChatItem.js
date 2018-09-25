var tabItem = document.getElementsByClassName('tab_item')[0];
var chat = tabItem.getElementsByClassName('chat')[0];
var chatItem = document.getElementsByClassName('chat_item')[0];
var pd = document.getElementById('paramsContainer');
var username = pd.getAttribute('username');

chat.click();
angular.element(chatItem).scope().itemClick(username);
angular.element(chatItem).scope().$apply();
