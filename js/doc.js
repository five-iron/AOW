(function () {'use strict';}());

/**
* This file contains functions related to intercepting document mouse events
*/

const SCALE_CONSTANT = 1.5; // Scale with respect to window width
let _startX = 0;
let _startY = 0;
let _dragObjects;

function OnMouseDown(event) {
    _startX = event.clientX;
    _startY = event.clientY;
    if(isCursorOverMap(_startX, _startY)) {
        // Don't drag background, only drag popup (handled by jquery ui)
        return true;
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
    
    // Disable popups while dragging map
    let invisibleMapPopups = $('.popupdiv:hidden');
    invisibleMapPopups.each(function(i, el) {
        el.style.display = 'none';
    });
}

function OnMouseMove(event) {
    _dragObjects.forEach(function(obj) {
        obj.element.style.left = (obj.offsetLeft + event.clientX - _startX) + 'px';
        obj.element.style.top = (obj.offsetTop + event.clientY - _startY) + 'px';
    });
}

function OnMouseUp(event) {
    // Set all *invisible* elements' offsets while dragging. The idea is, update visible elements dynamically, update invisible ones once upon mouseup
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
    // TODO: Zoom in/out?
    // TODO: If over map, "scroll" the map (drag it up/down)? ... if height + offset top > window height (i.e. very long map popups)
    return false;
}

// True iff cursor position collides with any map node or visible popup
function isCursorOverMap(xPos, yPos) {
    let visibleMapPopups = $('.popupdiv:visible');
    for(let el of visibleMapPopups) {
        let rect = el.getBoundingClientRect();
        if(xPos >= rect.left && xPos <= rect.right && yPos >= rect.top && yPos <= rect.bottom) {
            return true;
        }
    }
    // Else, check all map nodes (non-popups)
    for(let map of maps) {
        let mapNode = $('#' + map.id);
        let rect = $('#' + map.id)[0].getBoundingClientRect();
        if(xPos >= rect.left && xPos <= rect.right && yPos >= rect.top && yPos <= rect.bottom) {
            return true;
        }
    }
    return false;
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