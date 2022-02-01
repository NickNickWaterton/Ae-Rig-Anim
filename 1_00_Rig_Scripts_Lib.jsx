//~ This file is part of Ae Rig Anim.
//~ Rig Anim Scripts is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3 as published by the Free Software Foundation.
//~ Rig Anim Scripts is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License version 3 for more details.
//~ You should have received a copy of the GNU General Public License version 3 along with Rig Anim Scripts. If not, see <https://www.gnu.org/licenses/>.
//~ Copyright Nicholas Waterton and Arcus Animation Studios

function RigLib( options ) {
    var self = this;
    self.controlPrefix = options.controlPrefix;
    self.zeroPrefix = options.zeroPrefix;
    
    {
        self.filter = function ( collection, condition, args ) {      
            if ( self.isUndefined( args ) ) var filtered = self.filter._noArgs( collection, condition );
            else var filtered = self.filter._args( collection, condition, args );      
            return filtered;
        };
        self.filter._noArgs = function ( collection, condition ) {
            var filtered = [];
            for (var i = 0; i < collection.length; i++) {
                var item = collection[i];
                if ( condition( item ) ) filtered.push( item );
            }
            return filtered;
        };
        self.filter._args = function ( collection, condition, args ) {
            var filtered = [];
            for (var i = 0; i < collection.length; i++) {
                var item = collection[i];
                if ( condition( item, args ) ) filtered.push( item );
            }
            return filtered;
        };          
    }

    {
        self.forEach = function ( collection, func, args ) {
            if ( self.isUndefined( args ) ) self.forEach._noArgs( collection, func );
            else this.forEach._args( collection, func, args );
        };
        self.forEach._noArgs =  function ( collection, func ) {
            for (var i = 0; i < collection.length; i++) {
                var item = collection[i];
                func( item );
            }
        };
        self.forEach._args = function ( collection, func, args ) {
            for (var i = 0; i < collection.length; i++) {
                var item = collection[i];
                func( item, args );
            }
        };
    }

    self.getProps = function(){};
    self.getProps = ( function() {
        function _effects ( prop, propList ) {
            if ( self.isUndefined( propList ) ) var propList = [];
            var isProperty = prop.propertyType == PropertyType.PROPERTY;
            if ( isProperty ) {
                var isKeyable = prop.canVaryOverTime;
                if ( isKeyable && prop.name != "Effect Opacity" ) propList.push( prop );
            }
            else { // is therefore a group
                for ( var i = 1; i <= prop.numProperties; i++ ){
                    _effects( prop.property(i), propList );
                }
            }
            return propList;
        };
        function _named ( prop, name, propList ) {
            if ( self.isUndefined( propList ) ) var propList = [];
            var isProperty = prop.propertyType == PropertyType.PROPERTY;
            if ( isProperty ) {
                var isKeyable = prop.canVaryOverTime;
                if ( isKeyable && prop.name === name ) propList.push( prop );
            }
            else { // is therefore a group
                for ( var i = 1; i <= prop.numProperties; i++ ){
                    _named( prop.property(i), name, propList );
                }
            }
            return propList;
        };
        function _all ( prop, propList ) {
            if ( self.isUndefined( propList ) ) var propList = [];
            var isProperty = prop.propertyType == PropertyType.PROPERTY;
            if ( isProperty ) {
                var isKeyable = prop.canVaryOverTime;
                if ( isKeyable ) propList.push( prop );
            }
            else { // is therefore a group
                for ( var i = 1; i <= prop.numProperties; i++ ){
                    _all( prop.property(i), propList );
                }
            }
            return propList;
        };
        return {
            effects : _effects,
            named : _named,
            all : _all
        }
    })();

    self.getLayerProps = function(){};
    self.getLayerProps = ( function(){
        function _transforms ( layer ) {
            var layerTransform = layer.property( "ADBE Transform Group" );
            var propList = [
            layerTransform.property( "ADBE Anchor Point" ),
            layerTransform.property( "ADBE Rotate Z" ),
            layerTransform.property( "ADBE Scale" )];
            
            var layerPosition = layerTransform.property( "ADBE Position" );
            if ( !layerPosition.dimensionsSeparated ) propList.push( layerPosition );
            else {
                propList.push( layerTransform.property( "ADBE Position_0" ) );
                propList.push( layerTransform.property( "ADBE Position_1" ) );
            }
            return propList;
        };
        function _basic ( layer ) {
            var layerTransform = layer.property( "ADBE Transform Group" );
            var propList = [
            layerTransform.property( "ADBE Rotate Z" ),
            layerTransform.property( "ADBE Scale" )
            ];           
            var layerPosition = layerTransform.property( "ADBE Position" );
            if ( !layerPosition.dimensionsSeparated ) propList.push( layerPosition );
            else {
                propList.push( layerTransform.property( "ADBE Position_0" ) );
                propList.push( layerTransform.property( "ADBE Position_1" ) );
            }
            return propList;
        };
        function _position ( layer ) {
            var layerTransform = layer.property( "ADBE Transform Group" );   
            var layerPosition = layerTransform.property( "ADBE Position" );
            var propList = [];
            if ( !layerPosition.dimensionsSeparated ) propList.push( layerPosition );
            else {
                propList.push( layerTransform.property( "ADBE Position_0" ) );
                propList.push( layerTransform.property( "ADBE Position_1" ) );
            }
            return propList;
        };
        function _rotation ( layer ) {
            var layerTransform = layer.property( "ADBE Transform Group" );
            return [ layerTransform.property( "ADBE Rotate Z" ) ];
        };
        function _scale ( layer ) {
            var layerTransform = layer.property( "ADBE Transform Group" );
            return [ layerTransform.property( "ADBE Scale" ) ];
        };
        function _anchorPoint ( layer ) {
            var layerTransform = layer.property( "ADBE Transform Group" );
            return [ layerTransform.property( "ADBE Anchor Point" ) ];
        };
        function _opacity ( layer ) {
            var layerTransform = layer.property( "ADBE Transform Group" );
            return [ layerTransform.property( "ADBE Opacity" ) ];
        };
        function _paths ( layer ) {
            var layerShapeContents = layer.property( "Contents" );
            return self.getProps.named( layerShapeContents, "Path" );
        };
        function _masks ( layer ) {
            var layerShapeContents = layer.property( "Masks" );
            return self.getProps.named( layerShapeContents, "Mask Path" );
        };
        function _effects ( layer ) {
            var layerEffects = layer.property( "ADBE Effect Parade" );
            return self.getProps.effects( layerEffects );
        };
        function _time ( layer ) {
            return [ layer.property( "Time Remap" ) ];
        };
        function _none ( layer ) {
            return [];
        };
        return {
            transforms : _transforms,
            basic : _basic,
            position : _position,
            rotation : _rotation,
            scale : _scale,
            anchorPoint : _anchorPoint,
            opacity : _opacity,
            paths : _paths,
            masks : _masks,
            effects : _effects,
            time : _time,
            none : _none
        }
    })();

    self.getFunctionName = function ( func ) {
        return func.toString().match( /function ([^\(]+)/ )[1];
    };

    self.print = function(){};
    self.print = ( function() {
        function _message ( message ) {
            $.writeln( message.toString() );
            writeLn( message.toString() );
        };

        function _collection ( collection ) {
            for ( var i = 0; i < collection.length; i++ ) {
                var item = collection[i];
                self.print.message( item.name );
            }
        };
    
        return {
            message : _message,
            collection : _collection
        }
    })();

    self.isUndefined = function( obj ) {
        var isUndefined = typeof obj === "undefined";
        return isUndefined;
    };

    self.getActiveComp = function() {
        var comp = app.project.activeItem;      
        var activeItemIsComp= comp instanceof CompItem;
        if ( !activeItemIsComp ) throw "Active Item is not comp.";       
        var compHasLayers = comp.numLayers != 0;
        if ( !compHasLayers ) throw "Active comp has no layers.";     
        return comp;
    };

    self.getLayers = function ( filterFunc, filterArgs ) {
        var comp = self.getActiveComp();    
        var layers = self.getLayersFromComp( comp );
        var filteredLayers = self.filter( layers, filterFunc, filterArgs );         
        var noLayers = filteredLayers.length == 0;
        if ( noLayers ) throw "No layers supported";
        return filteredLayers;
    };

    self.getControlLayers = function() {
        return self.getLayers( self.filterNonControlLayers, { controlPrefix : self.controlPrefix, comp : self.getActiveComp(), getLayerOp : self.getLayerOp } );
    };

    {
        self.getAllLayersInComp = function ( comp ) {
            var layers = comp.layers;
            var noLayers = layers.length == 0;
            if ( noLayers ) throw "No layers in active comp";   
            return self.getAllLayersInComp._convertOneIndexedToZeroIndexedArray( layers );
        };
        self.getAllLayersInComp._convertOneIndexedToZeroIndexedArray = function( collection ) {
            var newArray = [];
            for ( var i = 1; i <= collection.length; i++ ) {
                newArray.push( collection[i] );
            }
            return newArray;
        };
    }

    self.getLayersFromComp = function ( comp ) {
        if ( self.isUndefined( comp ) ) throw "getLayersFromComp: comp is undefined";
        var layersAreSelected = comp.selectedLayers.length != 0;
        if ( layersAreSelected ) return comp.selectedLayers;      
        return self.getAllLayersInComp( comp );
    };

    self.filterNonControlLayers = function( layer, args ) {    
        var layerNameDoesNotHavePrefix = layer.name.indexOf( args.controlPrefix ) != 0;
        if ( layerNameDoesNotHavePrefix ) return false;        
        var layerIsShy = layer.shy && args.comp.hideShyLayers;
        if ( layerIsShy ) return false;    
        var layerIsActive = layer.activeAtTime( args.comp.time );
        if ( !layerIsActive ) return false;
        return true;
    };

    self.runPropOpOnSelectedProps = function(){};
    self.runPropOpOnSelectedProps = ( function() {
        function _filterNonProps( prop ) {
            return prop.propertyType == PropertyType.PROPERTY;
        };
        function _noArgs ( comp, propOp ) {
            var props = comp.selectedProperties;
            var filteredProps = self.filter( props, _filterNonProps );
            self.forEach( filteredProps, propOp );
        };
        function _args ( comp, propOp, args ) {
            var props = comp.selectedProperties;
            var filteredProps = self.filter( props, _filterNonProps );
            self.forEach( filteredProps, propOp, args );
        };
        return  {
            noArgs : _noArgs,
            args : _args
        }
    })();
    
    self.batch = function() {};
    self.batch = ( function() {
        function _getPropGroupsArray ( layer ) {
            var comment = layer.comment;
            if ( comment == "" ) return [ "transforms" ];
            var dict = {
                "transforms" : "transforms",
                "basic" : "basic",
                "position" : "position",
                "rotation" : "rotation",
                "anchorPoint" : "anchorPoint",
                "opacity" : "opacity",
                "scale" : "scale",
                "effects" : "effects",
                "paths" : "paths",
                "masks" : "masks",
                "time" : "time",
                "none" : "none"
            };
            var commentSplit =  comment.split(",");
            var propGroups = [];
            var counter = 0;
            for ( var i = 0; i < commentSplit.length; i++ ) {
                var propGroup = commentSplit[i];
                var isUndefined = self.isUndefined( dict[ propGroup ] );
                if ( !isUndefined ) {
                    propGroups.push( propGroup );
                    counter ++;
                }
            }
            // transforms is default props group for layer
            if ( counter == 0 ) return [ "transforms" ];
            return propGroups;
        };
        function _getPropsArray( layers ) {
            var props = [];
            for ( var i = 0; i < layers.length; i++ ) {
                var layer = layers[i];
                var propsToGetArray = _getPropGroupsArray( layer );
                for ( var j = 0; j < propsToGetArray.length; j++ ) {
                    var propGroup = propsToGetArray[j];
                    var thisLayerProps = self.getLayerProps[ propGroup ]( layer );
                    props = props.concat( thisLayerProps );
                }
            }
            return props;
        };
        function _getArgsType( args ) {
            if ( typeof args === "function" ) return "function";
            if ( typeof args !== "object" ) throw "args is not object";
            if ( self.isUndefined( args.propOp ) ) throw ".propOp is undefined";
            if ( self.isUndefined( args.args ) ) throw ".args is undefined";
            return "object";
        };
        function _propOp ( args ) {          
            var argsType = _getArgsType( args );
          
            var comp = self.getActiveComp();
           
            if ( comp.selectedProperties.length != 0 ) {
                if ( argsType === "function" ) self.runPropOpOnSelectedProps.noArgs( comp, args );
                if ( argsType === "object" ) self.runPropOpOnSelectedProps.args( comp, args.propOp, args.args );        
                return 0;
            }
        
            var layers = self.getLayersFromComp( comp );
            layers = self.filter( layers, self.filterNonControlLayers, { controlPrefix : self.controlPrefix, comp : comp } );
            if ( layers.length == 0 ) return 1;
                    
            var props = _getPropsArray( layers );

            if ( argsType === "function" ) {
                self.print.message( self.getFunctionName( args ) );
                var propOp = args;
                self.forEach( props, propOp );
            }

            else if ( argsType === "object" ) {
                self.print.message( self.getFunctionName( args.propOp ) );
                self.forEach( props, args.propOp, args.args );
            }
            return 0;
        };
        function _layerOp ( args ) {  
            var argsType = _getArgsType( args );
            
            var layers = self.getLayersFromComp( comp );
            layers = self.filter( layers, self.filterNonControlLayers, { controlPrefix : self.controlPrefix, comp : comp } );
            if ( layers.length == 0 ) return 1;
            
            if ( argsType === "function" ) {
                var propOp = args;
                self.forEach( layers, propOp );
            }

            else if ( argsType === "object" ) {
                self.forEach( layers, args.layerOp, args.args )
            }  
            return 0;    
        };
        return {
            propOp : _propOp,
            layerOp : _layerOp
        }
    })();

    self.batchRunPropOp = function( args ) {
        self.run( self.batch.propOp, args );
    };

    self.run = function( func, args ) {
        if ( self.isUndefined( func ) ) throw "No function passed to run";
        
        clearOutput();
        try {
            var functionName = self.getFunctionName( func );         
            app.beginUndoGroup( functionName );
            if ( self.isUndefined( args ) ) func();
            else func( args );
        }
        catch ( err ) {
            self.print.message( "something went wrong" );
            self.print.message( err );
        }
        finally {
            app.endUndoGroup();
            return 1;
        }   
        return 0;
    };
}

var options = { controlPrefix : "C | ", zeroPrefix : "Z | " }
var rigLib = new RigLib( options );
