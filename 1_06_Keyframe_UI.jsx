#include 1_00_Rig_Scripts_Lib.jsx

function keyPropsAtTime(thisComp, property)
{    
    var index = property.nearestKeyIndex(thisComp.time);
    
    if (property.keyTime(index) != thisComp.time)
    {
        rigLib.print.message(property.propertyGroup(2).name + property.propertyGroup(1).name + property.name);
        return null;
    }
        
    var time, value, inType, outType, ab, cb, ie, oe, sab, scb, ist, ost, rov;
    
    time = property.keyTime(index);
    value = property.keyValue(index);
    inType = property.keyInInterpolationType(index);
    outType = property.keyOutInterpolationType(index);

    if (inType = KeyframeInterpolationType.BEZIER && outType == KeyframeInterpolationType.BEZIER)
    {
        ab = property.keyTemporalAutoBezier(index);
        cb = property.keyTemporalContinuous(index);
    }

    if (inType != KeyframeInterpolationType.HOLD || outType != KeyframeInterpolationType.HOLD)
    {
        ie = property.keyInTemporalEase(index);
        oe = property.keyOutTemporalEase(index);
    }

    if (property.propertyValueType == PropertyValueType.TwoD_SPATIAL || property.propertyValueType == PropertyValueType.ThreeD_SPATIAL)
    {
        sab = property.keySpatialAutoBezier(index);
        scb = property.keySpatialContinuous(index);
        ist = property.keyInSpatialTangent(index);
        ost = property.keyOutSpatialTangent(index);
        rov = property.keyRoving(index);
    }
    
    var obj = {'property':property, 'index':index, 'time':time, 'value':value, 'inType':inType, 'outType':outType, 'ab':ab, 'cb':cb, 'ie':ie, 'oe':oe, 'sab':sab, 'scb':scb, 'ist':ist, 'ost':ost, 'rov':rov};
    return obj;
}

function copyKeysAtCurrentTime( currentProperty ) {
    var thisComp = rigLib.getActiveComp();
    if (currentProperty.numKeys != 0)
    {
        keyframeCopyArray.push(keyPropsAtTime(thisComp, currentProperty));
    }
}

function pasteKeys(obj) {
    var thisComp = rigLib.getActiveComp();
    obj.property.addKey(thisComp.time);
    var newKeyIndex = obj.property.nearestKeyIndex(thisComp.time);
    
    var inType = obj.inType;
    
    if (typeof obj.inType != "number") {
        inType = obj.property.keyInInterpolationType(newKeyIndex);
    }
    
    obj.property.setInterpolationTypeAtKey(newKeyIndex, inType, obj.outType);
    obj.property.setTemporalEaseAtKey(newKeyIndex, obj.ie, obj.oe);
    obj.property.setValueAtKey(newKeyIndex, obj.value);
    
    if (obj.ab == true) {
        obj.property.setTemporalAutoBezierAtKey(newKeyIndex, true);
    }
    if (obj.cb == true) {
        obj.property.setTemporalContinuousAtKey(newKeyIndex, true);
    }
    if (obj.rov == true) {
        obj.property.setRovingAtKey(newKeyIndex, true);
    }
    
    if (obj.property.propertyValueType == PropertyValueType.TwoD_SPATIAL || 
    obj.property.propertyValueType == PropertyValueType.ThreeD_SPATIAL) {
        if (obj.sab == true) {
            obj.property.setSpatialAutoBezierAtKey(newKeyIndex, true);
        }
        if (obj.scb == true) {
            obj.property.setSpatialContinuousAtKey(newKeyIndex, true)
        }
        obj.property.setSpatialTangentsAtKey(newKeyIndex, obj.ist, obj.ost);
    }
    return 0;
}

function pasteKeysAtCurrentTime( keyframeCopyArray ) {
    if (keyframeCopyArray.length == 0) {
        rigLib.print.message("WARNING: No keyframes to paste");
        return 1;
    }

    for (var i = 0; i < keyframeCopyArray.length; i++) {
        try {
            var obj = keyframeCopyArray[i];
            pasteKeys(obj);
        }
        catch (err) {
            rigLib.print.message("WARNING: Unable to paste key. Skipping...");
        }
    }

    return 0;
}

