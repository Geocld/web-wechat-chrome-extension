document.addEventListener('DOMContentLoaded', function() {

    // popup通知content script才去拿数据
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.getChatList) {
            injectScript(chrome.extension.getURL('chrome/catchChatList.js'), 'body');
            window.addEventListener("message", function(e) {
                // console.log('收到了来自inject script的信息:')
                // console.log(e.data.data);
                // 将inject script拿到的数据发给popup展示
                chrome.runtime.sendMessage({chatList: e.data.data});
            }, false);
        }

        if (request.username) {
            injectScript(chrome.extension.getURL('chrome/activeChatItem.js'), 'body', { username: request.username });
        }
    });


    let NEWEST = new Date().getTime();
    const targetNode = document.body;
    var callback = function () {
        const now = new Date().getTime();
        if (now - NEWEST > 100) {
            NEWEST = now;
            try {
                chrome.runtime.sendMessage({update: true});
            } catch (e) {
                if (
                    e.message.match(/Invocation of form runtime\.connect/) &&
                    e.message.match(/doesn't match definition runtime\.connect/)
                ) {
                    console.error('Chrome extension, Actson has been reloaded. Please refresh the page');
                } else {
                    throw(e);
                }
            }
        }
    };

    const observer = new MutationObserver(callback);

    observer.observe(targetNode, { attributes: true, childList: true, subtree: true, characterData: true });
});

function injectScript(file_path, tag, params) {
    var node = document.getElementsByTagName(tag)[0];
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', file_path);
    script.onload = function() {
        if (document.getElementById('paramsContainer')) {
            // 先移除参数div
            this.parentNode.removeChild(document.getElementById('paramsContainer'));
        }
        // 执行完后移除掉
        this.parentNode.removeChild(this);
    };
    if (params) {
        var paramsContainer = document.createElement('div');
        paramsContainer.style.display = 'none';
        paramsContainer.setAttribute('id', 'paramsContainer');
        for(var key in params) {
            paramsContainer.setAttribute(key, params[key]);
        }
        node.appendChild(paramsContainer);
    }
    node.appendChild(script);
}

