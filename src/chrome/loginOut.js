var nicknameDom = document.getElementsByClassName('nickname')[0];
var opt = nicknameDom.getElementsByClassName('opt')[0];
opt.click();
var mmpop_system_menu = document.getElementById('mmpop_system_menu');
var menuicon_quit = mmpop_system_menu.getElementsByClassName('menuicon_quit')[0];
var menuicon_quit_parent = menuicon_quit.parentNode;
angular.element(menuicon_quit_parent).scope().loginout();