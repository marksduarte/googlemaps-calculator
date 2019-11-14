var report = {};
window.onload = function () {
    $("#valorPorLitro").mask("#.##0,00", {reverse: true});
    $("#kmPorLitro").mask("##0,0", {reverse: true});
    $("#valorReembolso").mask("#.##0,00", {reverse: true});
    $("#numOS").mask("0000-00000");

    $("#valorPorLitro").val("4,10");
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

            let kmTotalAno = 12000;
            let kmTotal = textToFloat(request.obj.kmTotal);
            let kmPorLitro = textToFloat($("#kmPorLitro").val());
            let valorPorLitro = textToFloat($("#valorPorLitro").val());
            let litros = kmTotal / kmPorLitro;
            let combustivel = valorPorLitro / kmPorLitro;
            let fipe = 28935; //Grand Siena ATTRAC. 1.4 EVO F.Flex 8V | 2012
            let seguro = 0; //Biroliro derrubou
            let licenciamento = 100;
            let ipva = fipe * 0.03;
            let ipvaSeguroLicenciamento = ((ipva + seguro + licenciamento) / kmTotalAno);
            let depreciacao = (0.15 * fipe) / kmTotalAno;
            let custoRevisao = ((kmTotalAno / 10000) * 500) / kmTotalAno;
            let custoKm = combustivel + ipvaSeguroLicenciamento + depreciacao + custoRevisao;

            let valorReembolso = floatToText(litros * (valorPorLitro + custoKm));
                //floatToText(valorPorLitro === 0 ? litros * 4.1 : litros * valorPorLitro);

            $("#kmTotal").val(kmTotal);
            $("#litros").val(floatToText(litros) + " L");
            $("#valorReembolso").val(valorReembolso);
            console.log(request.obj.trajetos);
            report.trajetos = request.obj.trajetos.slice();
        }
    }
    return true;
});

function calcular() {
    // Execute content script in active tab.
    chrome.windows.getCurrent(function (currentWindow) {
        chrome.tabs.query({active: true, windowId: currentWindow.id}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {message: "clicked_btnCalculate_action"});
        });
    });
}

function Imprimir() {
    // Send a message to background.js to create new tab
    report.numOS = $("#numOS").val();
    report.colaborador = $("#colaborador").val();
    report.valorPorLitro = $("#valorPorLitro").val();
    report.kmPorLitro = $("#kmPorLitro").val();
    report.kmTotal = $("#kmTotal").val();
    report.litros = $("#litros").val();
    report.valorReembolso = $("#valorReembolso").val();
    chrome.runtime.sendMessage({message: "create_new_tab", report: report});
}

function isEmpty(inputText) {
    if (inputText.val() === "" || inputText.val() === 0) {
        if (inputText.name.startsWith("km")) inputText.val("10,00");
        if (inputText.name.startsWith("val")) inputText.val("4,10");
    }
}

function textToFloat(txt) {
    txt = String(txt);
    return parseFloat(txt.replace(".","").replace(",",".").trim());
}

function floatToText(val) {
    return val.toFixed(2).replace(",","").replace(".",",");
}
