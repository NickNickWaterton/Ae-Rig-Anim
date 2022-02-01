﻿﻿//~ This file is part of Ae Rig Anim.
//~ Ae Rig Anim is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3 as published by the Free Software Foundation.
//~ Ae Rig Anim is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License version 3 for more details.
//~ You should have received a copy of the GNU General Public License version 3 along with Ae Rig Anim. If not, see <https://www.gnu.org/licenses/>.
//~ Copyright Nicholas Waterton and Arcus Animation Studios

#include 1_00_Rig_Scripts_Lib.jsx

function createControlLayers() {    
    
    function createControlLayer( layer, args ) {
        var controlLayer = args.comp.layers.addNull();
        controlLayer.source.name = args.controlPrefix + layer.name;
        controlLayer.moveBefore( layer );
        controlLayer.source.width = layer.source.width;
        controlLayer.source.height = layer.source.height;
        controlLayer.parent = layer.parent;
        {
            var curTime = args.comp.time;
            controlLayer.transform.anchorPoint.setValue( layer.transform.anchorPoint.valueAtTime( curTime, false ) );
            controlLayer.transform.position.setValue( layer.transform.position.valueAtTime( curTime, false ) );
            controlLayer.transform.rotation.setValue( layer.transform.rotation.valueAtTime( curTime, false ) );
            controlLayer.transform.scale.setValue( layer.transform.scale.valueAtTime( curTime, false ) );
        }
        controlLayer.guideLayer = true;
    }

    var comp = rigLib.getActiveComp();
    var layers = rigLib.getLayersFromComp( comp );
    rigLib.forEach( layers, createControlLayer, { comp : comp, controlPrefix : rigLib.controlPrefix  } );
}

function convertToControlLayers() {
    var comp = rigLib.getActiveComp();
    var layers = rigLib.getLayersFromComp( comp );
    
    function convertToControlLayer( layer ) {
        layer.name = rigLib.controlPrefix + layer.name;
        layer.label = 1;
    }

    rigLib.forEach( layers, convertToControlLayer );
}

function bakeControlLayersScale() {
    
    function bakeScale( controlLayer ) {
        var layerIsNotNullLayer = controlLayer.nullLayer == false;
        if ( layerIsNotNullLayer ) return 1;
        var scale = controlLayer.transform.scale;
        var scaleIsDefault = scale.value[0] == 100 && scale.value[1] == 100 && scale.value[2] == 100;
        if ( scaleIsDefault ) return 2;
        var widthOrig = controlLayer.source.width;
        var heightOrig = controlLayer.source.height;
        controlLayer.source.width = Math.ceil( widthOrig * scale.value[0] / 100 );
        controlLayer.source.height = Math.ceil( heightOrig * scale.value[1] / 100 );
        scale.setValue( [100, 100] );
        }

    var controlLayers =  rigLib.getControlLayers();
    rigLib.forEach( controlLayers, bakeScale );
}

function createGroupLayers() {    
    
    function createGroupLayer( controlLayer, comp ) {
        var groupLayer = comp.layers.addNull();
        groupLayer.source.width = controlLayer.source.width;
        groupLayer.source.height = controlLayer.source.height;
        groupLayer.parent = controlLayer.parent;
        
        groupLayer.transform.anchorPoint.setValue( controlLayer.transform.anchorPoint.value );
        groupLayer.transform.position.setValue( controlLayer.transform.position.value );
        groupLayer.transform.rotation.setValue( controlLayer.transform.rotation.value );
        groupLayer.transform.scale.setValue( controlLayer.transform.scale.value );
        
        groupLayer.moveBefore( controlLayer );
        groupLayer.label = 2;
        groupLayer.source.name = controlLayer.name + " group";
        controlLayer.parent = groupLayer;
        groupLayer.guideLayer = true;

    }

    var comp = rigLib.getActiveComp();
    var controlLayers = rigLib.getControlLayers();
    rigLib.forEach( controlLayers, createGroupLayer, comp );
}

function createZeroes()
{
    var controlLayers = rigLib.getControlLayers();

    function createOrigZero() {
        var thisComp = rigLib.getActiveComp();
        var origZero = thisComp.layers.addNull();
        origZero.source.name = rigLib.zeroPrefix;
        origZero.source.width = 25;
        origZero.source.height = 25;
        origZero.label = 0;
        origZero.guideLayer = true;
        return origZero;
    }
    var origZero = createOrigZero();
    
    function parentControlToZero( controlLayer, origZero ) {
            var zero = origZero.duplicate();
            zero.name = rigLib.zeroPrefix + controlLayer.name;
            zero.parent = controlLayer;
            zero.transform.position.setValue( controlLayer.transform.anchorPoint.value );
            zero.transform.rotation.setValue(0);
            zero.transform.scale.setValue( [100,100] );
            zero.parent = controlLayer.parent;
            zero.shy = true;
            controlLayer.parent = zero;
            zero.moveBefore( controlLayer );
    }

    rigLib.forEach( controlLayers, parentControlToZero, origZero );

    origZero.remove();
}

