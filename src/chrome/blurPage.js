var chatItem = document.getElementsByClassName('chat_item')[0];
try {
    angular.element(chatItem).scope().itemClick('none');
} catch (e) {
    // console.log(e)
}