function resetPosition(thisComp, currentProperty) {
    if (currentProperty.numKeys > 0) {
        currentProperty.setValueAtTime(thisComp.time, [0,0]);
    }
    else {
        currentProperty.setValue([0,0]);
    }
}

function resetRotation(thisComp, currentProperty) {
    if (currentProperty.numKeys > 0) {
        currentProperty.setValueAtTime(thisComp.time, 0);
    }
    else {
        currentProperty.setValue(0);
    }
}

function resetScale(thisComp, currentProperty) {
    if (currentProperty.numKeys > 0) {
        currentProperty.setValueAtTime(thisComp.time, [100, 100]);
    }
    else {
        currentProperty.setValue([100,100]);
    }
}

function resetCornerPin_0001(thisComp, curProp) {
    if (curProp.numKeys > 0) {
        curProp.setValueAtTime(thisComp.time, [0, 0]);
    }
    else {
        curProp.setValue([0, 0]);
    }
}

function resetCornerPin_0002(thisComp, curProp) {
    var origProp = curProp;
    for(var i = 0; i < 5; i++) {
        curProp = curProp.parentProperty;
        if (curProp.matchName === "ADBE AV Layer") {
            var curLayer = curProp;
            break;
        }
    }
    curProp = origProp;
    if (curProp.numKeys > 0) {
        curProp.setValueAtTime(thisComp.time, [curLayer.width, 0]);
    }
    else {
        curProp.setValue([curLayer.width, 0]);
    }
}

function resetCornerPin_0003(thisComp, curProp) {
    var origProp = curProp;

    for(var i = 0; i < 5; i++) {
        curProp = curProp.parentProperty;
        if (curProp.matchName === "ADBE AV Layer") {
            var curLayer = curProp;
            break;
        }
    }
    curProp = origProp;
    if (curProp.numKeys > 0) {
        curProp.setValueAtTime(thisComp.time, [0, curLayer.height]);
    }
    else {
        curProp.setValue([0, curLayer.height]);
    }
}

function resetCornerPin_0004(thisComp, curProp) {
    var origProp = curProp;
    for(var i = 0; i < 5; i++) {
        curProp = curProp.parentProperty;
        if (curProp.matchName === "ADBE AV Layer") {
            var curLayer = curProp;
            break;
        }
    }
    curProp = origProp;
    if (curProp.numKeys > 0) {
        curProp.setValueAtTime(thisComp.time, [curLayer.width, curLayer.height]);
    }
    else {
        curProp.setValue([curLayer.width, curLayer.height]);
    }
}

function resetBezMesh_0001(thisComp, curProp) {
    var origProp = curProp;
    for(var i = 0; i < 5; i++) {
        curProp = curProp.parentProperty;
        if (curProp.matchName === "ADBE AV Layer") {
            var curLayer = curProp;
            break;
        }
    }
    curProp = origProp;
    if (curProp.numKeys > 0) {
        curProp.setValueAtTime(thisComp.time, [0, 0]);
    }
    else {
        curProp.setValue([0, 0]);
    }
}

function resetBezMesh_0002(thisComp, curProp) {
    var origProp = curProp;
    for(var i = 0; i < 5; i++) {
        curProp = curProp.parentProperty;
        if (curProp.matchName === "ADBE AV Layer") {
            var curLayer = curProp;
            break;
        }
    }
    curProp = origProp;
    if (curProp.numKeys > 0) {
        curProp.setValueAtTime(thisComp.time, [curLayer.width / 3, 0]);
    }
    else {
        curProp.setValue([curLayer.width / 3, 0]);
    }
}

function resetBezMesh_0003(thisComp, curProp) {
    var origProp = curProp;
    for(var i = 0; i < 5; i++) {
        curProp = curProp.parentProperty;
        if (curProp.matchName === "ADBE AV Layer") {
            var curLayer = curProp;
            break;
        }
    }
    curProp = origProp;
    if (curProp.numKeys > 0) {
        curProp.setValueAtTime(thisComp.time, [curLayer.width / 3 * 2, 0]);
    }
    else {
        curProp.setValue([curLayer.width / 3 * 2, 0]);
    }
}

