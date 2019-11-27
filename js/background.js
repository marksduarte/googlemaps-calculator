chrome.browserAction.onClicked.addListener(function(tab) {    
    chrome.tabs.update({
            "url": "https://www.google.com.br/maps/dir/Setor+Comercial+Norte+Q+2+Liberty+Mall+Shoping+-+Asa+Norte,+Bras%C3%ADlia+-+DF//@-15.7867346,-47.9196024,13z/data=!4m9!4m8!1m5!1m1!1s0x935a3afdad78c1d5:0x6d428966d18e37a9!2m2!1d-47.884583!2d-15.78682!1m0!3e0?hl=pt-BR",
            "active": true
    });    
});

/**
 * Listener to manipulate windows and tabs
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request.message === "create_new_window") {
        createNewWindow(request.report);
    } 
    return true;
});

/**
 * Create the new popup window with tab to load and print the report.html.
 * @param report
 */
function createNewWindow(report) {
    var targetId = null;
    chrome.tabs.onUpdated.addListener(function listener(tabId, changedProps) {
        if(tabId !== targetId || changedProps.status !== "complete") return;
        chrome.runtime.sendMessage({message: "load_new_window", data: report});
    });
    var newWindowUrl = chrome.extension.getURL('html/report.html');
    chrome.windows.create({url: newWindowUrl, type: "popup"}, function(window) {
        targetId = window.tabs[0].id;
    });
}