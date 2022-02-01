#include 1_00_Rig_Scripts_Lib.jsx

function selectDescendentControls( numIter ) {
    var thisComp = rigLib.getActiveComp();

    // Checking that layers are selected
    if (thisComp.selectedLayers.length == 0) {
        rigLib.print.message("ERROR: No layers selected");
        return 2;
    }

    // Checking that function argument is a number
    if (typeof numIter != "number") {
        return 3;
    }
    
    // Checking that function argument is an integer
    if (numIter % 1 != 0) {
        return 4;
    }
    
    // Selection loop
    for (var i = 0; i < numIter; i++) {
        var topLevelLayers = thisComp.selectedLayers;
        var allLayers = thisComp.layers;

        for (var a = 0; a < topLevelLayers.length; a++) {
            for (var b = 1; b <= allLayers.length; b++) {
                if (thisComp.layer(b).parent == topLevelLayers[a]) {
                    thisComp.layer(b).selected = true;
                }
            }
        }
    }

    var selectionSet = [];
    for (var i = 0; i < thisComp.selectedLayers.length; i++) {
        selectionSet.push(thisComp.selectedLayers[i]);
    }

    for (var i = 0; i < selectionSet.length; i++) {
        var curLayer = selectionSet[i];
        var layerIsNotAControl = curLayer.name.indexOf( rigLib.controlPrefix ) == -1;
        if (layerIsNotAControl) {
        curLayer.selected = false;
        }
    }
    return 0;
}

function selectDescendents( numIter ) {
    var thisComp = rigLib.getActiveComp();

    // Checking that layers are selected
    if (thisComp.selectedLayers.length == 0) {
        rigLib.print.message("ERROR: No layers selected");
        return 2;
    }

    // Checking that function argument is a number
    if (typeof numIter != "number") {
        return 3;
    }
    
    // Checking that function argument is an integer
    if (numIter % 1 != 0) {
        return 4;
    }
    
    // Selection loop
    for (var i = 0; i < numIter; i++) {
        var topLevelLayers = thisComp.selectedLayers;
        var allLayers = thisComp.layers;

        for (var a = 0; a < topLevelLayers.length; a++) {
            for (var b = 1; b <= allLayers.length; b++) {
                if (thisComp.layer(b).parent == topLevelLayers[a]) {
                    thisComp.layer(b).selected = true;
                }
            }
        }
    }

    var selectionSet = [];
    for (var i = 0; i < thisComp.selectedLayers.length; i++) {
        selectionSet.push(thisComp.selectedLayers[i]);
    }
    return 0;
}

function keyIsBeforeStartTime(currentProperty, keyIndex, startTime) {
    return currentProperty.keyTime(keyIndex) < startTime;
}

function keyIsAfterEndTime(currentProperty, keyIndex, endTime) {
    return currentProperty.keyTime(keyIndex) > endTime;
}

function keyIsOutsideWorkArea(currentProperty, keyIndex, startTime, endTime) {
    return keyIsBeforeStartTime(currentProperty, keyIndex, startTime) || keyIsAfterEndTime(currentProperty, keyIndex, endTime);
}

function getStartKeyIndex( thisComp, currentProperty ) {
    var workAreaStart = thisComp.workAreaStart;
    var workAreaEnd = workAreaStart + thisComp.workAreaDuration;
    var startKeyIndex = Math.max( currentProperty.nearestKeyIndex( workAreaStart ) - 1, 1 );
    if ( keyIsOutsideWorkArea( currentProperty, startKeyIndex, workAreaStart, workAreaEnd ) ) { startKeyIndex++; }
    else { return startKeyIndex; }
    if ( startKeyIndex > currentProperty.numKeys ) return null;
    if ( keyIsOutsideWorkArea( currentProperty, startKeyIndex, workAreaStart, workAreaEnd ) ) {
        if ( startKeyIndex < currentProperty.numKeys ) {
            startKeyIndex++; 
            } 
        }
    else { return startKeyIndex; }
    if ( keyIsOutsideWorkArea(currentProperty, startKeyIndex, workAreaStart, workAreaEnd ) ) { return null; }
    else { return startKeyIndex; }
}

