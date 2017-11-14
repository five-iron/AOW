(function () {'use strict';}());

/**
* This file contains functions related to intercepting document mouse events
*/

const SCALE_CONSTANT = 1.5; // Scale with respect to window width
const ZOOM_FACTOR = 1.1; // Amount to multiply/divide per mouse wheel scroll
let _startX = 0;
let _startY = 0;
let currentZoom = 1;
let _dragObjects = [];
function OnMouseDown(event) {
    _startX = event.clientX;
    _startY = event.clientY;
    _dragObjects = [];
    
    // Disable popups while dragging map
    let invisibleMapPopups = $('.popupdiv:hidden');
    invisibleMapPopups.each(function(i, el) {
        el.style.display = 'none';
    });
    
    if(isCursorOverMap(_startX, _startY)) {
        // Don't drag background, only drag popup (handled by css & main.js)
        return true;
    }

    if(!isCursorOverAtlas(_startX, _startY)) {
        // Mouse outside of atlas, do nothing
        return false;
    }

    // Else, we're dragging the map
    document.onmousemove = OnMouseMove;
    // Track the map
    let mapEl = document.getElementById('mapDiv');
    _dragObjects.push({
        element: mapEl,
        offsetLeft: mapEl.offsetLeft,
        offsetTop: mapEl.offsetTop
    });

    // Get visible popups' parents (which contain offset info)
    let visibleMaps = $('.popupdiv:visible').parent();
    for(let el of visibleMaps) {
        _dragObjects.push({
            element: el,
            offsetLeft: el.offsetLeft,
            offsetTop: el.offsetTop
        });
    }
}

function OnMouseMove(event) {
    _dragObjects.forEach(function(obj) {
        obj.element.style.left = (obj.offsetLeft + event.clientX - _startX) + 'px';
        obj.element.style.top = (obj.offsetTop + event.clientY - _startY) + 'px';
    });
}

function OnMouseUp(event) {
    // Set all *invisible* elements' offsets after dragging. The idea is, update visible elements dynamically, update invisible ones once upon mouseup
    resetHiddenMapPositions();
    // Set hidden map style back to '' from 'none'
    $('.popupdiv:hidden').each(function(i, el) {
        el.style.display = '';
    });
    document.onmousemove = null;
    _dragObjects = [];
}

function OnWheel(event) {
    // Calculate new zoom. Currently zoom is uniform accross all applicable elements
    let newZoom;
    if(event.deltaY > 0) { // scroll down to zoom out
        newZoom = (currentZoom / ZOOM_FACTOR);
    } else if(event.deltaY < 0) { // scroll up to zoom in
        newZoom = (currentZoom * ZOOM_FACTOR);
    }
    
    $('#mapDiv,.innerHover').each(function(i, elToZoom) {
        // TODO: See about setting a max/min zoom on elements
        elToZoom.style.transform = 'scale(' + newZoom + ')';
    });
    
    let zoomAmt = newZoom / currentZoom;
    // Translate visible elements and the atlas
    // Select popupdiv parent since the popup knows about visibility but the parent controls offset
    $('.popupdiv:visible').parent().add('#mapDiv').each(function(i, el) {
        // Get our mouse position relative to element offset
        let mouseOffset = {
            left: (event.clientX - el.offsetLeft),
            top: (event.clientY - el.offsetTop)
        };
        // Offset the element so it appears that we're zooming about the cursor position
        el.style.left = (el.offsetLeft + (mouseOffset.left - mouseOffset.left * zoomAmt)) + 'px';
        el.style.top = (el.offsetTop + (mouseOffset.top - mouseOffset.top * zoomAmt)) + 'px';
    });
    currentZoom = newZoom;
    // Put hidden map nodes in their new place
    resetHiddenMapPositions();
    return false;
}

// True iff cursor position collides with any map node or visible popup
function isCursorOverMap(xPos, yPos) {
    let visibleMapPopups = $('.popupdiv:visible');
    for(let el of visibleMapPopups) {
        let rect = el.getBoundingClientRect();
        if(isInsideRect(rect, xPos, yPos)) {
            return true;
        }
    }
    // Else, check all map nodes (non-popups)
    for(let map of maps) {
        let rect = $('#' + map.id)[0].getBoundingClientRect();
        if(isInsideRect(rect, xPos, yPos)) {
            return true;
        }
    }
    return false;
}

// True iff cursor is within entire background img
function isCursorOverAtlas(xPos, yPos) {
    let rect = $('#mapImg')[0].getBoundingClientRect();
    if(isInsideRect(rect, xPos, yPos)) {
        return true;
    }
    return false;
}

function isInsideRect(rect, xPos, yPos) {
    return xPos >= rect.left && xPos <= rect.right && yPos >= rect.top && yPos <= rect.bottom;
}

function initDocEvents() {
    document.onmousedown = OnMouseDown;
    document.onmouseup = OnMouseUp;
    document.onwheel = OnWheel;
}

function initScaling() {
    let mapImg = $("#mapImg");
    let initialMapWidth = mapImg.width();
    
    mapImg.css({
        width: window.innerWidth * SCALE_CONSTANT,
        height: 'auto'
    });
    
    let postScaleMapWidth = mapImg.width();
    
    // Match mapDiv width to mapImg width
    $("#mapDiv").css({
        width: postScaleMapWidth,
        height: 'auto'
    });
    
    let scaleRatio = postScaleMapWidth / initialMapWidth;
    return scaleRatio;
}

// Only set map node offsets after scaling the atlas
let scalePromise = new Promise(function(resolve) {
    $(() => resolve(initScaling()));
});

$(initDocEvents);
