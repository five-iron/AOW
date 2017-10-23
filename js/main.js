

$(function() {
     $("#innerHoversewer, #innerHoverputrid, #innerHoverVaaltemple, #innerHoverreef, #innerHovertropical, #innerHovervaalcity, #innerHovervaultofatziri, #innerHovercanyon, #innerHoverburial, #innerHoverbeach, #innerHoverjungle, #innerHovermarshes, #innerHoverpyramid, #innerHoverprimordal, #innerHoverphantasmagoria, #innerHovercavern, #innerHoverwaste, #innerHovermessa, #innerHoverquay, #innerHoverquary, #innerHoveracidlake, #innerHoverarachtomb, #innerHoverbeach, #innerHoverActon, #innerHoverArsenal, #innerHoverBazaar, #innerHoverMaze, #innerHoverPlaza, #innerHoverShipyard, #innerHoverArmoury,#innerHoverAbyss,#innerHoverAcademy, #innerHoverArena, #innerHoverArcade, #innerHoverActon, #innerHoverAshenWood, #innerHoverRamparts, #innerHoverPromenade, #innerHoverPrecinct, #innerHoverOasis, #innerHoverAridlake, #innerHoverDesert, #innerHoverColonnade, #innerHoverOrchard, #innerhoverTemple, #innerHoverMalformation, #innerHoverExcavation, #innerHoverNecropolis, #innerHoverLair, #innerHoverMineralPools, #innerHoverShrine, #innerHoverGorge, #innerHoverVault, #innerHoverUndergroundSea, #innerHoverUndergroundRiver, #innerHoverCoves, #innerHoverIvoryTemple, #innerHoverColosseum, #innerHoverPlateau, #innerHoverResidence, #innerHoverTortureChamber, #innerHoverCatacombs, #innerHoverWaterways, #innerHoverSprings, #innerHoverOvergrownRuin, #innerHoverPalace, #innerHoverDarkForest, #innerHoverHighGarden, #innerHoverTerrace, #innerHoverBarrows, #innerHoverMuseum, #innerHoverCourtyard, #innerHoverWasteland, #innerHoverCrematorium, #innerHoverSulphurWastes, #innerHoverVolcano, #innerHoverCore, #innerHoverCrypt, #innerHoverCemetery, #innerHoverBog, #innerHoverChateau, #innerHoverEstuary, #innerHoverBeacon, #innerHoverHallofGrandmasters, #innerhoverperandusmanor, #innerHoverpit, #innerHoverScriptorium, #innerHovercrystalore, #innerHoverFactory, #innerHoverchanell, #innerHoverracecourse, #innerHovercells, #innerHoverArachnidNest, #innerHoverShore, #innerHoverAtoll, #innerHoverGhetto, #innerHoverGraveyard, #innerHoverTower, #innerHoverSpiderLair, #innerHoverThicket, #innerHoverSpiderForest, #innerHoverMudGeyser, #innerHoverPier, #innerHoverOvergrownShrine, #innerHoverPeninsula, #innerHoverWharf, #innerHoverStrand, #innerHoverCastleRuins, #innerHoverDunes, #innerHoverDungeon, #innerHoverVilla, #innerHoverGroto    ").draggable({ scroll: true });
 
 
});

var allTiers = ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12", "T13", "T14", "T15", "T16"];

function show(className) {
    var y = document.getElementsByClassName(className);
    for (i = 0; i < y.length; i++) {
        y[i].style.display = "block";
    }
}

function hideAllTiers() {
    for(var i = 0; i < allTiers.length; i++) {
        var y = document.getElementsByClassName(allTiers[i]);
        for (j = 0; j < y.length; j++) {
            y[j].style.display = "";
        }
    }
}