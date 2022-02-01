﻿﻿//~ This file is part of Ae Rig Anim.
//~ Ae Rig Anim is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3 as published by the Free Software Foundation.
//~ Ae Rig Anim is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License version 3 for more details.
//~ You should have received a copy of the GNU General Public License version 3 along with Ae Rig Anim. If not, see <https://www.gnu.org/licenses/>.
//~ Copyright Nicholas Waterton and Arcus Animation Studios

#include 1_00_Rig_Scripts_Lib.jsx

function addTempIKToSelected()
{
    var thisComp = rigLib.getActiveComp();

    var ikChain = thisComp.selectedLayers;
    
    for (var i = 0; i < ikChain.length; i++) {
        rigLib.print.message( ikChain[i].name );
    }

    if (ikChain.length != 3) {
        rigLib.print.message("ERROR: Please select 3 layers");
        return 2;
    }

    var ikEffectorName = ikChain[0].name + " | ikEffector";

var upperIkExpression = 
"upperLimb = thisComp.layer(\"" + ikChain[0].name + "\");\
lowerLimb = thisComp.layer(\"" + ikChain[1].name + "\");\
extremity = thisComp.layer(\"" + ikChain[2].name + "\");\
effector = thisComp.layer(\"" + ikEffectorName + "\");\
enable = effector.effect(\"enable/disable\")(\"Checkbox\");\
cw = effector.effect(\"clockwise/anti-clockwise\")(\"Checkbox\");\
\
function getWorldPos(theLayer){\
  return theLayer.toWorld(theLayer.anchorPoint);\
}\
\
if (enable == true)\
{\
    A = getWorldPos(upperLimb);\
    B = getWorldPos(lowerLimb);\
    C = getWorldPos(extremity);\
    E = effector.toWorld([0,0]);\
    \
    a = length(B,C);\
    b = length(E,A);\
    c = length(A,B);\
    \
    x = (b*b + c*c - a*a )/(2*b);\
    alpha = Math.acos(clamp(x/c,-1,1));\
    \
    D = E - A;\
    delta = Math.atan2(D[1],D[0]);\
    result = radiansToDegrees(delta - (cw * 2 - 1)*alpha);\
    V = B - A;\
    adj1 = radiansToDegrees(Math.atan2(V[1],V[0]));\
    result - adj1 + value;\
}\
else { value }";

var lowerIkExpression = 
"upperLimb = thisComp.layer(\"" + ikChain[0].name + "\");\
lowerLimb = thisComp.layer(\"" + ikChain[1].name + "\");\
extremity = thisComp.layer(\"" + ikChain[2].name + "\");\
effector = thisComp.layer(\"" + ikEffectorName + "\");\
enable = effector.effect(\"enable/disable\")(\"Checkbox\");\
cw = effector.effect(\"clockwise/anti-clockwise\")(\"Checkbox\");\
\
function getWorldPos(theLayer){\
  return theLayer.toWorld(theLayer.anchorPoint);\
}\
\
if (enable == true)\
{\
    A = getWorldPos(upperLimb);\
    B = getWorldPos(lowerLimb);\
    C = getWorldPos(extremity);\
    E = effector.toWorld([0,0]);\
    \
    a = length(B,C);\
    b = length(E,A);\
    c = length(A,B);\
    \
    x = (b*b + c*c - a*a )/(2*b);\
    alpha = Math.acos(clamp(x/c,-1,1));\
    \
    y = b - x;\
    gamma = Math.acos(clamp(y/a,-1,1));\
    result = (cw * 2 - 1)*radiansToDegrees(gamma + alpha);\
    V1 = B - A;\
    adj1 = radiansToDegrees(Math.atan2(V1[1],V1[0]));\
    V2 = C - B;\
    adj2 = radiansToDegrees(Math.atan2(V2[1],V2[0]));\
    result +  adj1 - adj2 + value;\
}\
else { value }";

var extremityIkExpression = 
"upperLimb = thisComp.layer(\"" + ikChain[0].name + "\");\
lowerLimb = thisComp.layer(\"" + ikChain[1].name + "\");\
extremity = thisComp.layer(\"" + ikChain[2].name + "\");\
effector = thisComp.layer(\"" + ikEffectorName + "\");\
enable = effector.effect(\"enable/disable\")(\"Checkbox\");\
cw = effector.effect(\"clockwise/anti-clockwise\")(\"Checkbox\");\
follow = effector.effect(\"extremity follow\")(\"Checkbox\");\
\
if (enable == true)\
{\
    curEffLayer = effector;\
    curEffRot = effector.transform.rotation;\
    \
    while (curEffLayer.hasParent)\
    {\
        curEffLayer = curEffLayer.parent;\
        curEffRot += curEffLayer.transform.rotation;\
    }\
    \
    curUppLayer = thisLayer;\
    curUppRot = 0;\
    \
    while (curUppLayer.hasParent)\
    {\
        curUppLayer = curUppLayer.parent;\
        curUppRot += curUppLayer.transform.rotation;\
    }\
    \
    if (follow == false)\
    {\
        function getWorldPos(theLayer){\
          return theLayer.toWorld(theLayer.anchorPoint);\
        }\
        \
        A = getWorldPos(upperLimb);\
        B = getWorldPos(lowerLimb);\
        C = getWorldPos(extremity);\
        E = effector.toWorld([0,0]);\
        \
        a = length(B,C);\
        b = length(E,A);\
        c = length(A,B);\
        \
        x = (b*b + c*c - a*a )/(2*b);\
        alpha = Math.acos(clamp(x/c,-1,1));\
        \
        D = E - A;\
        delta = Math.atan2(D[1],D[0]);\
        upperResult = radiansToDegrees(delta - (cw * 2 - 1)*alpha);\
        V1 = B - A;\
        adj1 = radiansToDegrees(Math.atan2(V1[1],V1[0]));\
        y = b - x;\
        gamma = Math.acos(clamp(y/a,-1,1));\
        lowerResult = (cw * 2 - 1)*radiansToDegrees(gamma + alpha);\
        V2 = C - B;\
        adj2 = radiansToDegrees(Math.atan2(V2[1],V2[0]));\
        \
        curEffRot - curUppRot - (upperResult + lowerResult - adj2);\
    }\
    else { curEffRot }\
}\
else\
{ value }";

var ikEffectorPosition = 
"extremity = thisComp.layer(\"" + ikChain[2].name + "\");\
extremity.toWorld(extremity.anchorPoint);";

var ikEffectorRotation = 
"extremity = thisComp.layer(\"" + ikChain[2].name + "\");\
curLayer = extremity;\
curRot = extremity.transform.rotation;\
while (curLayer.hasParent)\
{\
    curLayer = curLayer.parent;\
    curRot += curLayer.transform.rotation;\
}";
    
    ikEffector = thisComp.layers.addNull();
    ikEffector.label = 13;
    ikEffector.source.name = ikEffectorName;
    ikEffector.source.width = 200;
    ikEffector.source.height = 200;
    ikEffector.comment = "ikEffector";
    ikEffector.guideLayer = true;
    var enableControl = ikEffector.property("Effects").addProperty("ADBE Checkbox Control")("Checkbox");
    enableControl.propertyGroup(1).name = "enable/disable";
    enableControl.setValue(1);
    var clockwiseControl = ikEffector.property("Effects").addProperty("ADBE Checkbox Control")("Checkbox");
    clockwiseControl.propertyGroup(1).name = "clockwise/anti-clockwise";
    var followControl = ikEffector.property("Effects").addProperty("ADBE Checkbox Control")("Checkbox");
    followControl.propertyGroup(1).name = "extremity follow";
    
    ikEffector.transform.position.expression = ikEffectorPosition;
    ikEffector.transform.position.setValue(ikEffector.transform.position.valueAtTime(thisComp.time, false));
    ikEffector.transform.position.expression = "";

    ikEffector.transform.rotation.expression = ikEffectorRotation;
    ikEffector.transform.rotation.setValue(ikEffector.transform.rotation.valueAtTime(thisComp.time, false));
    ikEffector.transform.rotation.expression = ""; 
    
    function addStrToComment( layer, str ) {
        if ( layer.comment == "" ) layer.comment = str;
        else layer.comment += "," + str;
    }
    
    ikChain[0].transform.rotation.expression = upperIkExpression;
    addStrToComment( ikChain[0], ikEffectorName + " start" );
    ikChain[1].transform.rotation.expression = lowerIkExpression;
    addStrToComment( ikChain[1], ikEffectorName + " mid" );
    ikChain[2].transform.rotation.expression = extremityIkExpression;
    addStrToComment( ikChain[2], ikEffectorName + " end" );
    
    return 0;
}

