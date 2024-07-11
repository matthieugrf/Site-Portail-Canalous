const pool = require('../config/dbConfig');

async function affiche_trajet(mytrajet_id, default_display, switch_display = true, type_display = 'web', google_map_pk = false, tabPkouchnok = false) {
    let TAB_trajet_ok = {}; // This should be populated with the necessary data
    let HTML_info_trajet = {};
    let HTML_trajet = '';
    let HTML_pdf = '';
    let HTML_guides = '';
    let JS_delete_embrachement = '';
    let guide_code_vieux = [''];

    let array_tirant_eau = [];
    let array_tirant_air = [];
    let array_longueur = [];
    let array_largeur = [];

    // Configure Google maps in the session
    sessionStorage.setItem(`trajet_${mytrajet_id}_port_google`, '');
    sessionStorage.setItem(`trajet_${mytrajet_id}_centre_google`, '');
    sessionStorage.setItem(`trajet_${mytrajet_id}_pk_google`, '');
    sessionStorage.setItem(`trajet_${mytrajet_id}_guides`, '');
    sessionStorage.setItem(`trajet_${mytrajet_id}_pdf`, '');
    sessionStorage.setItem(`trajet_${mytrajet_id}_guide`, JSON.stringify([]));

    sessionStorage.setItem(`trajet_${mytrajet_id}_PORT_START`, document.getElementById('search_port_start').value);
    sessionStorage.setItem(`trajet_${mytrajet_id}_PORT_END`, document.getElementById('search_port_end').value);

    // Fetch arrival port
    if (document.getElementById('search_port_end').value !== '') {
        let sql_port = `SELECT Port_Nom, Port_Id FROM mappyfluvial_ports WHERE Port_Nom='${document.getElementById('search_port_end').value}'`;
        let tab_port = await pool.query(sql_port);
        var point_arrivee = tab_port.Port_Id;
        var port_nom_arrivee = tab_port.Port_Nom;
    }

    if (document.getElementById('search_port_start').value !== '') {
        let sql_port = `SELECT PortType_Img, Port_Nom, Port_Id, Port_MapY, Port_MapX FROM mappyfluvial_ports p, mappyfluvial_ports_type t WHERE p.Port_Nom='${document.getElementById('search_port_start').value}' AND p.Port_Type = t.PortType_Id`;
        let tab_port = await pool.query(sql_port);
        var point_depart = tab_port.Port_Id;
        var port_nom_depart = tab_port.Port_Nom;

        let sql_chantiers = `SELECT c.CLE, c.NOM FROM mappyfluvial_ports_chantiers r, chantier_adr c WHERE r.PortChantier_PortId='${point_depart}' AND c.CLE = r.PortChantier_ChantierId `;
        let req_chantiers = await pool.query(sql_chantiers);

        let list_ChantiersZZ = '';
        let list_Chantiers = '';
        req_chantiers.forEach((tab_chantiers) => {
            list_ChantiersZZ += `<a href='http://www.fluvialnet.com/index.html?idmenu=chantier&mode=3&chantier=${tab_chantiers.CLE}&gm=true' ><img src='/img/design/fluviacap/ico_chantier.gif' border='0'/> ${tab_chantiers.NOM}</a><br /> `;
            list_Chantiers += `<a href="http://www.fluvialnet.com/index.html?idmenu=chantier&mode=3&chantier=${tab_chantiers.CLE}" onclick="window.open(this.href,'','toolbar=0,location=0,directories=0,status=0,scrollbars=1,resizable=0,copyhistory=0,menuBar=0,width=630,height=600');return(false);" target="_blank" ><img src="/img/design/fluviacap/ico_chantier.gif" width="11" height="9" alt="${tab_chantiers.NOM.trim()}" title="<b>CHANTIER</b> : ${tab_chantiers.NOM.trim()} (voir la fiche)" border="0" class="tooltip" />${tab_chantiers.NOM}</a><br /> `;
        });

        let sql_loueurs = `SELECT l.CLE, l.SOCIETE FROM mappyfluvial_ports_loueurs r, loueur_adr l WHERE r.PortLoueur_PortId='${point_depart}' AND l.CLE = r.PortLoueur_LoueurId `;
        let req_loueurs = await pool.query(sql_loueurs);

        let list_Loueurs = '';
        req_loueurs.forEach((tab_loueurs) => {
            let sUrlLoueur = `http://www.fluvialnet.com/index.html?idmenu=loueur&mode=3&loueur=${tab_loueurs.CLE}`;
            let sOptPopup = `'toolbar=0,location=0,directories=0,status=0,scrollbars=1,resizable=0,copyhistory=0,menuBar=0,width=630,height=600'`;
            list_Loueurs += `<a href="${sUrlLoueur}" onclick="window.open(this.href,'',${sOptPopup});return(false);" title="LOUEUR : ${tab_loueurs.SOCIETE.trim()} (voir la fiche)" ><img src="/img/design/fluviacap/ico_loueur.gif" width="11" height="9" alt="${tab_loueurs.SOCIETE.trim()}"  class="tooltip" border="0" />&nbsp;${tab_loueurs.SOCIETE}</a> `;
        });

        let sPoint = `new google.maps.LatLng(${tab_port.Port_MapX},${tab_port.Port_MapY})`;
        let sToolTip = `${tab_port.Port_Nom}<br /><br />${list_Chantiers.replace(/"/g, '\\"')}${list_Loueurs.replace(/"/g, '\\"')}`;
        let sImgPort = `/img/design/fluviacap/googlemaps/v3/${tab_port.PortType_Img}`;
        let sTitle = tab_port.Port_Nom;
        sessionStorage.setItem(`trajet_${mytrajet_id}_port_google`, `
            createMarker(${sPoint}, "${sTitle}","${sToolTip}", "${sImgPort}", map${mytrajet_id});
        `);
    }

    if (tabPkouchnok) {
        let sPoint = `new google.maps.LatLng(${tabPkouchnok.lat},${tabPkouchnok.lng})`;
        let sTitle = tabPkouchnok.titre.trim();
        let sContent = '';
        if (sTitle) {
            sContent += `<h2>${sTitle}</h2>`;
        }
        sContent += tabPkouchnok.description.trim().replace('\n', '<br />').replace('\r\n', '');
        if (tabPkouchnok.svp_lng || true) {
            if (sContent) {
                sContent += '<br /><br />';
            }
            sContent += `<a href="#" id="pkouchnok_streeview">[ Street View ]</a>`;
        }
        sContent = sContent.replace(/\r\n/g, '');
        sessionStorage.setItem(`trajet_${mytrajet_id}_pkouchnok_points`, `
            var tabPkSVPInfos = ["${tabPkouchnok.svp_lat}","${tabPkouchnok.svp_lng}","${tabPkouchnok.svp_zoom}","${tabPkouchnok.svp_pitch}","${tabPkouchnok.svp_heading}",];
            affichePkouchnok(${tabPkouchnok.id},${sPoint},${tabPkouchnok.zoom},"${tabPkouchnok.maptypeid}",tabPkSVPInfos, "${sTitle}","${sContent}",map${mytrajet_id});
        `);
        sessionStorage.setItem(`trajet_${mytrajet_id}_centre_google`, `map${mytrajet_id}.setCenter(${sPoint}), ${niveau_zoom});`);
    } else {
        sessionStorage.removeItem(`trajet_${mytrajet_id}_pkouchnok_points`);
    }

    let rel_dossier = '';
    switch (type_display) {
        case 'pdf':
        case 'print':
            rel_dossier = '../../';
            break;
    }

    let nb_etapes = TAB_trajet_ok[mytrajet_id].etapes.length;
    let temps = formaTime(TAB_trajet_ok[mytrajet_id].Temps);
    let temps_Calculated = formatTime(TAB_trajet_ok[mytrajet_id].Temps_Calculated);

    let trajet_style = default_display === '1' ? 'display:block;visibility:visible;' : 'display:block;visibility:hidden;opacity:0;';

    let voir_google, voir_map, voir_legend, aff_google;
    if (type_display === 'web') {
        let the_lang = navigator.language.toLowerCase().slice(1, 2);
        if (the_lang !== 'de' && the_lang !== 'en') the_lang = 'fr';

        voir_google = '<div style="display:none;"><div id="google_map"><h3>google map</h3></div></div>';
        let sUrl = `/php/googlemap/googlemap.php?id=${mytrajet_id}`;
        if (tabPkouchnok) sUrl += `&pkouchnok=${tabPkouchnok.id}`;
        voir_map = `<a href="${sUrl}" class="mGoogle" id="btn_google_map">${FLUVIACAP_VOIR_GRANDE_CARTE}</a>`;
        voir_legend = `
            <script type="text/javascript">
                $(function() {
                    $("span.mlegende").tooltip({
                        content: function(){
                            return '<img src="/img/design/fluviacap/${the_lang}/legende_big.jpg" />';
                        },
                        position: {
                            my: "right center",
                            at: "left-20 center"
                        }
                    });
                });
            </script>
            <span title="${rel_dossier}/img/design/fluviacap/legende_big.png" class="mlegende">${CNT_FLUVIACAP_LEGENDE}</span>`;
        aff_google = `
            <div id="google_map">
                <div id="map_canvas_${mytrajet_id}" class="googlemapV2"></div>
            </div>`;
    } else {
        voir_map = '';
        voir_legend = '';
        voir_google = '';
        aff_google = '';
    }

    HTML_trajet = `
        <div class="trajet" id="trajet_${mytrajet_id}" style="${trajet_style}">
            ${voir_legend}
            <div id="trajet_top">
                <div class="trajet_top_title_div">
                    <h2 class="trajet_top_title">
                        ${temps_Calculated} - ${TAB_trajet_ok[mytrajet_id].Km_Calculated} Km - ${TAB_trajet_ok[mytrajet_id].Ecluses} ${DIVERS_ECLUSES}
                    </h2>
                    ${voir_map}
                </div>
                ${voir_google}
            </div>
            ${aff_google}
            <div class="trajet_info">
                <div id="trajet_resume">${TAB_trajet_ok[mytrajet_id].Tunnel} ${CNT_FLUVIACAP_KM_TUNNEL} - ${nb_etapes} ${CNT_FLUVIACAP_ETAPES}</div>
    `;

    HTML_info_trajet[mytrajet_id] = `<br />${temps_Calculated} - ${TAB_trajet_ok[mytrajet_id].Km_Calculated} Km - ${TAB_trajet_ok[mytrajet_id].Ecluses} ${CNT_FLUVIACAP_ECLUSES}`;

    voie_num = 1;
    let nb_point = 0;
    let i = 0;
    for (let [etape_cle, port_id] of Object.entries(TAB_trajet_ok[mytrajet_id].etapes)) {
        let list_Chantiers = '';
        let list_Loueurs = '';

        let sql = `SELECT Port_Id, Port_Nom, Port_Type, Port_MapX, Port_MapY, PortType_Img, Port_Nom, Port_Type, Port_Embranchement_Info FROM mappyfluvial_ports p, mappyfluvial_ports_type t WHERE p.Port_Id='${port_id}' AND t.PortType_Id = p.Port_Type AND p.Port_MapX != '' AND p.Port_MapY != ''`;
        let tab = await pool.query(sql);

        sql_chantiers = `SELECT c.CLE, c.NOM FROM mappyfluvial_ports_chantiers r, chantier_adr c WHERE r.PortChantier_PortId='${port_id}' AND c.CLE = r.PortChantier_ChantierId `;
        req_chantiers = await pool.query(sql_chantiers);

        req_chantiers.forEach((tab_chantiers) => {
            list_ChantiersZZ += `<a href='http://www.fluvialnet.com/index.html?idmenu=chantier&mode=3&chantier=${tab_chantiers.CLE}&gm=true' ><img src='/img/design/fluviacap/ico_chantier.gif' border='0'/> ${tab_chantiers.NOM}</a><br /> `;
            list_Chantiers += `<a href="http://www.fluvialnet.com/index.html?idmenu=chantier&mode=3&chantier=${tab_chantiers.CLE}" onclick="window.open(this.href,'','toolbar=0,location=0,directories=0,status=0,scrollbars=1,resizable=0,copyhistory=0,menuBar=0,width=630,height=600');return(false);" target="_blank" ><img src="/img/design/fluviacap/ico_chantier.gif" width="11" height="9" alt="${tab_chantiers.NOM.trim()}" title="<b>CHANTIER</b> : ${tab_chantiers.NOM.trim()} (voir la fiche)" border="0" class="tooltip" />${tab_chantiers.NOM}</a><br /> `;
        });

        let sql_loueurs = `SELECT l.CLE, l.SOCIETE FROM mappyfluvial_ports_loueurs r, loueur_adr l WHERE r.PortLoueur_PortId='${port_id}' AND l.CLE = r.PortLoueur_LoueurId `;
        let req_loueurs = await pool.query(sql_loueurs);

        req_loueurs.forEach((tab_loueurs) => {
            let sUrlLoueur = `http://www.fluvialnet.com/index.html?idmenu=loueur&mode=3&loueur=${tab_loueurs.CLE}`;
            let sOptPopup = `'toolbar=0,location=0,directories=0,status=0,scrollbars=1,resizable=0,copyhistory=0,menuBar=0,width=630,height=600'`;
            list_Loueurs += `<a href="${sUrlLoueur}" onclick="window.open(this.href,'',${sOptPopup});return(false);" title="LOUEUR : ${tab_loueurs.SOCIETE.trim()} (voir la fiche)" ><img src="/img/design/fluviacap/ico_loueur.gif" width="11" height="9" alt="${tab_loueurs.SOCIETE.trim()}"  class="tooltip" border="0" />&nbsp;${tab_loueurs.SOCIETE}</a> `;
        });

        let troncon_id = TAB_trajet_ok[mytrajet_id].troncons[etape_cle];
        let voie_id = TAB_trajet_ok[mytrajet_id][`Troncon_${troncon_id}`].Voie_Id;
        let troncon_km = TAB_trajet_ok[mytrajet_id][`Troncon_${troncon_id}`].Km;
        let troncon_temps = TAB_trajet_ok[mytrajet_id][`Troncon_${troncon_id}`].Temps;
        let troncon_ecluses = TAB_trajet_ok[mytrajet_id][`Troncon_${troncon_id}`].Ecluses;
        let troncon_avalant = TAB_trajet_ok[mytrajet_id][`Troncon_${troncon_id}`].Avalant;
        let Troncon_NbPontLevis = TAB_trajet_ok[mytrajet_id][`Troncon_${troncon_id}`].NbPontLevis;

        if (troncon_id !== '') {
            if (tab.Port_Id !== '' && tab.Port_MapX !== '' && tab.Port_MapY !== '') {
                let troncon_img = '';
                if (troncon_ecluses !== '0' && troncon_ecluses !== '') {
                    if (troncon_avalant === '0') {
                        troncon_img = 'ecluse_avalante.png';
                    } else if (troncon_avalant === '1') {
                        troncon_img = 'ecluse_montante.png';
                    }
                }

                if (Troncon_NbPontLevis !== '0') {
                    let sql_pontlevis = `SELECT * FROM mappyfluvial_pontlevis WHERE Pontlevis_TronconId='${troncon_id}' `;
                    let req_pontlevis = await pool.query(sql_pontlevis);

                    req_pontlevis.forEach((tab_pontlevis) => {
                        let sPoint = `new google.maps.LatLng(${tab_pontlevis.Pontlevis_MapX},${tab_pontlevis.Pontlevis_MapY})`;
                        let sToolTip = tab_pontlevis.Pontlevis_Nom;
                        let sImgPort = `/img/design/fluviacap/googlemaps/v3/ico_pont.png`;
                        let sTitle = tab_pontlevis.Pontlevis_Nom;
                        sessionStorage.setItem(`trajet_${mytrajet_id}_port_google`, `
                            createMarker(${sPoint}, "${sTitle}","${sToolTip}", "${sImgPort}", map${mytrajet_id});
                        `);
                    });
                }

                let sql_ecluses = `SELECT * FROM mappyfluvial_ecluses WHERE Ecluse_TronconId='${troncon_id}' `;
                let req_ecluses = await pool.query(sql_ecluses);

                req_ecluses.forEach((tab_ecluses) => {
                    let sPoint = `new google.maps.LatLng(${tab_ecluses.Ecluse_MapX},${tab_ecluses.Ecluse_MapY})`;
                    let sToolTip = tab_ecluses.Ecluse_Nom;
                    let sImgPort = `/img/design/fluviacap/googlemaps/v3/${troncon_img}`;
                    let sTitle = tab_ecluses.Ecluse_Nom;
                    sessionStorage.setItem(`trajet_${mytrajet_id}_port_google`, `
                        createMarker(${sPoint}, "${sTitle}","${sToolTip}", "${sImgPort}", map${mytrajet_id});
                    `);
                });

                let sPoint = `new google.maps.LatLng(${tab.Port_MapX},${tab.Port_MapY})`;
                let sToolTip = `${tab.Port_Nom}<br /><br />${list_Chantiers.replace(/"/g, '\\"')}${list_Loueurs.replace(/"/g, '\\"')}`;
                let sImgPort = `/img/design/fluviacap/googlemaps/v3/${tab.PortType_Img}`;
                let sTitle = tab.Port_Nom.trim();
                sessionStorage.setItem(`trajet_${mytrajet_id}_port_google`, `
                    createMarker(${sPoint}, "${sTitle}","${sToolTip}", "${sImgPort}", map${mytrajet_id});
                `);
            }

            if (tab.Port_Id !== '' && tab.Port_MapX !== '' && tab.Port_MapY !== '') {
                let pk_google_element = '';
                let sql_pk = `SELECT Element_Latitude, Element_Longitude FROM mappyfluvial_elements_googlemaps WHERE Element_TronconId='${troncon_id}' ORDER BY Element_Id ASC`;
                let req_pk = await pool.query(sql_pk);

                let u = 0;
                req_pk.forEach((tab_pk) => {
                    let niveau_zoom = nb_point < 20 ? 14 : 8;
                    if (u === 0) {
                        sessionStorage.setItem(`trajet_${mytrajet_id}_centre_google`, `map${mytrajet_id}.setCenter(new google.maps.LatLng(${tab_pk.Element_Latitude}, ${tab_pk.Element_Longitude}), ${niveau_zoom});`);
                    }

                    pk_google_element += `new google.maps.LatLng(${tab_pk.Element_Latitude}, ${tab_pk.Element_Longitude}),`;
                    u++;
                    nb_point++;
                });

                if (pk_google_element !== '' && pk_google_element !== old_pk_google_element && tab.Port_Id !== '' && tab.Port_MapX !== '') {
                    i++;
                    pk_google_element = pk_google_element.trim().trim(',');
                    sessionStorage.setItem(`trajet_${mytrajet_id}_pk_google`, `
                        var polyline_${troncon_id} = new google.maps.Polyline({
                            path: [${pk_google_element}],
                            strokeColor: "#3366CC",
                            geodesic: false,
                            strokeOpacity: 1.0,
                            strokeWeight: 4
                        });
                        polyline_${troncon_id}.setMap(map${mytrajet_id});
                    `);
                }
            }
        }

        if (port_id === point_arrivee || (voie_id !== prev_voie_id && prev_voie_id !== '')) {
            voie_num++;
        }

        JS_delete_embrachement += `$('.embranchement_${voie_id}').hide();`;

        if (voie_id !== prev_voie_id) {
            connectBdd();
            let sql_guide = `SELECT CarteGuide_Num, CarteGuide_Code, CarteGuide_Titre, CarteGuide_Titre_EN, CarteGuide_Titre_DE, CarteGuide_Dispo, VoieNavGuide_GuideId, CarteGuide_PrixTtc FROM voienav_guide ng, fluviacarte_guides g WHERE ng.VoieNavGuide_VoieId='${voie_id}' AND g.CarteGuide_Code = ng.VoieNavGuide_GuideId GROUP BY ng.VoieNavGuide_GuideId`;
            let req_guide = await pool.query(sql_guide);

            req_guide.forEach((tab_guide) => {
                let enr_guide = 1;
                guide_code_vieux.forEach((code_vieux) => {
                    if (code_vieux === tab_guide.CarteGuide_Code) {
                        enr_guide = 0;
                    }
                });

                if (enr_guide === 1) {
                    let testbr = tab_guide[`CarteGuide_Titre${LANG_DB}`].lastIndexOf('<br />');
                    let guide_titre = testbr !== -1 ? tab_guide[`CarteGuide_Titre${LANG_DB}`].slice(0, testbr) : tab_guide[`CarteGuide_Titre${LANG_DB}`];
                    let guide_price = tab_guide.CarteGuide_Dispo === '1' ? `(${tab_guide.CarteGuide_PrixTtc} &euro;)` : `(${DIVERS_INDISPONIBLE_SHORT})`;

                    HTML_guides += `<li><a href="${URL_GUIDE}${extractGuideTitle(tab_guide[`CarteGuide_Titre${LANG_DB}`])}-${tab_guide.CarteGuide_Num}" target="_parent">${guide_titre} <span style="font-size:10px;">${guide_price}</span></a></li>`;
                    guide_code_vieux.push(tab_guide.CarteGuide_Code);
                }
            });
        }
        sessionStorage.setItem(`trajet_${mytrajet_id}_guide`, HTML_guides);

        if (etape_cle > 1) {
            if (voie_id !== prev_voie_id) {
                if (prev_voie_id !== '') {
                    HTML_trajet += `
                        <div style="clear:both;"></div>
                        </ul>
                    </div>`;
                }

                let sql_voie = `SELECT voie.CLE, voie.LIBELLE, voie.CLE_BAS, bass.LIBELLE${LANG_DB} as LIBELLE_BAS FROM voienav voie RIGHT JOIN bassin bass ON bass.CLE = voie.CLE_BAS WHERE voie.CLE='${voie_id}'`;
                let tab_voie = await pool.query(sql_voie);

                HTML_lien_voie[voie_num] = `<a href="${cleanUrl(URL_VOIES + URL_REGION + tab_voie.LIBELLE_BAS + '-' + tab_voie.CLE_BAS + URL_VOIE + tab_voie.LIBELLE + '-' + voie_id)}" target="_blank">[${CNT_FLUVIACAP_LEARN_MORE}]</a>`;

                if (switch_display === true) {
                    HTML_trajet += `<a id="trajet_${mytrajet_id}_titre_voie_${voie_num}" href="javascript:swith_detail_voie('${mytrajet_id}','${voie_num}');" class="titre_voie ${LANG}"><span>${tab_voie.LIBELLE}</span></a>`;
                } else if (type_display === '' || type_display === 'pdf' || type_display === 'print') {
                    HTML_trajet += `<div id="trajet_${mytrajet_id}_titre_voie_${voie_num}" class="titre_voie ${LANG}"><span class="">${tab_voie.LIBELLE}</span></div>`;
                }

                HTML_trajet += `
                    <div id="trajet_${mytrajet_id}_info_voie_${voie_num}" class="info_voie">[[infovoie_${voie_num}]]</div>
                    <div id="trajet_${mytrajet_id}_detail_voie_${voie_num}" class="detail_voie" style="display:none;">
                        <ul>`;
            }

            let troncon_class = 'troncon';
            let _troncon_ecluses = '';
            if (troncon_ecluses !== '0' && troncon_ecluses !== '') {
                troncon_class = troncon_avalant === '0' ? 'troncon_ecluses_avalant' : 'troncon_ecluses_montant';
                _troncon_ecluses = `<span class="nb_ecluses">${troncon_ecluses}</span>`;
            }

            HTML_trajet += `<li class="${troncon_class}">${_troncon_ecluses}<span>${formate_temps(troncon_temps)} - ${troncon_km} Km</span>&nbsp;</li>`;

            if (Troncon_NbPontLevis > 0) {
                HTML_trajet += `<li class="etape_pontlevis"><span class="nb_pontlevis">${Troncon_NbPontLevis}</span><span>&nbsp;</li>`;
            }
        }

        let sql_pk = `SELECT PortVoie_Pk FROM mappyfluvial_ports_voies WHERE PortVoie_PortId='${port_id}' AND PortVoie_VoieId='${voie_id}'`;
        let tab_pk = await pool.query(sql_pk);

        let pk_voie = tab_pk.PortVoie_Pk;

        let etape_classe;
        switch (tab.Port_Type) {
            case '1':
                etape_classe = 'etape_port';
                break;
            case '2':
                etape_classe = 'etape_halte';
                break;
            case '3':
                etape_classe = 'etape_jonction';
                break;
            case '4':
                etape_classe = 'etape_escale';
                break;
            case '5':
                etape_classe = 'etape_bief';
                break;
            case '6':
                etape_classe = 'etape_tunnel';
                break;
            default:
                etape_classe = 'etape_jonction';
        }

        let HTML_loueurs = '';
        let HTML_loueurs_pdf = '';
        sql_loueurs = `SELECT CLE, SOCIETE FROM mappyfluvial_ports_loueurs LEFT JOIN loueur_adr ON PortLoueur_LoueurId=CLE WHERE PortLoueur_PortId='${port_id}'`;
        req_loueurs = await pool.query(sql_loueurs);

        req_loueurs.forEach((tab_loueurs) => {
            HTML_loueurs += `<a href="http://www.fluvialnet.com/index.html?idmenu=loueur&mode=3&loueur=${tab_loueurs.CLE}" onclick="window.open(this.href,'','toolbar=0,location=0,directories=0,status=0,scrollbars=1,resizable=0,copyhistory=0,menuBar=0,width=630,height=600');return(false);" ><img src="${rel_dossier}/img/design/fluviacap/ico_loueur.gif" width="11" height="9" alt="${tab_loueurs.SOCIETE.trim()}" title="<b>LOUEUR</b> : ${tab_loueurs.SOCIETE.trim()} (voir la fiche)" class="tooltip" border="0" /></a> `;
            HTML_loueurs_pdf += `<img src="${rel_dossier}/img/design/fluviacap/ico_loueur_pdf.gif" width="14" height="9" alt="${tab_loueurs.SOCIETE.trim()}" title="${tab_loueurs.SOCIETE.trim()}" border="0" />`;
        });

        let HTML_chantiers = '';
        let HTML_chantiers_pdf = '';
        let sql_chantiers = `SELECT NOM, CLE FROM mappyfluvial_ports_chantiers LEFT JOIN chantier_adr ON PortChantier_ChantierId=CLE WHERE PortChantier_PortId='${port_id}'`;
        let req_chantiers = await pool.query(sql_chantiers);

        req_chantiers.forEach((tab_chantiers) => {
            HTML_chantiers += `<a href="http://www.fluvialnet.com/index.html?idmenu=chantier&mode=3&chantier=${tab_chantiers.CLE}" onclick="window.open(this.href,'','toolbar=0,location=0,directories=0,status=0,scrollbars=1,resizable=0,copyhistory=0,menuBar=0,width=630,height=600');return(false);" target="_blank" ><img src="${rel_dossier}/img/design/fluviacap/ico_chantier.gif" width="11" height="9" alt="${tab_chantiers.NOM.trim()}" title="<b>CHANTIER</b> : ${tab_chantiers.NOM.trim()} (voir la fiche)" border="0" class="tooltip" /></a> `;
            HTML_chantiers_pdf += `<img src="${rel_dossier}/img/design/fluviacap/ico_chantier_pdf.gif" width="11" height="9" alt="${tab_chantiers.NOM.trim()}" title="${tab_chantiers.NOM.trim()}" border="0" />`;
        });

        let HTML_emb = '';
        let sql_emb = `SELECT voie.LIBELLE as LIBELLE, voie.CLE_BAS as CLE_BAS, voie.CLE as CLE_VOIE, bass.LIBELLE${LANG_DB} as BASSIN FROM mappyfluvial_ports_voies port
                        LEFT JOIN voienav voie ON port.PortVoie_VoieId = voie.CLE
                        RIGHT JOIN bassin bass ON voie.CLE_BAS = bass.CLE
                        WHERE port.PortVoie_PortId='${port_id}' AND port.PortVoie_VoieId!='${voie_id}' AND voie.LIBELLE!=''
                        ORDER BY port.PortVoie_Ordre`;
        let req_emb = await pool.query(sql_emb);

        req_emb.forEach((tab_emb) => {
            let cle_emb = tab_emb.CLE_VOIE;
            if (tab_emb.LIBELLE.trim() !== '') {
                HTML_emb += `<span class="embranchement_${cle_emb}" ><a href="${URL_VOIES + URL_REGION + cleanUrl(tab_emb.BASSIN) + '-' + tab_emb.CLE_BAS + URL_VOIE + cleanUrl(tab_emb.LIBELLE) + '-' + tab_emb.CLE_VOIE}" target="_blank">${tab_emb.LIBELLE.trim()}</a><br /></span>`;
            }
        });

        if (tab.Port_Embranchement_Info !== '') {
            HTML_emb += `${tab.Port_Embranchement_Info}<br />`;
        }

        if (HTML_emb !== '') {
            HTML_emb = `<div class="etape_bloc2">${HTML_emb}</div>`;
        }

        if (type_display === 'pdf') {
            if (etape_cle === 1) {
                HTML_trajet += `
                    <ul class="depart"><li class="D_${etape_classe}"><span>${CNT_FLUVIACAP_DEPART}
                    ${HTML_loueurs_pdf} ${HTML_chantiers_pdf}
                    </span> <strong>(${tab.Port_Nom})</strong>
                    </li></ul>`;
            } else if (port_id === point_arrivee) {
                HTML_arrivee = `
                    <ul class="arrivee"><li class="A_${etape_classe}"><span>${CNT_FLUVIACAP_ARRIVEE}
                    ${HTML_loueurs_pdf} ${HTML_chantiers_pdf}
                    </span> <strong>(${tab.Port_Nom} - Pk ${tab_pk.PortVoie_Pk})</strong>
                    </li></ul>`;
            } else {
                HTML_trajet += `
                    <li class="${etape_classe}">
                        <div class="etape_bloc1">
                            <strong>Pk ${Math.round(tab_pk.PortVoie_Pk, 1)} - ${tab.Port_Nom}</strong>
                            ${HTML_loueurs_pdf} ${HTML_chantiers_pdf}
                        </div>
                        ${HTML_emb}
                        <div style="clear:both;"></div>
                    </li>`;
            }
        } else {
            if (etape_cle === 1) {
                HTML_trajet += `
                    <ul class="depart"><li class="D_${etape_classe}"><span>${CNT_FLUVIACAP_DEPART}
                    ${HTML_loueurs} ${HTML_chantiers}
                    </span> <strong>(${tab.Port_Nom})</strong>
                    </li></ul>`;
            } else if (port_id === point_arrivee) {
                HTML_arrivee = `
                    <ul class="arrivee"><li class="A_${etape_classe}"><span>${CNT_FLUVIACAP_ARRIVEE}
                    ${HTML_loueurs} ${HTML_chantiers}
                    </span>
                    <strong>(Pk ${Math.round(tab_pk.PortVoie_Pk, 1)} - ${tab.Port_Nom})</strong>
                    </li></ul>`;
            } else {
                HTML_trajet += `
                    <li class="${etape_classe}">
                        <div class="etape_bloc1">
                            <strong>Pk ${Math.round(tab_pk.PortVoie_Pk, 1)} - ${tab.Port_Nom}</strong>
                            ${HTML_loueurs} ${HTML_chantiers}
                        </div>
                        ${HTML_emb}
                        <div style="clear:both;"></div>
                    </li>`;
            }
        }

        prev_voie_id = voie_id;
    }

    HTML_trajet += `
            <div style="clear:both;"></div>
        </ul>
    </div>
    ${HTML_arrivee}
</div>`;

    if (type_display === 'web') {
        HTML_trajet += addTrajetFooterLinks(mytrajet_id);
    }
    HTML_trajet += `</div>`;

    let voie_num = 1;
    let total_voie_km = 0;
    let total_voie_temps = 0;
    let total_voie_ecluses = 0;
    let total_voie_tirantEau = 1000;
    let total_voie_tirantAir = 1000;
    let total_voie_longueur = 1000;
    let total_voie_largeur = 1000;

    for (let [troncon_cle, troncon_id] of Object.entries(TAB_trajet_ok[mytrajet_id].troncons)) {
        let voie_id = TAB_trajet_ok[mytrajet_id][`Troncon_${troncon_id}`].Voie_Id;
        let troncon_km = TAB_trajet_ok[mytrajet_id][`Troncon_${troncon_id}`].Km;
        let troncon_temps = TAB_trajet_ok[mytrajet_id][`Troncon_${troncon_id}`].Temps;
        let troncon_ecluses = TAB_trajet_ok[mytrajet_id][`Troncon_${troncon_id}`].Ecluses;
        let troncon_NbPontLevis = TAB_trajet_ok[mytrajet_id][`Troncon_${troncon_id}`].NbPontLevis;
        let troncon_tirantAir = TAB_trajet_ok[mytrajet_id][`Troncon_${troncon_id}`].TirantAir;
        let troncon_tirantEau = TAB_trajet_ok[mytrajet_id][`Troncon_${troncon_id}`].TirantEau;
        let troncon_longueur = TAB_trajet_ok[mytrajet_id][`Troncon_${troncon_id}`].Longueur;
        let troncon_largeur = TAB_trajet_ok[mytrajet_id][`Troncon_${troncon_id}`].Largeur;

        if ((voie_id !== prev_voie_id && prev_voie_id !== '') || i === TAB_trajet_ok[mytrajet_id].troncons.length) {
            if (i === TAB_trajet_ok[mytrajet_id].troncons.length) {
                if (i === 0) {
                    total_voie_km = troncon_km;
                    total_voie_temps = troncon_temps;
                    total_voie_ecluses = troncon_ecluses;
                } else {
                    total_voie_km += troncon_km;
                    total_voie_temps += troncon_temps;
                    total_voie_ecluses += troncon_ecluses;
                }

                if (troncon_tirantAir < total_voie_tirantAir) {
                    total_voie_tirantAir = troncon_tirantAir;
                }
                if (troncon_tirantEau < total_voie_tirantEau) {
                    total_voie_tirantEau = troncon_tirantEau;
                }
                if (troncon_longueur < total_voie_longueur) {
                    total_voie_longueur = troncon_longueur;
                }
                if (troncon_largeur < total_voie_largeur) {
                    total_voie_largeur = troncon_largeur;
                }
            }

            TAB_total_voie_km[voie_num] = total_voie_km;
            total_voie_km = troncon_km;
            TAB_total_voie_temps[voie_num] = total_voie_temps;
            total_voie_temps = troncon_temps;
            TAB_total_voie_ecluses[voie_num] = total_voie_ecluses;
            total_voie_ecluses = troncon_ecluses;

            TAB_total_voie_tirantAir[voie_num] = total_voie_tirantAir;
            total_voie_tirantAir = troncon_tirantAir;
            TAB_total_voie_tirantEau[voie_num] = total_voie_tirantEau;
            total_voie_tirantEau = troncon_tirantEau;
            TAB_total_voie_longueur[voie_num] = total_voie_longueur;
            total_voie_longueur = troncon_longueur;
            TAB_total_voie_largeur[voie_num] = total_voie_largeur;
            total_voie_largeur = troncon_largeur;

            voie_num++;
        } else {
            total_voie_km += troncon_km;
            total_voie_temps += troncon_temps;
            total_voie_ecluses += troncon_ecluses;

            if (troncon_tirantAir < total_voie_tirantAir) {
                total_voie_tirantAir = troncon_tirantAir;
            }
            if (troncon_tirantEau < total_voie_tirantEau) {
                total_voie_tirantEau = troncon_tirantEau;
            }
            if (troncon_longueur < total_voie_longueur) {
                total_voie_longueur = troncon_longueur;
            }
            if (troncon_largeur < total_voie_largeur) {
                total_voie_largeur = troncon_largeur;
            }
        }

        prev_voie_id = voie_id;
        i++;
    }

    if (!TAB_total_voie_km[voie_num]) {
        TAB_total_voie_km[voie_num] = total_voie_km;
        TAB_total_voie_temps[voie_num] = total_voie_temps;
        TAB_total_voie_ecluses[voie_num] = total_voie_ecluses;
        TAB_total_voie_tirantEau[voie_num] = total_voie_tirantEau;
        TAB_total_voie_tirantAir[voie_num] = total_voie_tirantAir;
        TAB_total_voie_longueur[voie_num] = total_voie_longueur;
        TAB_total_voie_largeur[voie_num] = total_voie_largeur;
    }

    for (let [cle, valeur] of Object.entries(TAB_total_voie_km)) {
        let cle2 = (TAB_total_voie_km.length === 1 && TAB_trajet_ok[mytrajet_id].troncons.length === 1) ? cle + 1 : cle;

        if (TAB_total_voie_tirantEau[cle] > 900) TAB_total_voie_tirantEau[cle] = 'NC';
        if (TAB_total_voie_tirantAir[cle] > 900) TAB_total_voie_tirantAir[cle] = 'NC';
        if (TAB_total_voie_longueur[cle] > 900) TAB_total_voie_longueur[cle] = 'NC';
        if (TAB_total_voie_largeur[cle] > 900) TAB_total_voie_largeur[cle] = 'NC';

        let HTML_info_voie = `${formate_temps(TAB_total_voie_temps[cle])}  - ${TAB_total_voie_km[cle]} km - ${TAB_total_voie_ecluses[cle]} écl. - TE : ${TAB_total_voie_tirantEau[cle]}, TA : ${TAB_total_voie_tirantAir[cle]}, Long : ${TAB_total_voie_longueur[cle]}, Larg : ${TAB_total_voie_largeur[cle]} &nbsp;<span class="infosup">${HTML_lien_voie[cle]}</span>`;
        HTML_trajet = HTML_trajet.replace(`[[infovoie_${cle2}]]`, HTML_info_voie);
    }

    let tempMissingPdf = [];
    let tempMissingPdfByvoie = [];

    for (let [Pdfkey, Pdfvalue] of Object.entries(TAB_trajet_ok[mytrajet_id].troncons)) {
        let pdfVoieId = TAB_trajet_ok[mytrajet_id][`Troncon_${Pdfvalue}`].Voie_Id;
        let sql_orderD = `SELECT Troncon_Port1Id FROM mappyfluvial_troncons WHERE Troncon_Port1Id = ${TAB_trajet_ok[mytrajet_id].etapes[Pdfkey - 1]} AND Troncon_Id = ${Pdfvalue}`;
        let order = {};
        order[pdfVoieId] = await pool.query(sql_orderD) ? "DESC" : "ASC";

        TAB_trajet_ok[mytrajet_id].tronconparvoie[pdfVoieId] = TAB_trajet_ok[mytrajet_id].tronconparvoie[pdfVoieId] || [];
        TAB_trajet_ok[mytrajet_id].tronconparvoie[pdfVoieId].push(Pdfvalue);

        let sql_pdf = `SELECT guide_guideId, guide_pageNumber FROM mappyfluvial_guide WHERE guide_tronconId = ${Pdfvalue}`;
        if (TAB_trajet_ok[mytrajet_id].tronconparvoie[pdfVoieId].length === 1 && order[pdfVoieId] === "DESC") {
            sql_pdf += ` ORDER BY guide_id ${order[pdfVoieId]}`;
        }

        let req_pdf = await pool.query(sql_pdf);

        if (!req_pdf.length) {
            tempMissingPdf.push(Pdfvalue);
            tempMissingPdfByvoie.push(Pdfvalue);
        }

        req_pdf.forEach((tabPdf) => {
            TAB_trajet_ok[mytrajet_id].guidepdf[pdfVoieId] = TAB_trajet_ok[mytrajet_id].guidepdf[pdfVoieId] || {};
            TAB_trajet_ok[mytrajet_id].guidepdf[pdfVoieId][tabPdf.guide_guideId] = TAB_trajet_ok[mytrajet_id].guidepdf[pdfVoieId][tabPdf.guide_guideId] || [];
            TAB_trajet_ok[mytrajet_id].guidepdf[pdfVoieId][tabPdf.guide_guideId].push(tabPdf.guide_pageNumber);
            TAB_trajet_ok[mytrajet_id].guidepdf[pdfVoieId][tabPdf.guide_guideId] = [...new Set(TAB_trajet_ok[mytrajet_id].guidepdf[pdfVoieId][tabPdf.guide_guideId])];
        });
    }

    let arrayMissingPort = TAB_trajet_ok[mytrajet_id].troncons.filter(troncon => tempMissingPdf.includes(troncon));
    let last_key = arrayMissingPort.length - 1;
    let prevKey, prevValue;

    arrayMissingPort.forEach((valueMissingPort, keyMissingPort) => {
        if (keyMissingPort !== (prevKey + 1) && keyMissingPort !== (prevKey - 1)) {
            if (prevValue && valueMissingPort !== prevValue) {
                TAB_trajet_ok[mytrajet_id].missingPdf.portArrivee.push(prevValue);
            }

            if (!arrayMissingPort[keyMissingPort + 1] && !arrayMissingPort[keyMissingPort + 1]) {
                TAB_trajet_ok[mytrajet_id].missingPdf.portDepartArrivee.push(valueMissingPort);
            } else {
                TAB_trajet_ok[mytrajet_id].missingPdf.portDepart.push(valueMissingPort);
            }
        } else if (keyMissingPort === last_key && prevValue && valueMissingPort !== prevValue) {
            TAB_trajet_ok[mytrajet_id].missingPdf.portArrivee.push(valueMissingPort);
        }

        prevKey = keyMissingPort;
        prevValue = valueMissingPort;
    });

    let tabDepartArrivee = [];

    Object.entries(TAB_trajet_ok[mytrajet_id].missingPdf).forEach(([keyMp, valueMp]) => {
        if (keyMp === 'portDepartArrivee') {
            valueMp.forEach((valuePda) => {
                let sens1 = tempMissingPdfByvoie.includes(valuePda) ? 't.Troncon_Port1Id' : 't.Troncon_Port2Id';
                let sens2 = tempMissingPdfByvoie.includes(valuePda) ? 't.Troncon_Port2Id' : 't.Troncon_Port1Id';

                let sql_port_missing_depart = `SELECT p.Port_Id, p.Port_Nom, t.Troncon_Id FROM mappyfluvial_troncons t, mappyfluvial_ports p WHERE ${sens1} = p.Port_Id AND t.Troncon_Id = ${valuePda}`;
                let tab_port_missing_depart = pool.query(sql_port_missing_depart);

                tabDepartArrivee.depart.push(tab_port_missing_depart);

                let sql_port_missing_arrivee = `SELECT p.Port_Id, p.Port_Nom, t.Troncon_Id FROM mappyfluvial_troncons t, mappyfluvial_ports p WHERE ${sens2} = p.Port_Id AND t.Troncon_Id = ${valuePda}`;
                let tab_port_missing_arrivee = pool.query(sql_port_missing_arrivee);

                tabDepartArrivee.arrivee.push(tab_port_missing_arrivee);
            });
        } else if (keyMp === 'portDepart') {
            valueMp.forEach((valuePd) => {
                let sensD = tempMissingPdfByvoie.includes(valuePd) ? 't.Troncon_Port1Id' : 't.Troncon_Port2Id';

                let sql_port_missing_depart = `SELECT p.Port_Id, p.Port_Nom, t.Troncon_Id FROM mappyfluvial_troncons t, mappyfluvial_ports p WHERE ${sensD} = p.Port_Id AND t.Troncon_Id = ${valuePd}`;
                let tab_port_missing_depart = pool.query(sql_port_missing_depart);

                tabDepartArrivee.depart.push(tab_port_missing_depart);
            });
        } else if (keyMp === 'portArrivee') {
            valueMp.forEach((valuePa) => {
                let sensA = tempMissingPdfByvoie.includes(valuePa) ? 't.Troncon_Port2Id' : 't.Troncon_Port1Id';

                let sql_port_missing_arrivee = `SELECT p.Port_Id, p.Port_Nom, t.Troncon_Id FROM mappyfluvial_troncons t, mappyfluvial_ports p WHERE ${sensA} = p.Port_Id AND t.Troncon_Id = ${valuePa}`;
                let tab_port_missing_arrivee = pool.query(sql_port_missing_arrivee);

                tabDepartArrivee.arrivee.push(tab_port_missing_arrivee);
            });
        }
    });

    tabDepartArrivee.depart.forEach((valueDa, keyDa) => {
        TAB_trajet_ok[mytrajet_id].missingPdfPortName.push(`${DIVERS_DE_FROM} ${valueDa.Port_Nom.trim()} ${DIVERS_A_TO} ${tabDepartArrivee.arrivee[keyDa].Port_Nom.trim()}`);
    });

    let inputHiddenMissingPort = '';
    let ajaxMissingPages = '';

    TAB_trajet_ok[mytrajet_id].missingPdfPortName = [...new Set(TAB_trajet_ok[mytrajet_id].missingPdfPortName)];
    TAB_trajet_ok[mytrajet_id].missingPdfPortName.forEach((valuePn, index) => {
        inputHiddenMissingPort += `<input type="hidden" name="mp[]" id="mp_${index + 1}" value="${valuePn}"/>`;
        ajaxMissingPages += `'misspage_${index + 1}' : '${valuePn.replace("'", "\\'")}', `;
    });
    ajaxMissingPages = ajaxMissingPages.slice(0, -2);

    let pageNumber = 0;
    let inputHidden = '';
    TAB_trajet_ok[mytrajet_id].guidepdf = [...new Set(TAB_trajet_ok[mytrajet_id].guidepdf)];

    let ajaxPages = '';
    TAB_trajet_ok[mytrajet_id].guidepdfFINAL = [...new Set(TAB_trajet_ok[mytrajet_id].guidepdfFINAL)];

    TAB_trajet_ok[mytrajet_id].guidepdfFINAL.forEach((valueT, index) => {
        pageNumber++;
        inputHidden += `<input type="hidden" name="page[]" id="page_${index + 1}" value="${valueT}"/>`;
        ajaxPages += `'page_${index + 1}' : '${valueT}', `;
    });
    ajaxPages = ajaxPages.slice(0, -2);

    if (pageNumber > 0) {
        let phrase_desc = pageNumber > 1 ? CNT_FLUVIACARTE_CARTES_COUVRENT : CNT_FLUVIACARTE_CARTE_COUVRE;
        let prixPage = cmd.getFluviacapPagePrice();
        let prix = (pageNumber * prixPage).toFixed(2);
        HTML_pdf = `<div class="guidepdf_intro">${CNT_FLUVIACAP_VOS_CARTES_INTRO}</div>`;

        let _texte = CNT_FLUVIACAP_VOS_CARTES_TRAJET.replace('##FROM##', port_nom_depart.trim()).replace('##TO##', port_nom_arrivee.trim());
        HTML_pdf += `<div class="guidepdf_trajet">${pageNumber} ${_texte}</div>`;

        HTML_pdf += `<a href="javascript: controler('cmd', 'addToCart', {'product_id': 0, 'product_type': 'fluviacap', 'quantity': 1, 'page_number': ${pageNumber}, 'depart': '${port_nom_depart.trim().replace("'", "\\'")}', 'arrivee': '${port_nom_arrivee.trim().replace("'", "\\'")}', 'longueur': '${document.getElementById('search_longueur').value}', 'largeur': '${document.getElementById('search_largeur').value}', 'tirantair': '${document.getElementById('search_tirantair').value}', 'tiranteau': '${document.getElementById('search_tiranteau').value}', 'prix': '${prix}' ${ajaxPages ? `, ${ajaxPages}` : ''} ${ajaxMissingPages ? `, ${ajaxMissingPages}` : ''}});" class="ajouter" >${PANIER_AJOUTER}</a>`;

        HTML_pdf += `<span id="vos_cartes_pour">${CNT_FLUVIACAP_VOS_CARTES_POUR}&nbsp;${prix} &euro;</span>`;
        sessionStorage.setItem(`trajet_${mytrajet_id}_guidepdf`, HTML_pdf);
    } else {
        HTML_pdf = '';
        sessionStorage.removeItem(`trajet_${mytrajet_id}_guidepdf`);
    }

    return HTML_trajet;
}

