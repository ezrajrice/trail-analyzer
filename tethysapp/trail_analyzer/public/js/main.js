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

        // bind button functionality
        $('#show-plot').on('click', showPlot);
        $('#close-plot').on('click', hidePlot);

        //Create a map object with a default "streets" basemap:
        var map = new Map("mapDiv", {basemap: "streets", center: [-111.6, 40.23], zoom: 10, slider: false});

        var trails_url = "http://geoserver.byu.edu:6080/arcgis/rest/services/Ellie_Ott/trails/MapServer/0";
        var geoprocessing_url = "http://geoserver.byu.edu:6080/arcgis/rest/services/Ellise_Hiking/Ellie_hiking/GPServer/hiking/submitJob?" +
            "ID_input=[[TRAIL_ID]]&env%3AoutSR=&env%3AprocessSR=&returnZ=true&returnM=false&f=pjson";
        var results_url = "http://geoserver.byu.edu:6080/arcgis/rest/services/Ellise_Hiking/Ellie_hiking/GPServer/hiking/jobs/[[JOB_ID]]/results/points?f=pjson";

        //Create a layer object that pulls your web mapping service from the geoserver.byu.edu server:
        var trails_layer = new FeatureLayer(trails_url, {
            mode: FeatureLayer.MODE_SNAPSHOT,
            outFields: ["TrailID", "SHAPE_Leng"]
        });

        map.addLayer(trails_layer);

        map.on("load", function(){
            map.graphics.enableMouseEvents();
        });

        var circle;

        //when the map is clicked create a buffer around the click point of the specified distance.
        map.on("click", function(evt){
            // Disable plot button
            $('#show-plot').prop('disabled', true);
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
            var trail_length = selectedTrail.attributes.SHAPE_Leng;
            console.log(selectedTrail);
            // Fire AJAX call to server
            var geo_url = geoprocessing_url.replace('[[TRAIL_ID]]', selectedTrail.attributes.TrailID);
            console.log(geo_url)
            $.ajax({
                url : ajax_url,
                type : 'GET',
                dataType:'json',
                success : function(data) {
                    console.log(data);
                    var job_id = data.jobId;
                    getTrailData(job_id, trail_length);
                },
                error : function(request, error)
                {
                    console.log("Request: "+JSON.stringify(request));
                }
            });
        });

        function getTrailData(job_id, trail_length) {
            res_url = results_url.replace('[[JOB_ID]]', job_id);
            $.ajax({
                url : res_url,
                type : 'GET',
                dataType:'json',
                success : function(data) {
                    console.log(data);
                    // Set data to be data of plot
                    var plot_data = [];
                    for (var i=0; i<data.features.length; i++) {
                        var x = (trail_length / data.length) * i;
                        var y = data.features[i].grid_code;
                        plot_data.push([x,y]);
                    }
                    updatePlot(plot_data);
                },
                error : function(request, error)
                {
                    console.log("Request: "+JSON.stringify(request));
                }
            });
        }

        function selectInBuffer(response){
            var feature;
            var features = response.features;
            // Get the last feature returned so only one gets sent to geoprocess
            feature = features[features.length - 1];
            var TrailID = feature.attributes.TrailID;
            var query = new Query();
            query = TrailID;

            // todo Change the selected features display

            return TrailID;
        }

        function updatePlot(data) {
            // this gets called when data is returned
            Highcharts.charts[1].series[0].setData(data);

            // Make plot button clickable
            $('#show-plot').prop('disabled', false);
        }

        function showPlot() {
            $('#plot-container').addClass('show');
        }

        function hidePlot() {
            $('#plot-container').removeClass('show');
        }
 	});
})