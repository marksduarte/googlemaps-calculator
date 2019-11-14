chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    switch (request.message){
        case "load_new_tab":
            var report = request.data;
            console.log(report);
            //You have the object as request.data with tabUrl and tabHtml
            $('#numOS').val(report.numOS);
            $('#colaborador').val(report.colaborador);
            $('#valorPorLitro').val(report.valorPorLitro);
            $('#kmPorLitro').val(report.kmPorLitro);
            $('#kmTotal').val(report.kmTotal);
            $('#litros').val(report.litros);
            $('#valorReembolso').val(report.valorReembolso);
            for (let i = 0; i < report.directions.length; i++) {
                $('#trajetos').append('<div class="p-2"><span class="badge badge-primary badge-pill mr-2">'+ (i+1) +'</span>'+report.directions[i]+'</div>');
            }
            break;
    }
});