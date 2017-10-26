(function () {'use strict';}());

let maps = []; // Placeholder to be loaded in later

let allTiers = ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12", "T13", "T14", "T15", "T16"];

function makeElementsDraggable() {
    let idSelectors = [];
    maps.forEach((map) => idSelectors.push('#' + map.id));
    $(idSelectors.join(',')).draggable({ scroll: true });
}

function resetAllPositions() {
    maps.forEach(function(map) {
        let y = document.getElementById(map.id);
        y.style.top = map.top;
        y.style.left = map.left;
    });
}

function renderMaps() {
    let source = $('#map-template').html();
    let template = Handlebars.compile(source);
    let html = template({maps: maps});
    $(html).appendTo("#mapsPlaceholder");
}

function initMaps(data) {
    maps = data;
    renderMaps();
    makeElementsDraggable();
    resetAllPositions();
}

function show(className) {
    let y = document.getElementsByClassName(className);
    [...y].forEach((el) => el.style.display = "block");
}

function hideAll() {
    allTiers.forEach(function(tier) {
        let y = document.getElementsByClassName(tier);
        [...y].forEach((el) => el.style.display = "");
    });
    // Reset positions for good measure
    resetAllPositions();
}

// Load maps from json and initialize
$.getJSON("js/data/maps.json", (data) => initMaps(data));
