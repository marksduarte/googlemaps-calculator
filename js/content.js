chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request.message === "clicked_btnCalculate_action") {
        var obj ={
            kmTotal: "",
            trajetos: []
        };
        let elementsByClassName = document.getElementsByClassName('section-directions-trip-distance section-directions-trip-secondary-text');
        let txt = elementsByClassName[0].innerText;
        if(txt !== "" && txt.endsWith("km")) {
            obj.kmTotal = txt.trim();
        }
        
        let searchboxContainer = document.getElementsByClassName('widget-directions-searchboxes')[0];
        if(searchboxContainer != null) {
            for(let i = 0; i < searchboxContainer.getElementsByTagName('input').length; i++) {
                obj.trajetos.push(searchboxContainer.getElementsByTagName('input')[i].value.split(',')[0]);
            }
        }
        chrome.runtime.sendMessage({message: "maps_routes", obj});
    }     
});