(function () {'use strict';}());

// Placeholders to be loaded in later
let maps = [];
let tierBtns = [];
let cardBtns = [];
let shapingMaps = [];

let allTiers = ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12", "T13", "T14", "T15", "T16"];

function renderTemplate(tplId, dataObj, placeholderId) {
    let source = $(tplId).html();
    let template = Handlebars.compile(source);
    let html = template(dataObj);
    $(html).appendTo(placeholderId);
}

function makeElementsDraggable() {
    let idSelectors = [];
    maps.forEach((map) => idSelectors.push('#' + map.id));
    $(idSelectors.join(',')).draggable({ scroll: true });
}

function scaleMapOffsets(scaleRatio) {
    maps.forEach(function(map) {
        map.top = map.top * scaleRatio;
        map.left = map.left * scaleRatio;
    });
    resetAllPositions();
}

function resetAllPositions() {
    resetMapPositionsByMap(maps);
}

function bindOnClickToElements() {
    maps.forEach(function(map) {
        let y = document.getElementById(map.id + 'popup');
        y.addEventListener('click', showMap);
    });
}

// Lazy dev way of ensuring button highlighting matches current visible maps
function createStyleObservers() {
    let observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === "style" && mutation.oldValue !== 'display: none;' && mutation.target.style.display !== 'none') {
                console.debug("Style attribute changed to:", mutation.target.style.display);
                updateButtonHighlighting();
            }
        });
    });
    // Watch all popups for style change
    $('[id$=popup]').each(function(i, el) {
        observer.observe(el, {
            attributeOldValue: true
        });
    });
}

function initShapingTableDisplay() {
    if(docCookies.getItem('shapingTableShown') === 'true') {
        $('.shapingmaps')[0].style.display = 'block';
    } else {
        $('.shapingmaps')[0].style.display = '';
    }
}

function initMaps(data) {
    maps = data;
    renderTemplate('#map-template', {maps: maps}, '#mapsPlaceholder');
    makeElementsDraggable();
    scalePromise.then(scaleMapOffsets);
    bindOnClickToElements();
    createStyleObservers();
    // Initialize mapDiv style
    $('#mapDiv').css({top: '0px', left: '0px'});
}

function initTierBtns(data) {
    tierBtns = data;
    renderTemplate('#tierBtns-template', {tierBtns: tierBtns}, '#tierBtnsPlaceholder');
}

function initCardBtns(data) {
    cardBtns = data;
    renderTemplate('#cardBtns-template', {cardBtns: cardBtns}, '#cardBtnsPlaceholder');
}

function initShapingMaps(data) {
    shapingMaps = data;
    renderTemplate('#shapingMaps-template', {shapingMaps: shapingMaps}, '#shapingMapsPlaceholder');
    $(initShapingTableDisplay);
}

function setDisplayByGivenClassNames(classNames, displayVal) {
    let els = document.querySelectorAll(classNames.map((name) => '.' + name));
    // Build array from getElementsByClassName array-like object
    [...els].forEach((el) => el.style.display = displayVal);
}

function resetMapPositionsByMap(maps) {
    maps.forEach(function(map) {
        let mapDivOffset = $('#mapDiv').position();
        let y = document.getElementById(map.id);
        y.style.top = map.top * currentZoom + mapDivOffset.top + 'px';
        y.style.left = map.left * currentZoom + mapDivOffset.left + 'px';
    });
}

function resetMapPositionsById(ids) {
    resetMapPositionsByMap(getMapsWithIds(ids));
}

function resetHiddenMapPositions() {
    let invisibleMapPopups = $('.popupdiv:hidden');
    let invisisbleMapIds = [];
    for(let el of invisibleMapPopups) {
        invisisbleMapIds.push(el.parentElement.id);
    }
    
    resetMapPositionsById(invisisbleMapIds);
}

function showMap(event) {
    if(event.currentTarget && event.currentTarget.id) {
        $('#' + event.currentTarget.id).css({display: 'block'});
    }
}

function toggleShapingTable() {
    let shown = toggleClass('shapingmaps');
    docCookies.setItem('shapingTableShown', shown);
}

function toggleClass(className) {
    let displayValues = $('.' + className).map((i,el)=>el.style.display);
    // If any invisible, show all
    if([...displayValues].includes('')) {
        showClass(className);
        return true;
    } else {
        hideClass(className);
        return false;
    }
}

function highlightParentClass(className) {
    $('.' + className).parent().addClass('highlighted');
}

function unhighlightParentClass(className) {
    $('.' + className).parent().removeClass('highlighted');
}

function updateButtonHighlighting() {
    let tiers = tierBtns.map((btn)=>btn.tierClass);
    let cards = cardBtns.map((btn)=>btn.cardClass);
    let classes = tiers.concat(cards);
    classes.forEach(function(className) {
        let displayValues = $('.' + className).map((i,el)=>el.style.display);
        // if any buttons' associated classes' elements are hidden, unhighlight
        if([...displayValues].includes('')) {
            $('#' + className + 'btn').removeClass('highlighted');
        } else {
            $('#' + className + 'btn').addClass('highlighted');
        }
    });
}

function hideClass(className) {
    setDisplayByGivenClassNames([className], '');
    let ids = $('.' + className).parent().map((i,v)=>v.id).get();
    resetMapPositionsById(ids);
}

function showClass(className) {
    setDisplayByGivenClassNames([className], 'block');
}

function hideAll() {
    setDisplayByGivenClassNames(allTiers, '');
    resetAllPositions();
}

function getMapsWithIds(ids) {
    return maps.filter((map) => ids.includes(map.id));
}

$(function() {
    $.getJSON("js/data/maps.json", (data) => initMaps(data));
    $.getJSON("js/data/tierBtns.json", (data) => initTierBtns(data));
    $.getJSON("js/data/cardBtns.json", (data) => initCardBtns(data));
    $.getJSON("js/data/shapingMaps.json", (data) => initShapingMaps(data));
});