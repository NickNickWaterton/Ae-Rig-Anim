var rigLibNotIncluded = typeof rigLib === "undefined";
if ( rigLibNotIncluded ) {
    #include 1_00_Rig_Scripts_Lib.jsx
}

function addHOLDKeys( prop ) {
    var time = rigLib.getActiveComp().time;
    var keyframeInterpolation = KeyframeInterpolationType.HOLD;
    
    var propHasNoKeys = prop.numKeys == 0;
    if ( propHasNoKeys ) {
        prop.addKey( time );
        prop.setInterpolationTypeAtKey( 1, keyframeInterpolation, keyframeInterpolation );
        return 0;
    }
    else {
        prop.setValueAtTime( time, prop.value );
        function getKeyIndexFromTime( prop, time ) {
            for ( var i = 1; i <= prop.numKeys; i++ ) {
                if ( prop.keyTime(i) == time ) {
                    return i;
                }
            }
            throw "getKeyIndexFromTime: No key found at current time";
        }
        var newKeyIndex = getKeyIndexFromTime( prop, time );
        prop.setInterpolationTypeAtKey( newKeyIndex, keyframeInterpolation, keyframeInterpolation );
        return 0;
    }
}

rigLib.batchRunPropOp( addHOLDKeys );