$(function(){
    $('.numOS').mask('0000-00000');
    $('.date').mask('00/00/0000').datepicker({
        orientation: 'bottom',
        language: 'pt-BR',
        autoclose: true
    });
});

/**
 * Called after popup window is created
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    switch (request.message){
        case "load_new_window":
            var report = request.report;
            $('#numOS').text(report.numOS);
            $('#colaborador').text(report.colaborador);
            $('#valorPorLitro').text(report.valorPorLitro);
            $('#kmPorLitro').text(report.kmPorLitro);
            $('#kmTotal').text(report.kmTotal);
            $('#litros').text(report.litros);
            $('#valorReembolso').text(report.valorReembolso);
            $('#observacoes').text(report.observacoes);
            for (let i = 0; i < report.trajetos.length; i++) {
                $('#trajetos').append('<li class="pl-3"><span class="badge badge-primary badge-pill mr-2">'+ (i+1) +'</span>'+report.trajetos[i]+'</li>');
            }
            //window.print();
            //window.close();
            break;
    }
});

