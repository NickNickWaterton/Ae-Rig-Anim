﻿//~ This file is part of Ae Rig Anim.
//~ Ae Rig Anim is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3 as published by the Free Software Foundation.
//~ Ae Rig Anim is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License version 3 for more details.
//~ You should have received a copy of the GNU General Public License version 3 along with Ae Rig Anim. If not, see <https://www.gnu.org/licenses/>.
//~ Copyright Nicholas Waterton and Arcus Animation Studios

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
