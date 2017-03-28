"use strict";
$(document).ready(function() {
    var service_url = '';
    var layers = [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        }),
        new ol.layer.Tile({
            extent: [-13884991, 2870341, -7455066, 6338219],
            source: new ol.source.TileArcGISRest({
                url: service_url
            })
        })
    ];

    var map = new ol.Map({
        layers: layers,
        target: 'map',
        view: new ol.View({
            center: [-10997148, 4569099],
            zoom: 4
        })
    });
}