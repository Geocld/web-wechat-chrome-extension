// angular.element(document.getElementsByClassName('chat_item')[0]).scope().itemClick(params);
// angular.element(document.getElementsByClassName('chat_item')[0]).scope().$apply();
var chatItem = document.getElementsByClassName('chat_item')[0];
var pd = document.getElementById('paramsContainer');
var username = pd.getAttribute('username');
angular.element(chatItem).scope().itemClick(username)
angular.element(chatItem).scope().$apply();