function resetBezMesh_0004(thisComp, curProp) {
    var origProp = curProp;
    for(var i = 0; i < 5; i++) {
        curProp = curProp.parentProperty;
        if (curProp.matchName === "ADBE AV Layer") {
            var curLayer = curProp;
            break;
        }
    }
    curProp = origProp;
    if (curProp.numKeys > 0) {
        curProp.setValueAtTime(thisComp.time, [curLayer.width, 0]);
    }
    else {
        curProp.setValue([curLayer.width, 0]);
    }
}

function resetBezMesh_0005(thisComp, curProp) {
    var origProp = curProp;
    for(var i = 0; i < 5; i++) {
        curProp = curProp.parentProperty;
        if (curProp.matchName === "ADBE AV Layer") {
            var curLayer = curProp;
            break;
        }
    }
    curProp = origProp;
    if (curProp.numKeys > 0) {
        curProp.setValueAtTime(thisComp.time, [curLayer.width, curLayer.height / 3]);
    }
    else {
        curProp.setValue([curLayer.width, curLayer.height / 3]);
    }
}

function resetBezMesh_0006(thisComp, curProp) {
    var origProp = curProp;
    for(var i = 0; i < 5; i++) {
        curProp = curProp.parentProperty;
        if (curProp.matchName === "ADBE AV Layer") {
            var curLayer = curProp;
            break;
        }
    }
    curProp = origProp;
    if (curProp.numKeys > 0) {
        curProp.setValueAtTime(thisComp.time, [curLayer.width, curLayer.height / 3 * 2]);
    }
    else {
        curProp.setValue([curLayer.width, curLayer.height / 3 * 2]);
    }
}

function resetBezMesh_0007(thisComp, curProp) {
    var origProp = curProp;
    for(var i = 0; i < 5; i++) {
        curProp = curProp.parentProperty;
        if (curProp.matchName === "ADBE AV Layer") {
            var curLayer = curProp;
            break;
        }
    }
    curProp = origProp;
    if (curProp.numKeys > 0) {
        curProp.setValueAtTime(thisComp.time, [curLayer.width, curLayer.height]);
    }
    else {
        curProp.setValue([curLayer.width, curLayer.height]);
    }
}

function resetBezMesh_0008(thisComp, curProp) {
    var origProp = curProp;
    for(var i = 0; i < 5; i++) {
        curProp = curProp.parentProperty;
        if (curProp.matchName === "ADBE AV Layer") {
            var curLayer = curProp;
            break;
        }
    }
    curProp = origProp;
    if (curProp.numKeys > 0) {
        curProp.setValueAtTime(thisComp.time, [curLayer.width / 3 * 2, curLayer.height]);
    }
    else {
        curProp.setValue([curLayer.width / 3 * 2, curLayer.height]);
    }
}

function resetBezMesh_0009(thisComp, curProp) {
    var origProp = curProp;
    for(var i = 0; i < 5; i++) {
        curProp = curProp.parentProperty;
        if (curProp.matchName === "ADBE AV Layer") {
            var curLayer = curProp;
            break;
        }
    }
    curProp = origProp;
    if (curProp.numKeys > 0) {
        curProp.setValueAtTime(thisComp.time, [curLayer.width / 3, curLayer.height]);
    }
    else {
        curProp.setValue([curLayer.width / 3, curLayer.height]);
    }
}

function resetBezMesh_0010(thisComp, curProp) {
    var origProp = curProp;
    for(var i = 0; i < 5; i++) {
        curProp = curProp.parentProperty;
        if (curProp.matchName === "ADBE AV Layer") {
            var curLayer = curProp;
            break;
        }
    }
    curProp = origProp;
    if (curProp.numKeys > 0) {
        curProp.setValueAtTime(thisComp.time, [0, curLayer.height]);
    }
    else {
        curProp.setValue([0, curLayer.height]);
    }
}

