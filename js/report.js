chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    switch (request.message){
        case "load_new_window":
            console.log("report.js called!")
            var report = request.data;
            $('#numOS').val(report.numOS);
            $('#colaborador').val(report.colaborador);
            $('#valorPorLitro').val(report.valorPorLitro);
            $('#kmPorLitro').val(report.kmPorLitro);
            $('#kmTotal').val(report.kmTotal);
            $('#litros').val(report.litros);
            $('#valorReembolso').val(report.valorReembolso);
            $('#observacoes').val(report.observacoes);
            for (let i = 0; i < report.trajetos.length; i++) {
                $('#trajetos').append('<li class="list-group-item"><span class="badge badge-primary badge-pill mr-2">'+ (i+1) +'</span>'+report.trajetos[i]+'</li>');
            }
            window.print();
            window.close();
            break;
    }
});