var rigLibNotIncluded = typeof rigLib === "undefined";
if ( rigLibNotIncluded ) {
    #include 1_00_Rig_Scripts_Lib.jsx
}

function selectControlKeysAtCurrentTime( currentProperty ) {
    var comp = rigLib.getActiveComp();
    if ( currentProperty.numKeys == 0 ) { return 1; }
    var nearestKeyIndex = currentProperty.nearestKeyIndex( comp.time );
        if ( currentProperty.keyTime( nearestKeyIndex ) == comp.time ) {
            currentProperty.setSelectedAtKey( nearestKeyIndex, true );
        }
    return 0;
}

rigLib.batchRunPropOp( selectControlKeysAtCurrentTime );