function resetBezMesh_0011(thisComp, curProp) {
    var origProp = curProp;
    for(var i = 0; i < 5; i++) {
        curProp = curProp.parentProperty;
        if (curProp.matchName === "ADBE AV Layer") {
            var curLayer = curProp;
            break;
        }
    }
    curProp = origProp;
    if (curProp.numKeys > 0) {
        curProp.setValueAtTime(thisComp.time, [0, curLayer.height / 3 * 2]);
    }
    else {
        curProp.setValue([0, curLayer.height / 3 * 2]);
    }
}

function resetBezMesh_0012(thisComp, curProp) {
    var origProp = curProp;
    for(var i = 0; i < 5; i++) {
        curProp = curProp.parentProperty;
        if (curProp.matchName === "ADBE AV Layer") {
            var curLayer = curProp;
            break;
        }
    }
    curProp = origProp;
    if (curProp.numKeys > 0) {
        curProp.setValueAtTime(thisComp.time, [0, curLayer.height / 3]);
    }
    else {
        curProp.setValue([0, curLayer.height / 3]);
    }
}

function resetControls( currentProperty ) {
    var thisComp = app.project.activeItem;
    var curPropMatchName = currentProperty.matchName;
    switch (curPropMatchName) {
        case "ADBE Position":
            resetPosition(thisComp, currentProperty);
            break;
        case "ADBE Scale":
            resetScale(thisComp, currentProperty);
            break;
        case "ADBE Rotate Z":
            resetRotation(thisComp, currentProperty);
            break;
        case "ADBE Corner Pin-0001":
            resetCornerPin_0001(thisComp, currentProperty);
            break;
        case "ADBE Corner Pin-0002":
            resetCornerPin_0002(thisComp, currentProperty);
            break;
        case "ADBE Corner Pin-0003":
            resetCornerPin_0003(thisComp, currentProperty);
            break;
        case "ADBE Corner Pin-0004":
            resetCornerPin_0004(thisComp, currentProperty);
            break;
        case "ADBE BEZMESH-0001":
            resetBezMesh_0001(thisComp, currentProperty);
            break;
        case "ADBE BEZMESH-0002":
            resetBezMesh_0002(thisComp, currentProperty);
            break;
        case "ADBE BEZMESH-0003":
            resetBezMesh_0003(thisComp, currentProperty);
            break;
        case "ADBE BEZMESH-0004":
            resetBezMesh_0004(thisComp, currentProperty);
            break;
        case "ADBE BEZMESH-0005":
            resetBezMesh_0005(thisComp, currentProperty);
            break;
        case "ADBE BEZMESH-0006":
            resetBezMesh_0006(thisComp, currentProperty);
            break;
        case "ADBE BEZMESH-0007":
            resetBezMesh_0007(thisComp, currentProperty);
            break;
        case "ADBE BEZMESH-0008":
            resetBezMesh_0008(thisComp, currentProperty);
            break;
        case "ADBE BEZMESH-0009":
            resetBezMesh_0009(thisComp, currentProperty);
            break;
        case "ADBE BEZMESH-0010":
            resetBezMesh_0010(thisComp, currentProperty);
            break;
        case "ADBE BEZMESH-0011":
            resetBezMesh_0011(thisComp, currentProperty);
            break;
        case "ADBE BEZMESH-0012":
            resetBezMesh_0012(thisComp, currentProperty);
            break;
    }
}

function clamp( value, min, max ) {
    return Math.min( Math.max( value, min ), max );
}

function clampKeyIndex( prop, index ) {
    var numKeys = prop.numKeys;
    return clamp( index, 1, numKeys );
}

function getKeyValue( prop, index ) {
    var clampedIndex = clampKeyIndex( prop, index );
    return prop.keyValue( clampedIndex );
}

function getKeyIndexFromTime( prop, time ) {
    for ( var i = 1; i <= prop.numKeys; i++ ) {
        if ( prop.keyTime(i) == time ) {
            return i;
        }
    }
    throw "getKeyIndexFromTime: No key found at current time";
}

