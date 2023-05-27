// ==UserScript==
// @name         Fuhrpark-neu2
// @version      3.0.0a
// @author       freakZ112
// @description  Zeigt den kompletten Fuhrpark, sowie diverse Statistiken
// @include      /^https?:\/\/(?:w{3}\.)?(?:polizei\.)?leitstellenspiel\.de\/$/
// @grant        GM_addStyle
// ==/UserScript==
/* global $ user_id checkUserId user_name getVehiclesApi getApi */

const fum_datestring = new Date().getTime(),
      aVehicles = await $.getJSON('/api/vehicles'),
      aBuildings = await $.getJSON('/api/buildings'),
      aCredits = await $.getJSON('/api/credits'),
      fum_url = "https://raw.githubusercontent.com/freakZ112"; /* live */

var   aVehicleTypesNew = aVehicleTypesNew || [];


(async function () {

    await $.getScript(`${ fum_url }/stats/main/var_func.js?${ fum_datestring }`);

    const securityCheck = await checkUserId(user_id);

    if (securityCheck.locked === true) {
        alert(`Hallo ${ securityCheck.name },\nDu darfst mein Script nicht nutzen!`);
        window.location.reload;
        return false;
    }

    // temporÃ¤re Nachricht an Nutzer
    if (!sessionStorage.msg_traxx) {
        $("body")
            .prepend(`<div class="modal modal_fum" tabindex="-1" role="dialog" style="display:block !important">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title">Wichtige Mitteilung zum Fuhrpark-Manager</h5>
                                    <button type="button" class="close" onclick="$('.modal_fum').remove()" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    <p>Lieber ${ user_name }</p>
                                    <br>
                                    <p>Es ist zwar noch nicht der 1.3., aber leider habe ich schon jetzt schlechte Nachrichten.</p>
                                    <p>Der Support hat sich mittlerweile zu meinem Anliegen geÃ¤ÃŸert. Dies habe ich auch Deinem und eurem Engagement zu verdanken. An dieser Stelle ein dickes DankeschÃ¶n an Dich und alle anderen!</p>
                                    <p>Das Ergebnis fiel leider sehr bescheiden aus. Die Sperre bleibt bestehen, man wolle aber auch nicht auf die HintergrÃ¼nde eingehen. Man wolle immerhin die "IntegritÃ¤t der Untersuchungsmethoden" wahren. Zudem batem sie, von RÃ¼ckfragen abzusehen.</p>
                                    <p>Ich mÃ¶chte mich bei Dir fÃ¼r die Zeit im LSS, so wie das entgegengebrachte Vertrauen gegenÃ¼ber meiner (ab und an auch mal missglÃ¼ckten) Scripts bedanken. Es war eine schÃ¶ne Zeit und hat auch die meiste Zeit wirklich viel SpaÃŸ gemacht.</p>
                                    <p>Ich bitte um Dein VerstÃ¤ndnis, dass meine Scripts mit sofortiger Wirkung abgeschaltet und ersatzlos gestrichen sind.</p>
                                    <p>Vielleicht sieht, hÃ¶rt und/ oder schreibt man sich ja irgendwann in einem anderen Spiel.</p>
                                    <br>
                                    <p>Liebe GrÃ¼ÃŸe</p>
                                    <p>DrTraxx</p>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-danger" onclick="$('.modal_fum').remove()">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>`);
        sessionStorage.msg_traxx = "message shown";
    }

    return;

    if (aVehicleTypesNew.length === 0) {
        if (!localStorage.aVehicleTypesNew || JSON.parse(localStorage.aVehicleTypesNew).lastUpdate < (new Date().getTime() - 5 * 1000 * 60)) {
            await $.getJSON("https://api.lss-cockpit.de/de_DE/vehicletypes.json").done(data => localStorage.setItem('aVehicleTypesNew', JSON.stringify({ lastUpdate: new Date().getTime(), value: data })));
        }
        aVehicleTypesNew = JSON.parse(localStorage.aVehicleTypesNew).value;
    }

    if (aVehicles.length === 0) {
        getVehiclesApi();
    }

    if (aBuildings.length === 0) {
        aBuildings = await getApi("buildings");
    }

    if (aCredits.length === 0) {
        aCredits = await getApi("credits");
    }

    $('head').append(`<link rel="stylesheet" href="${ fum_url }/fuhrparkmanager/main.css?${ new Date().getTime() }" type="text/css" />`);

    await $.getScript(`$https://raw.githubusercontent.com/freakZ112/stats/main/modal.js?${ fum_datestring }`);
    await $.getScript(`$https://raw.githubusercontent.com/freakZ112/stats/main/ini_fun.js?${ fum_datestring }`);
    await $.getScript(`$https://raw.githubusercontent.com/freakZ112/stats/main/oc.js?${ fum_datestring }`);
})();