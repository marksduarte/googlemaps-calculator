/**
 *  Content Script
 * @author Marks Duarte <marksduarte@gmail.com>
 * 
 */

$(function(){
    $('#colaborador').val('Marks 1');
    if(document.title.indexOf("Google") !== -1) {       
        var request = new XMLHttpRequest();
        request.open('GET', chrome.extension.getURL('html/popup.html'), true);
        request.send(null);
        request.onload  = function () {
            if(request.readyState === 4 && request.status === 200) {
                var type = request.getResponseHeader('Content-Type');
                if(type.indexOf("text") !== 1) {
                    let divExt = document.createElement('div');                             
                    document.body.appendChild(divExt);    
                    document.getElementById('app-container').style.marginTop = '65px';

                    shadowRoot = divExt.attachShadow({mode: 'open'});
                    shadowRoot.innerHTML = request.responseText;                    

                    shadowRoot.querySelector('#btnClose').addEventListener('click', onBtnCloseClick);
                    shadowRoot.querySelector('#btnCalculate').addEventListener('click', onBtnCalculateClick);
                    shadowRoot.querySelector('#btnReport').addEventListener('click', onBtnReportClick);
                    
                    include(chrome.extension.getURL("css/popup.css"));
                    include(chrome.extension.getURL("css/bootstrap.min.css"));
                    include(chrome.extension.getURL("css/bootstrap-datepicker.standalone.min.css"));                                                           
                    include(chrome.extension.getURL("img/close.svg"));                                                           
                }
            }
        }                                    
    }
});

function include(path) {
    let el;
    if(path.endsWith('.css')) {
        el = document.createElement('link');
        el.rel = 'stylesheet';
        el.href = path;        
    }
    if(path.endsWith('.js')) {
        el = document.createElement('script');
        el.type = 'text/javascript';
        el.src = path;        
    }       
    if(path.endsWith('.svg')) {
        el = document.createElement('img');       
        el.src = path;
        el.alt = "Fechar";
        shadowRoot.getElementById('btnClose').appendChild(el);
        return;
    }       
    shadowRoot.appendChild(el);
}

function turnOffEvents() {
    // Usar $.off() para desativar o evento dos inputs de destino.
}

function onBtnCalculateClick() {      
    report = {};  
    report.distancia = getKmtotal();
    report.trajetos = getTrajetos().slice();    
    report.kmMediaAno = 12000;    
    report.kmLitro = 10;
    report.vlLitro = 4.29;
    report.combustivel = report.distancia / report.kmLitro;
    report.consumo = report.vlLitro / report.kmLitro;
    report.vlFipe = 28935; //Grand Siena ATTRAC. 1.4 EVO F.Flex 8V
    report.vlSeguro = 120;
    report.vlLicenciamento = 100;
    report.vlIpva = report.vlFipe * 0.03;
    report.vlIpvaSeguroLicenciamento = ((report.vlIpva + report.vlSeguro + report.vlLicenciamento) / report.kmMediaAno);
    report.depreciacao = (0.15 * report.vlFipe) / report.kmMediaAno;
    report.vlRevisao = ((report.kmMediaAno / 10000) * 500) / report.kmMediaAno; // R$ 500 valor médio da revisão
    report.vlLitroReembolso = report.vlLitro + (report.consumo + report.vlIpvaSeguroLicenciamento + report.depreciacao + report.vlRevisao); 
    report.vlReembolso = (report.combustivel * report.vlLitroReembolso).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
        
    shadowRoot.querySelector('#distancia').value = report.distancia + ' km';    
    shadowRoot.querySelector('#combustivel').value = report.combustivel + ' lts';
    shadowRoot.querySelector('#reembolso').value = report.vlReembolso;      
}

function onBtnReportClick() {   
    chrome.runtime.sendMessage({
        message: "create_new_window", 
        report: report
    });
}

function onBtnCloseClick() {
    var app = shadowRoot.getElementById('calculadora-google-maps');    
    app.setAttribute('style', 'display: none');
    document.getElementById('app-container').style.marginTop = '0';
}

function getKmtotal(){
    let elementsByClassName = document.getElementsByClassName('section-directions-trip-distance section-directions-trip-secondary-text');
    let txt = elementsByClassName[0].innerText;
    if(txt !== "" && txt.endsWith("km")) {
        return textToFloat(txt);
    }
}

function getTrajetos(){
    let searchboxContainer = document.getElementsByClassName('widget-directions-searchboxes')[0];
    if(searchboxContainer != null) {
        var arr = [];
        for(let i = 0; i < searchboxContainer.getElementsByTagName('input').length; i++) {            
            arr.push(searchboxContainer.getElementsByTagName('input')[i].value.split(',')[0]);
        }
        return arr;
    }   
}

function textToFloat(txt) {
    txt = String(txt);
    return parseFloat(txt.replace(".","").replace(",",".").trim());
}