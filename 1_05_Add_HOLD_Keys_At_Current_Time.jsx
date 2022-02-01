﻿﻿//~ This file is part of Ae Rig Anim.
//~ Ae Rig Anim is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3 as published by the Free Software Foundation.
//~ Ae Rig Anim is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License version 3 for more details.
//~ You should have received a copy of the GNU General Public License version 3 along with Ae Rig Anim. If not, see <https://www.gnu.org/licenses/>.
//~ Copyright Nicholas Waterton and Arcus Animation Studios

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