function addTrajetFooterLinks(trajet_id) {
    let TAB_trajet_ok = JSON.parse(sessionStorage.getItem('TAB_trajet_ok'));

    let HTMLhiddens = '';
    for (let [champ, valeur] of Object.entries(TAB_trajet_ok)) {
        HTMLhiddens += `<input type="hidden" name="${champ}" id="${champ}" value="${valeur}" />`;
    }
    HTMLhiddens += `<input type="hidden" name="TAB_trajet_ok" id="TAB_trajet_ok" value="${encodeURIComponent(JSON.stringify(TAB_trajet_ok))}" />`;

    let HTML = `<div class="trajet_footer_links">`;
    HTML += `<form name="" id="formPrint" method="post" target="_blank" enctype="multipart/form-data" action="/${LANG}/fluviacap/resultats_print.php?id=${trajet_id}">`;
    HTML += HTMLhiddens;
    HTML += `<a href="javascript:" onClick="parentNode.submit();"><img src="/img/design/fluviacap/btn_print.png" border="0" />${CNT_FLUVIACAP_IMPRIMER}</a>`;
    HTML += `</form>`;

    HTML += `<form name="" id="formPdf" method="post" target="_blank" enctype="multipart/form-data" action="/${LANG}/fluviacap/resultats_pdft.php?id=${trajet_id}">`;
    HTML += HTMLhiddens;
    HTML += `<a href="javascript:" onClick="parentNode.submit();"><img src="/img/design/fluviacap/btn_download.png" border="0" />${CNT_FLUVIACAP_TELECHARGER_PDF}</a>`;
    HTML += `</form>`;
    HTML += `</div>`;

    return HTML;
}




function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    seconds %= 60;
    return `${hours}:${minutes}:${seconds}`;
  }



module.exports = {
    affiche_trajet,
    addTrajetFooterLinks
};