function addShapeInbetween( prop, blend ) {    
    if ( prop.numKeys == 0 ) return 1;
    var time = rigLib.getActiveComp().time;
    var linear = KeyframeInterpolationType.LINEAR;
    var hold = KeyframeInterpolationType.HOLD;
    
    var nearestKeyIndex = prop.nearestKeyIndex( time );
    var nearestKeyTime = prop.keyTime( nearestKeyIndex );
    
    if ( nearestKeyTime == time ) {
        prop.removeKey( nearestKeyIndex );
        var nearestKeyIndex = prop.nearestKeyIndex( time );
        var nearestKeyTime = prop.keyTime( nearestKeyIndex );
    }

    if ( nearestKeyTime == time ) {
        var prevKeyIndex = nearestKeyIndex - 1;
        var nextKeyIndex = nearestKeyIndex + 1;
        var prevKeyTime = prop.keyTime( prevKeyIndex );
        var nextKeyTime = prop.keyTime( nextKeyIndex );
    }
    else if ( nearestKeyTime < time ) {
        var prevKeyIndex = nearestKeyIndex;
        var nextKeyIndex = nearestKeyIndex + 1;
        var prevKeyTime = prop.keyTime( prevKeyIndex );
        var nextKeyTime = prop.keyTime( nextKeyIndex );
    }
    else if ( nearestKeyTime > time ) {
        var prevKeyIndex = nearestKeyIndex - 1;
        var nextKeyIndex = nearestKeyIndex;
        var prevKeyTime = prop.keyTime( prevKeyIndex );
        var nextKeyTime = prop.keyTime( nextKeyIndex );
    }

    blend = blend / 200 + 0.5;
    var blendedTime = prevKeyTime * ( 1 - blend ) + nextKeyTime * blend;
    
    prop.setInterpolationTypeAtKey( prevKeyIndex, hold, linear );
    prop.setInterpolationTypeAtKey( nextKeyIndex, linear, hold );
     
    var newValue = prop.valueAtTime( blendedTime, false );
    
    prop.setValueAtTime( time, newValue );
    
    var newKeyIndex = getKeyIndexFromTime( prop, time );
    prop.setInterpolationTypeAtKey( newKeyIndex, hold, hold );
    prop.setInterpolationTypeAtKey( prevKeyIndex, hold, hold );
    prop.setInterpolationTypeAtKey( nextKeyIndex, hold, hold );
    return 0;
}

function addInbetween( prop, blend ) {    
    if ( prop.propertyValueType == PropertyValueType.SHAPE ) { addShapeInbetween( prop, blend ); return 1 };
    if ( prop.numKeys == 0 ) return 1;
    
    var time = rigLib.getActiveComp().time;
    var keyframeInterpolation = KeyframeInterpolationType.HOLD;
    
    var nearestKeyIndex = prop.nearestKeyIndex( time );
    var nearestKeyTime = prop.keyTime( nearestKeyIndex );
    
    if ( nearestKeyTime == time ) {
        var prevKeyValue = getKeyValue( prop, nearestKeyIndex - 1 );
        var nextKeyValue = getKeyValue( prop, nearestKeyIndex + 1 );
    }
    else if ( nearestKeyTime < time ) {
        var prevKeyValue = getKeyValue( prop, nearestKeyIndex );
        var nextKeyValue = getKeyValue( prop, nearestKeyIndex + 1 );
    }
    else if ( nearestKeyTime > time ) {
        var prevKeyValue = getKeyValue( prop, nearestKeyIndex - 1 );
        var nextKeyValue = getKeyValue( prop, nearestKeyIndex );
    }

    blend = blend / 200 + 0.5;
    var blendedValue = prevKeyValue * ( 1 - blend ) + nextKeyValue * blend;
    
    var min = blendedValue;
    var max = blendedValue;
    if ( prop.hasMax ) var max = prop.maxValue;
    if ( prop.hasMin ) var min = prop.minValue;
    
    if ( blendedValue.constructor === Array ) {
    
        var clampedValue = []
        for ( var i = 0; i < blendedValue.length; i++ ) {
            var curValue = blendedValue[i];
            var curMin = min[i];
            var curMax = max[i];
            clampedValue.push( clamp( curValue, curMin, curMax ) );
        }
    }

    else {
        var clampedValue = clamp( blendedValue, min, max );
    }
    
    prop.setValueAtTime( time, clampedValue );
    
    if ( nearestKeyTime != time ) {
        var newKeyIndex = getKeyIndexFromTime( prop, time );
        prop.setInterpolationTypeAtKey( newKeyIndex, keyframeInterpolation, keyframeInterpolation );
    }
    return 0;
}

