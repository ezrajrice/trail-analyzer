"use strict";
$(document).ready(function() {

    //This "require" function is used by the ESRI/DOJO system. It loads modules and then runs the "function" code
 	//So your custom code for the most part goes in the function block below.
 	require([
 	"esri/layers/ArcGISDynamicMapServiceLayer",
 	"esri/layers/ArcGISTiledMapServiceLayer",
 	"esri/map",
 	"dojo/domReady!"
 	],

 	function(ArcGISDynamicMapServiceLayer, ArcGISTiledMapServiceLayer, Map, parser){
        //This is the main function that will run once the page has fully loaded
        //Create a map object with a default "streets" basemap:
        var map = new Map("mapDiv", {basemap: "streets", center: [-111.6, 40.23], zoom:8});

        var trails_url = "http://geoserver.byu.edu:6080/arcgis/rest/services/Ellie_Ott/trails/MapServer";

        //Create a layer object that pulls your web mapping service from the geoserver.byu.edu server:
        var trails_layer = new ArcGISDynamicMapServiceLayer(trails_url);
        map.addLayer(trails_layer);
 	});
})