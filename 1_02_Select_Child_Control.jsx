var rigLibNotIncluded = typeof rigLib === "undefined";
if ( rigLibNotIncluded ) {
    #include 1_00_Rig_Scripts_Lib.jsx
}

function selectChildControl() {
    var thisComp = rigLib.getActiveComp();

    if ( rigLib.isUndefined( selectParentControlStack ) ) return 0;
        
    function deselectLayer( layer ) {
        layer.selected = false;
    }
    var selectedLayers = thisComp.selectedLayers;
    rigLib.forEach( selectedLayers, deselectLayer )
    
    var selectionStackTooShort = selectParentControlStack.length <= 1;
    if ( selectionStackTooShort ) {
        rigLib.print.message( "Bottom of stack" )
        return 0;
    }
    
    var stackTop = selectParentControlStack.length - 1;
    selectParentControlStack[ stackTop ].selected = true;
    rigLib.print.message( selectParentControlStack[ stackTop ].name + " is now selected" );
    selectParentControlStack.pop();

    return 0;
}

rigLib.run( selectChildControl );