function bakeSelectedIK() { 
    var comp = rigLib.getActiveComp();
        
    var ikEffector = comp.selectedLayers[0];
        
    if ( ikEffector.comment != "ikEffector" ) throw "IK layer not selected";

    function checkIfInIkChain( layer, ikName ) {
        var isInIKChain = layer.comment.indexOf( ikName ) != -1;
        return isInIKChain;
    }

    var ikLayers = rigLib.filter( rigLib.getAllLayersInComp( comp ), checkIfInIkChain, ikEffector.name );
                
    function bakeLayer( layer, time ) {
        var rotProp = layer.transform.rotation;
        var rotPropValue = rotProp.valueAtTime( time, false );
        
        if ( rotProp.numKeys != 0 ) rotProp.setValueAtTime( time, rotPropValue );
        
        else rotProp.setValue( rotPropValue );
    }

    rigLib.forEach( ikLayers, bakeLayer, comp.time );
            
    return 0;
}

function snapIKToEnd() {
    var comp = rigLib.getActiveComp();

    var ikEffector = comp.selectedLayers[0];
        
    if ( ikEffector.comment != "ikEffector" ) throw "IK layer not selected";

    function findIkEnd( comp, ikName ) {
        for ( var i = 1; i <= comp.layers.length; i++ ) {
            var layer = comp.layers[i];
            if ( layer.comment.indexOf( ikName + " end" ) != -1 ) {
                var ikEnd = layer;
                return ikEnd;
            }
        }
        throw "No ikEnd found";
    }

    var ikEnd = findIkEnd( comp, ikEffector.name ).name;
    
        var posExp = 
"var layer = thisComp.layer( \"" + ikEnd + "\" );\
if ( thisLayer.hasParent ) parent.fromWorld(layer.toWorld( layer.anchorPoint ) );\
else layer.toWorld( layer.anchorPoint );";

    var rotExp = 
"var srcLayer = thisComp.layer( \"" + ikEnd + "\" );\
var srcRotAccum = srcLayer.rotation;\
while( srcLayer.hasParent ) {\
    srcLayer = srcLayer.parent;\
    srcRotAccum += srcLayer.rotation;\
}\
\
trgLayer = thisLayer;\
var trgRotAccum = 0;\
while( trgLayer.hasParent ) {\
	trgLayer = trgLayer.parent;\
	trgRotAccum += trgLayer.rotation;\
}\
srcRotAccum - trgRotAccum;";

    var time = comp.time;

    var posProp = ikEffector.transform.position;
    posProp.expression = posExp;
    posPropValue = posProp.valueAtTime( time, false );
    posProp.setValueAtTime( time, posPropValue );
    posProp.expression = "";
    
    var rotProp = ikEffector.transform.rotation;
    rotProp.expression = rotExp;
    rotPropValue = rotProp.valueAtTime( time, false );
    rotProp.setValueAtTime( time, rotPropValue );
    rotProp.expression = "";
    return 0;
}