function getEndKeyIndex( thisComp, currentProperty ) {
    var workAreaStart = thisComp.workAreaStart;
    var startTime = workAreaStart;
    var endTime = workAreaStart + thisComp.workAreaDuration;
    var endKeyIndex = Math.min(currentProperty.nearestKeyIndex(endTime) + 1, currentProperty.numKeys);
    if (keyIsOutsideWorkArea(currentProperty, endKeyIndex, startTime, endTime)) { endKeyIndex--; }
    else { return endKeyIndex; }
    if ( endKeyIndex == 0 ) return null;
    if (keyIsOutsideWorkArea(currentProperty, endKeyIndex, startTime, endTime)) { 
        if (endKeyIndex > 1) {
        endKeyIndex--;
        }
    }
    else { return endKeyIndex; }
    if (keyIsOutsideWorkArea(currentProperty, endKeyIndex, startTime, endTime)) { return null; }
    else { return endKeyIndex; }
}

function selectKeysInWorkArea( currentProperty ) {
    var thisComp = rigLib.getActiveComp();
    if (currentProperty.numKeys == 0) return 1;
    var startKeyIndex = getStartKeyIndex( thisComp, currentProperty );
    if (startKeyIndex == null) return 2;
    var endKeyIndex = getEndKeyIndex( thisComp, currentProperty );
    if (endKeyIndex == null) return 3;
    var numKeys = endKeyIndex - startKeyIndex;
    
    for (var i = 0; i <= numKeys; i++) {
        var curIndex = i + startKeyIndex;
        currentProperty.setSelectedAtKey( curIndex, true );
    }
    return 0;
}

function GUI() {    
    var window = new Window("palette", "Selection UI", undefined);
    window.orientation = "column";

    var controlPanel = window.add( "panel", undefined, "Control Selection" );
    
    var groupOne = controlPanel.add( "group", undefined, "groupOne" );
    groupOne.orientation = "row";
    var selectParentControlButton = groupOne.add( "button", undefined, "Parent" );
    
    selectParentControlButton.onClick = function() {
        var selectParentControlStackNotInitialised = typeof selectParentControlStack === "undefined";
        if ( selectParentControlStackNotInitialised ) selectParentControlStack = [];
        #include 1_01_Select_Parent_Control.jsx
    }
    
    var groupTwo = controlPanel.add( "group", undefined, "groupTwo" );
    groupTwo.orientation = "row";
    var selectChildControlButton = groupTwo.add( "button", undefined, "Child" );
    
    selectChildControlButton.onClick = function() {
        #include 1_02_Select_Child_Control.jsx
    }

    var groupThree = controlPanel.add( "group", undefined, "groupThree" );
    groupThree.orientation = "row";
    var selectDescendentControlsButton = groupThree.add( "button", undefined, "Descendents" );
    
    selectDescendentControlsButton.onClick = function() {
        rigLib.run( selectDescendentControls, 4 );
    }
    
    var layerPanel = window.add( "panel", undefined, "Layer Selection" );

    var group_35 = layerPanel.add( "group", undefined, "groupThree" );
    group_35.orientation = "row";
    var selectDescendentsButton = group_35.add( "button", undefined, "All descendents" );
    
    selectDescendentsButton.onClick = function() {
        rigLib.run( selectDescendents, 7 );
    }

    var keyPanel = window.add( "panel", undefined, "Key Selection" );

    var groupFour = keyPanel.add( "group", undefined, "groupFour" );
    groupFour.orientation = "row";
    var selectControlKeysAtCurrentTimeButton = groupFour.add( "button", undefined, "At Time" );
    
    selectControlKeysAtCurrentTimeButton.onClick = function() {
        #include 1_03_Select_Keys_At_Current_Time.jsx
    }

    var groupFive = keyPanel.add( "group", undefined, "groupFive" );
    groupFive.orientation = "row";
    var selectKeysInWorkAreaButton = groupFive.add( "button", undefined, "Work Area" );
    
    selectKeysInWorkAreaButton.onClick = function() {
        rigLib.batchRunPropOp( selectKeysInWorkArea );
    }

    window.center();
    window.show();
}

GUI();