var report = {};
const valorMedioGasolina = 4.44; //em 22/11/2019 - DF

window.onload = function () {
    $("#valorPorLitro").mask("#.##0,00", {reverse: true});
    $("#kmPorLitro").mask("##0,0", {reverse: true});
    $("#valorReembolso").mask("#.##0,00", {reverse: true});
    $("#numOS").mask("0000-00000");

    $("#valorPorLitro").val(this.floatToText(valorMedioGasolina));
    $("#kmPorLitro").val("10");

    $("#btnCalcular").on("click", calcular);
    $("#btnImprimir").on("click", Imprimir);        

    chrome.windows.getCurrent(function (currentWindow) {
        chrome.tabs.query({active: true, windowId: currentWindow.id}, function (
            tabs
        ) {
            var activetab = tabs[0];
            if (!activetab.url.startsWith("https://www.google.com.br/maps")) {
                chrome.tabs.update({
                    url: "https://www.google.com.br/maps/dir/Setor+Comercial+Norte+Q+2+Liberty+Mall+Shoping+-+Asa+Norte,+Bras%C3%ADlia+-+DF//@-15.7867346,-47.9196024,13z/data=!4m9!4m8!1m5!1m1!1s0x935a3afdad78c1d5:0x6d428966d18e37a9!2m2!1d-47.884583!2d-15.78682!1m0!3e0?hl=pt-BR",
                    active: true
                });
            }
        });
    });
};

// Get the request and populate inputs in the extension html.
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message === "maps_routes") {
        if (request.obj.kmTotal !== "") {
            isEmpty($("#kmPorLitro"));
            isEmpty($("#valorPorLitro"));

            var kmTotalAno = 12000;
            var kmTotal = textToFloat(request.obj.kmTotal);
            var kmPorLitro = textToFloat($("#kmPorLitro").val());
            var valorPorLitro = textToFloat($("#valorPorLitro").val());
            var litros = kmTotal / kmPorLitro;
            var combustivel = valorPorLitro / kmPorLitro;
            var fipe = 28935; //Grand Siena ATTRAC. 1.4 EVO F.Flex 8V
            var seguro = 0; //Biroliro derrubou
            var licenciamento = 100;
            var ipva = fipe * 0.03;
            var ipvaSeguroLicenciamento = ((ipva + seguro + licenciamento) / kmTotalAno);
            var depreciacao = (0.15 * fipe) / kmTotalAno;
            var custoRevisao = ((kmTotalAno / 10000) * 500) / kmTotalAno; // R$ 500 valor médio da revisão
            var custoKm = combustivel + ipvaSeguroLicenciamento + depreciacao + custoRevisao;   

            calculaBaseReembolso(litros, valorPorLitro, custoKm, kmTotal);        
            
            $("#kmTotal").val(kmTotal);
            $("#litros").val(litros);
            
            report.trajetos = request.obj.trajetos.slice();
        }
    }
    return true;
});

function calculaBaseReembolso(litros, valorPorLitro, custoKm, kmTotal) {  
    let baseCalculo = $("input[name=radioBaseCalculo]:checked").val();
    let txtfatorCalculo;
    let valorReembolso;              
    if(baseCalculo !== '') {
        if(baseCalculo === 'litro') {                        
            valorReembolso = floatToText(litros * (valorPorLitro + custoKm));
            txtfatorCalculo = "R$ " + floatToText(valorPorLitro + custoKm);
        }
        if(baseCalculo === 'km') {
            valorReembolso = floatToText(kmTotal * custoKm);
            txtfatorCalculo = "R$ " + floatToText(custoKm);
        }
        $("#fatorCalculo").text(txtfatorCalculo);
        $("#valorReembolso").val(valorReembolso);
    }                   
};    

function calcular() {
    alert("Click!");
    // Execute content script in active tab.
    chrome.windows.getCurrent(function (currentWindow) {
        chrome.tabs.query({active: true, windowId: currentWindow.id}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {message: "clicked_btnCalculate_action"});
        });
    });
}

function Imprimir() {
    report.cliente = $("#cliente").val();
    report.numOS = $("#numOS").val();
    report.colaborador = $("#colaborador").val();
    report.valorPorLitro = 'R$ ' + $("#valorPorLitro").val();
    report.kmPorLitro = $("#kmPorLitro").val() + ' Km/L';
    report.kmTotal = $("#kmTotal").val() + ' Km';
    report.litros = $("#litros").val() + ' L';
    report.valorReembolso = 'R$ ' + $("#valorReembolso").val();
    report.observacoes = $("#observacoes").val();
    chrome.runtime.sendMessage({message: "create_new_window", report: report});
}

function isEmpty(inputText) {
    if (inputText.val() === "" || inputText.val() === 0) {
        if (inputText.name.startsWith("km")) inputText.val("10,00");
        if (inputText.name.startsWith("val")) inputText.val(textToFloat(valorMedioGasolina));
    }
}

function textToFloat(txt) {
    txt = String(txt);
    return parseFloat(txt.replace(".","").replace(",",".").trim());
}

function floatToText(val) {
    return val.toFixed(2).replace(",","").replace(".",",");
}
