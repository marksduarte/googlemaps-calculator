chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){  
    var response;  
    if(request.message === "create_new_tab") {        
        createNewTab(request.report);
    }      
    if(request.message === "update_tab_maps") {                
        if(!request.activetab.url.startsWith("https://www.google.com.br/maps")) {
            chrome.tabs.update(
                {"url": "https://www.google.com.br/maps/dir/Setor+Comercial+Norte+Q+2+Liberty+Mall+Shoping+-+Asa+Norte,+Bras%C3%ADlia+-+DF//@-15.7867346,-47.9196024,13z/data=!4m9!4m8!1m5!1m1!1s0x935a3afdad78c1d5:0x6d428966d18e37a9!2m2!1d-47.884583!2d-15.78682!1m0!3e0?hl=pt-BR"
            , "active": true});
        }     
    }        
    return true;
});

function createNewTab(obj) {
    var targetId = null;
    chrome.tabs.onUpdated.addListener(function listener(tabId, changedProps) {
        if(tabId != targetId || changedProps.status != "complete") return;
        chrome.runtime.sendMessage({message: "load_new_tab", data: obj});
    });
    var newTabUrl = chrome.extension.getURL('html/report.html');
    chrome.tabs.create({url: newTabUrl, active: false}, function(tab) {
        targetId = tab.id;
    });
}