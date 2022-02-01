var rigLibNotIncluded = typeof rigLib === "undefined";
if ( rigLibNotIncluded ) {
    #include 1_00_Rig_Scripts_Lib.jsx
}

function selectParentControl() {
    var thisComp = rigLib.getActiveComp(); 
    var selectedLayers = thisComp.selectedLayers;
    
    var noLayerIsSelected = selectedLayers.length == 0
    if ( noLayerIsSelected ) {
        selectParentControlStack = [];
        rigLib.print.message("Parent Stack reset");
        return 0;
    }

    var layer = selectedLayers[0];
    
    function getParentControl( layer, controlPrefix ) {
        var layerHasParent = layer.parent != null;
        while ( layerHasParent ) {
            layer = layer.parent;
            var layerIsControl = layer.name.indexOf( controlPrefix ) == 0;
            if ( layerIsControl ) return layer;
        }
        throw "Current layer at top of control chain";
    }
    try {
        var parentControl = getParentControl( layer, rigLib.controlPrefix );
    }
    catch ( err ) {
        rigLib.print.message( "Current layer at top of control chain" );
        return 0;
    }
    
    selectParentControlStack.push( layer );

    function deselectLayer( layer ) {
        layer.selected = false;
    }
    rigLib.forEach( selectedLayers, deselectLayer )

    parentControl.selected = true;
    rigLib.print.message( parentControl.name + " is now selected" );
    
    return 0;
}

// Global variable selectParentControlStack
var selectParentControlStackNotInitialised = typeof selectParentControlStack === "undefined";
if ( selectParentControlStackNotInitialised ) var selectParentControlStack = [];
rigLib.run( selectParentControl );