function parentArtToControls() {    
    var comp = rigLib.getActiveComp();
    var layers = rigLib.getLayersFromComp( comp );
    
    function filterCheckIsArtLayer ( layer, args) {
        var layerIsControl = layer.name.indexOf( args.controlPrefix ) == 0;
        if ( layerIsControl ) return false;
        var layerIsZero = layer.name.indexOf( args.zeroPrefix ) == 0;
        if ( layerIsZero ) return false;
        return true;
    }
    var artLayers = rigLib.filter( layers, filterCheckIsArtLayer, { controlPrefix : rigLib.controlPrefix, zeroPrefix : rigLib.zeroPrefix  } );
    
    function findControlFromArt( layer, args ) {
        var controlName = args.controlPrefix + layer.name;
        var controlLayer = args.comp.layer( controlName );
        return controlLayer;
    }

    function parentArtToControl( artLayer, args ) {
        var controlLayer = findControlFromArt( artLayer, args );
        if ( controlLayer != null ) artLayer.parent = controlLayer;
    }

    rigLib.forEach( artLayers, parentArtToControl, { controlPrefix : rigLib.controlPrefix, comp : comp }  );
}

function moveControlLayersAnchorPoint() {
    
    function moveControlLayerAnchorPoint( controlLayer ) {
        function getZero( controlLayer, prefix ) {
            var zero = controlLayer.parent;
            if ( zero == null ) throw "Control layer parent is null";
            if ( zero.name.indexOf( prefix ) != 0 ) throw "Control layer parent is not zero";
            return zero;
        }
        var zero = getZero( controlLayer, rigLib.zeroPrefix );

        var zeroParent = zero.parent;
            
        controlLayer.parent = zeroParent;
        controlLayerPos = controlLayer.property("Transform").property("Position").value;
        controlLayerRot = controlLayer.property("Transform").property("Rotation").value;
        zero.property("Transform").property("Position").setValue( controlLayerPos );
        zero.property("Transform").property("Rotation").setValue( controlLayerRot );
        controlLayer.parent = zero;
    }

    var controlLayers = rigLib.getControlLayers();
    rigLib.forEach( controlLayers, moveControlLayerAnchorPoint );
}

function addGUI_Triangle() {
    var workingComp = app.project.activeItem;
    if ( workingComp instanceof CompItem == false ) return 1;
    
    var layerIsSelected = workingComp.selectedLayers.length == 1;
    if ( !layerIsSelected ) return 1;
    var layer = workingComp.selectedLayers[0];
    var GUI_controlName = "C | GUI " + layer.name;

    var GUI_comp = app.project.items.addComp( GUI_controlName, 100, 200, 1, 1 / 25, 25 );
    var GUI_tri = GUI_comp.layers.addShape();
    var stretchGroup = GUI_tri.property( "Contents" ).addProperty( "ADBE Vector Group" );
    stretchGroup.property( "Transform" ).property( "Scale" ).setValue( [100, 275] );
    var triPath = stretchGroup.property( "Contents" ).addProperty( "ADBE Vector Shape - Star" );
    triPath.property( "Type" ).setValue( 2 );
    triPath.property( "Points" ).setValue( 3 );
    triPath.property( "Outer Radius" ).setValue( 45 );
    triPath.property( "Position" ).setValue( [0, 10] );
    var triStroke = GUI_tri.property( "Contents" ).addProperty( "ADBE Vector Graphic - Stroke" );
    triStroke.property( "Stroke Width" ).setValue( 10 );
    triStroke.property( "Color" ).setValue( [1,1,1,1] );

    var GUI_layer = workingComp.layers.add( GUI_comp );
    GUI_layer.property( "Transform" ).property( "Anchor Point" ).setValue( [50, 190] );
    GUI_layer.timeRemapEnabled = true;
    GUI_layer.guideLayer = true;
    GUI_layer.label = 4;
    GUI_layer.property( "Time Remap" ).removeKey(2);
    GUI_layer.outPoint = workingComp.duration;
}


function GUI() {
    var window = new Window("palette", "Rigging UI", undefined);
    window.orientation = "column";
    
    function addButtonToWindow( window, buttonName, func, helpTip ) {
        var group = window.add( "group", undefined, "group" );
        group.orientation = "row";
        var button = group.add( "button", undefined, buttonName );
        if ( typeof helpTip !== "undefined" ) button.helpTip = helpTip;
        button.onClick = func;
    }

    addButtonToWindow( window, "Make Controls", function() { rigLib.run( createControlLayers ) }, "hello" );
    
    addButtonToWindow( window, "Convert To Control", function() { rigLib.run( convertToControlLayers ) }, "bleurgh" );
    
    addButtonToWindow( window, "Bake Scale", function() { rigLib.run( bakeControlLayersScale ) }, "hello" );
    
    addButtonToWindow( window, "Make Groups", function() { rigLib.run( createGroupLayers ) }, "goodbye" );
    
    addButtonToWindow( window, "Make Zeroes", function() { rigLib.run( createZeroes ) }, "BOO!" );
    
    addButtonToWindow( window, "Parent Art To Controls", function() { rigLib.run( parentArtToControls ) }, "something" );
    
    addButtonToWindow( window, "Set Anchor Point", function() { rigLib.run( moveControlLayersAnchorPoint ) }, "blah!" );
    
    addButtonToWindow( window, "Add GUI Triangle", function() { rigLib.run( addGUI_Triangle ) }, "blah!" );
    
    window.center();
    window.show();
}

GUI();
