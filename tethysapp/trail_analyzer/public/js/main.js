"use strict";
$(document).ready(function() {

    //This "require" function is used by the ESRI/DOJO system. It loads modules and then runs the "function" code
 	//So your custom code for the most part goes in the function block below.
 	require([
 	"esri/layers/ArcGISTiledMapServiceLayer",
 	"esri/layers/FeatureLayer",
 	"esri/map",
 	"esri/tasks/query",
 	"esri/geometry/Circle",
 	"esri/lang",
 	"dojo/domReady!"
 	],

 	function(ArcGISTiledMapServiceLayer, FeatureLayer, Map, Query, Circle, esriLang, parser){
        //This is the main function that will run once the page has fully loaded
        //Create a map object with a default "streets" basemap:
        var map = new Map("mapDiv", {basemap: "streets", center: [-111.6, 40.23], zoom: 10, slider: false});

        var trails_url = "http://geoserver.byu.edu:6080/arcgis/rest/services/Ellie_Ott/trails/MapServer/0";
        var geoprocessing_url = "http://geoserver.byu.edu:6080/arcgis/rest/services/Ellie_Ott/hiking/GPServer/hiking/execute?ID_input=[[TRAIL_ID]]&env%3AoutSR=&env%3AprocessSR=&returnZ=true&returnM=true&f=json";

        //Create a layer object that pulls your web mapping service from the geoserver.byu.edu server:
        var trails_layer = new FeatureLayer(trails_url, {
            mode: FeatureLayer.MODE_SNAPSHOT,
            outFields: ["TrailID"]
        });

        map.addLayer(trails_layer);

        map.on("load", function(){
            map.graphics.enableMouseEvents();
        });

//        trails_layer.on("click", function(evt) {
//            var t = "${TrailID}";
//            var content = esriLang.substitute(evt.graphic.attributes,t);
//            console.log(content, "event-fired");
//        });

        var circle;

        //when the map is clicked create a buffer around the click point of the specified distance.
        map.on("click", function(evt){
            circle = new Circle({
                center: evt.mapPoint,
                geodesic: true,
                radius: 0.5,
                radiusUnit: "esriMiles"
            });
            map.graphics.clear();
            map.infoWindow.hide();

            var query = new Query();
            query.geometry = circle.getExtent();
            //use a fast bounding box query. will only go to the server if bounding box is outside of the visible map
            var selectedTrail = trails_layer.queryFeatures(query, selectInBuffer).results[0].features[0];
            console.log(selectedTrail);
            // Fire AJAX call to server
        });

        function selectInBuffer(response){
            var feature;
            var features = response.features;
            // Get the last feature returned so only one gets sent
            feature = features[features.length - 1];
            var TrailID = feature.attributes.TrailID;
            var query = new Query();
            query = TrailID;
            return TrailID;
            //use a fast objectIds selection query (should not need to go to the server)
//            trails_layer.selectFeatures(query, FeatureLayer.SELECTION_NEW, function(results){
//                var t = "${TrailID}";
//                var content = esriLang.substitute(evt.graphic.attributes, t);
//                console.log(content, "event-fired");
//            });
        }
 	});
})