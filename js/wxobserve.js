/**
 * Created by lijiahao on 2018/6/16.
 */

document.addEventListener('DOMContentLoaded', function() {
    var NEWEST = new Date().getTime();
    var targetNode = document.body;
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

    var observer = new MutationObserver(callback);

    observer.observe(targetNode, { attributes: true, childList: true, subtree: true, characterData: true });
});