function removeTempIKFromSelected() { 
    var comp = rigLib.getActiveComp();

    var ikEffector = comp.selectedLayers[0];
        
    if ( ikEffector.comment != "ikEffector" ) throw "IK layer not selected";
    
    function checkIfInIkChain( layer, ikName ) {
        var isInIKChain = layer.comment.indexOf( ikName ) != -1;
        return isInIKChain;
    }

    var ikLayers = rigLib.filter( rigLib.getAllLayersInComp( comp ), checkIfInIkChain, ikEffector.name );
    
    function getIndex( collection, func ) {
        for ( var i = 0; i < collection.length; i++ ) {
            var item = collection[i];
            if ( func( item ) ) return i; 
        }
        return false;
    };
    
    function removeStrFromComment( layer, str ) {
        var commentArr = layer.comment.split( "," );
        var index = getIndex( commentArr, function( item ) { if ( item.indexOf( str ) != -1 ) return true; else return false; } );
        commentArr.splice( index, 1 );
        layer.comment = commentArr.join( "," );
    }
    
    function removeTempIKFromLayer( layer, args ) {
        var rotProp = layer.transform.rotation;
        var rotPropValue = rotProp.valueAtTime( args.time, false );
        
        if (rotProp.numKeys != 0) rotProp.setValueAtTime( args.time, rotPropValue );
        
        else rotProp.setValue(rotPropValue);

        rotProp.expression = "";
        removeStrFromComment( layer, args.str );
    }

    rigLib.forEach( ikLayers, removeTempIKFromLayer, { time : comp.time, str : ikEffector.name } );
    
    ikEffector.remove();
        
    return 0;
}

function GUI() {
    var window = new Window("palette", "Temp IK UI", undefined);
    window.orientation = "column";
    var groupOne = window.add( "group", undefined, "groupOne" );
    groupOne.orientation = "row";
    var addIKButton = groupOne.add( "button", undefined, "Add" );
    
    addIKButton.onClick = function() {
        rigLib.run( addTempIKToSelected );
    }
    
    var groupTwo = window.add( "group", undefined, "groupTwo" );
    groupTwo.orientation = "row";
    var bakeIKButton = groupTwo.add( "button", undefined, "Bake" );
    
    bakeIKButton.onClick = function() {
        rigLib.run( bakeSelectedIK );
    }

    var groupThree = window.add( "group", undefined, "groupThree" );
    groupThree.orientation = "row";
    var snapIKToEndButton = groupThree.add( "button", undefined, "Snap To End" );
    
    snapIKToEndButton.onClick = function() {
        rigLib.run( snapIKToEnd );
    }

    var groupFour = window.add( "group", undefined, "groupFour" );
    groupFour.orientation = "row";
    var removeIKButton = groupFour.add( "button", undefined, "Remove" );
    
    removeIKButton.onClick = function() {
        rigLib.run( removeTempIKFromSelected );
    }

    window.center();
    window.show();
}

GUI();