function GUI() {
    var window = new Window("palette", "Keyframe UI", undefined );
    window.orientation = "column";
    window.alignChildren = [ "Fill", "Fill" ];
    
    var tabbedPanel = window.add( "tabbedpanel", undefined, "" );
    
    var panelOne = tabbedPanel.add( "tab", undefined, "At Current Time" );
    
    var groupOne = panelOne.add( "group", undefined, "groupOne" );
    groupOne.orientation = "row";
    var addHoldKeysButton = groupOne.add( "button", undefined, "Add Holds" );
    
    addHoldKeysButton.onClick = function() {
        #include 1_05_Add_HOLD_Keys_At_Current_Time.jsx
    }

    var resetControlsButton = groupOne.add( "button", undefined, "Reset" );
    
    resetControlsButton.onClick = function() {
        rigLib.batchRunPropOp( resetControls );
    }

    var groupTwo = panelOne.add( "group", undefined, "groupTwo" );
    
    var copyKeysAtCurrentTimeButton = groupTwo.add( "button", undefined, "Copy" );
    
    copyKeysAtCurrentTimeButton.onClick = function() {
        keyframeCopyArray = [];
        rigLib.batchRunPropOp( copyKeysAtCurrentTime );
    }

    var pasteKeysAtCurrentTimeButton = groupTwo.add( "button", undefined, "Paste" );
    
    pasteKeysAtCurrentTimeButton.onClick = function() {
        if (typeof keyframeCopyArray == "undefined") {
            rigLib.print.message("ERROR: no keyframes copied");
        }

        else {
            rigLib.run( pasteKeysAtCurrentTime, keyframeCopyArray );
        }
    }

    var panelTwo = tabbedPanel.add( "tab", undefined, "Pose Blender" )

    var sliderGroup = panelTwo.add( "group", undefined, "sliderGroup" );
    sliderGroup.orientation = "row";
    var slider = sliderGroup.add("slider", undefined, "hello");
    slider.bounds = [0, 0, 220, 20];
    slider.minvalue = -150;
    slider.maxvalue = 150;
    slider.value = 0;

    slider.onChange = function() {
        rigLib.batchRunPropOp( { propOp : addInbetween, args : slider.value } );
    }
    
    var incrementGroup = panelTwo.add( "group", undefined, "incrementGroup" );
    incrementGroup.orientation = "row";
    
    function incrementButton( panel, value, propOp ) {
        var self = this;
        self.propOp = propOp;
        self.value = value;
        self.incrementButton = panel.add( "button", undefined, value );
        self.incrementButton.size = [ 30, 20 ];
        self.incrementButton.onClick = function() {
            sliderText.text = self.value;
            slider.value = self.value;            
            rigLib.batchRunPropOp( { propOp : self.propOp, args : self.value } );
        }
    }

    var minus100 = new incrementButton( incrementGroup, -100, addInbetween );
    var minus90 = new incrementButton( incrementGroup, -66, addInbetween );
    var minus75 = new incrementButton( incrementGroup, -33, addInbetween );
    var zero = new incrementButton( incrementGroup, 0, addInbetween );
    var plus75 = new incrementButton( incrementGroup, 33, addInbetween );
    var plus90 = new incrementButton( incrementGroup, 66, addInbetween );
    var plus100 = new incrementButton( incrementGroup, 100, addInbetween );
    
    var sliderValueGroup = panelTwo.add( "group", undefined, "sliderValueGroup" );
    
    var sliderText = sliderValueGroup.add("statictext", undefined, "0");
    sliderText.characters = 4;
    sliderText.justify = "center";
    
    slider.onChanging = function() {
        sliderText.text = Math.floor(slider.value);
    }


    window.center();
    window.show();
}

GUI();