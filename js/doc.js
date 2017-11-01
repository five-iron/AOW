(function () {'use strict';}());

/**
* This file contains functions related to intercepting document mouse events
*/

const SCALE_CONSTANT = 1.5; // Scale with respect to window width
const ZOOM_FACTOR = 1.1; // Amount to multiply/divide per mouse wheel scroll
let _startX = 0;
let _startY = 0;
let currentZoom = 100; // zoom %
let _dragObjects;

function OnMouseDown(event) {
    _startX = event.clientX;
    _startY = event.clientY;
    
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
    _dragObjects = [];
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
    let invisibleMapPopups = $('.popupdiv:hidden');
    let invisisbleMapIds = [];
    for(let el of invisibleMapPopups) {
        invisisbleMapIds.push(el.parentElement.id);
        el.style.display = '';
    }
    
    resetMapPositionsById(invisisbleMapIds);
    document.onmousemove = null;
    _dragObjects = [];
}

function OnWheel(event) {
    // Calculate new zoom. Zoom is uniform accross all applicable elements
    let newZoom;
    // let newOffset;
    if(event.deltaY > 0) { // scroll down to zoom out
        newZoom = (currentZoom / ZOOM_FACTOR);
    } else if(event.deltaY < 0) { // scroll up to zoom in
        newZoom = (currentZoom * ZOOM_FACTOR);
    }
    currentZoom = newZoom;
    // Zoom atlas and all nodes
    $('#mapDiv,.innerHover').each(function(i, elToZoom) {
        if(!elToZoom.style.zoom) {
            elToZoom.style.zoom = '100%';
        }
        // TODO: Figure out offset while zooming, so it zooms into the cursor instead of the top left
        // let currentOffset = {
            // left: elToZoom.style.left.replace(/px/g,''),
            // top: elToZoom.style.top.replace(/px/g,'')
        // }
        // let mapDivOffset = $('#mapDiv').position();
        // let mouseOffset = {
            // left: event.clientX + mapDivOffset.left,
            // top: event.clientY + mapDivOffset.top
        // }
        // newOffset = {
            // left: currentOffset.left - (mouseOffset.left * (newZoom - currentZoom) * .01),
            // top: currentOffset.top - (mouseOffset.right * (newZoom - currentZoom) * .01)
        // }
        elToZoom.style.zoom = newZoom + '%';
        // elToZoom.style.left = newOffset.left + 'px';
        // elToZoom.style.top = newOffset.top + 'px';
    });
    return false;
}

// True iff cursor position collides with any map node or visible popup
function isCursorOverMap(xPos, yPos) {
    let visibleMapPopups = $('.popupdiv:visible');
    for(let el of visibleMapPopups) {
        let rect = el.getBoundingClientRect();
        if(insideZoomedRect(rect, xPos, yPos)) {
            return true;
        }
    }
    // Else, check all map nodes (non-popups)
    for(let map of maps) {
        let rect = $('#' + map.id)[0].getBoundingClientRect();
        if(insideZoomedRect(rect, xPos, yPos)) {
            return true;
        }
    }
    return false;
}

// True iff cursor is within entire background img
function isCursorOverAtlas(xPos, yPos) {
    let rect = $('#mapImg')[0].getBoundingClientRect();
    if(insideZoomedRect(rect, xPos, yPos)) {
        return true;
    }
    return false;
}

// Multiply rect boundries by currentZoom, then check if x,y are inside
function insideZoomedRect(rect, xPos, yPos) {
    let left = rect.left * (currentZoom / 100);
    let right = rect.right * (currentZoom / 100);
    let top = rect.top * (currentZoom / 100);
    let bottom = rect.bottom * (currentZoom / 100);
    return xPos >= left && xPos <= right && yPos >= top && yPos <= bottom;
}


function init() {
    let img = document.getElementById('mapImg');
    document.onmousedown = OnMouseDown;
    document.onmouseup = OnMouseUp;
    document.onwheel = OnWheel;
    
    $("#mapImg").css({
        width: window.innerWidth * SCALE_CONSTANT,
        height: 'auto'
    });
    
    $("#mapDiv").css({
        width: img.width,
        height: 'auto'
    });
}

$(init());