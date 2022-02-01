﻿﻿//~ This file is part of Ae Rig Anim.
//~ Ae Rig Anim is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3 as published by the Free Software Foundation.
//~ Ae Rig Anim is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License version 3 for more details.
//~ You should have received a copy of the GNU General Public License version 3 along with Ae Rig Anim. If not, see <https://www.gnu.org/licenses/>.
//~ Copyright Nicholas Waterton and Arcus Animation Studios

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
