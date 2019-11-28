$(function(){
    $('.numOS').mask('0000-00000');
    $('.date').mask('00/00/0000').datepicker({
        orientation: 'bottom',
        language: 'pt-BR',
        autoclose: true,       
        todayHighlight: true      
    });       
    $('#dtRelatorio').val(new Date().toLocaleDateString('pt-BR'));
    $('#btnPrint').on('click', function(e) {
        window.print();
    });
});

/**
 * Called after popup window is created
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    switch (request.message){
        case "load_new_window":
            var report = request.report;    
            $('#vlLitroReembolso').text(report.vlLitroReembolso.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}));        
            $('#distancia').text(report.distancia + ' Km');        
            $('#combustivel').text(report.combustivel + ' Lts');        
            $('#reembolso').text(report.vlReembolso.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}));        
            for (let i = 0; i < report.trajetos.length; i++) {
                $('#trajetos').append('<li class="pl-3"><span class="badge badge-primary badge-pill mr-2">'+ (i+1) +'</span>'+report.trajetos[i]+'</li>');
            }            
            //window.print();
            //window.close();
            break;
    }
});

