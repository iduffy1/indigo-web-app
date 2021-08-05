import {
    Component,
    NgZone,
    AfterViewInit,
    Output,
    Input,
    EventEmitter,
    ChangeDetectorRef,
    OnDestroy,
    ViewContainerRef,
} from "@angular/core";

import { View, Map, Feature } from "ol";
import { ScaleLine, defaults as DefaultControls } from "ol/control";
import { Coordinate } from "ol/coordinate";
import { getCenter } from "ol/extent";
import GeoJSON from "ol/format/GeoJSON";
import Point from "ol/geom/Point";
import { Vector, Tile } from "ol/layer";
import { fromLonLat, get as GetProjection } from "ol/proj";
import Projection from "ol/proj/Projection";
import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";
import { Fill, Stroke, Circle, Style, Text, RegularShape } from "ol/style";
import { Subscription } from "rxjs";

import { GroupedEvent, Poi } from "src/models/dto";
import { IndigoDataService } from "../indigo-data.service";

@Component({
    selector: "app-ol-map",
    templateUrl: "./ol-map.component.html",
    styleUrls: ["./ol-map.component.scss"],
})
export class OlMapComponent implements AfterViewInit, OnDestroy {
    @Input() center: Coordinate;
    @Input() zoom: number;
    @Input() poiId : number;
    view: View;
    projection: Projection;
    Map: Map;
    @Output() mapReady = new EventEmitter<Map>();

    eventsLayer: Vector;
    groupedEventsLayer: Vector;
    highlightLayer: Vector;

    showLocation = true;
    public pois: Poi[];
    public groupedEvents: GroupedEvent[];

    subscriptions: Subscription[] = [];

    constructor(
        private zone: NgZone,
        private cd: ChangeDetectorRef,
        private indigoDataService: IndigoDataService
    ) {}

    ngAfterViewInit(): void {
        if (!this.Map) {
            this.zone.runOutsideAngular(() => this.initMap());
        }
        setTimeout(() => this.mapReady.emit(this.Map));
    }

    ngOnDestroy(): void {
        for (const sub of this.subscriptions) {
            sub.unsubscribe();
        }
    }

    private initMap(): void {
        this.projection = GetProjection("EPSG:3857");

        this.view = new View({
            center: fromLonLat(this.center),
            zoom: this.zoom,
            projection: this.projection,
        });

        this.eventsLayer = this.createEventsLayer();
        this.groupedEventsLayer = this.createGroupedEventsLayer();
        this.highlightLayer = this.createHighlightLayer();

        this.Map = new Map({
            layers: [
                new Tile({
                    source: new OSM({
                        url:
                            "http://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
                    }),
                }),
                this.createTrackLayer(),
                this.createRouteLayer(),
                this.createMilepostLayer(),
                this.eventsLayer,
                this.highlightLayer,
                this.groupedEventsLayer,
                this.createImportLayer(),
                this.createGpsMatchLayer(),
            ],
            target: "map",
            view: this.view,
            controls: DefaultControls().extend([new ScaleLine({})]),
        });
        this.onMapReady(null);
    }

    onMapReady(e) {
        console.log("OnMap Ready");

        this.subscriptions.push(
            this.indigoDataService.eventFilterResults$.subscribe({
                next: (result) => {
                    if (result?.data) {
                        this.setEventsLayer(result.data);
                        if (this.poiId) this.zoomToEvent(this.poiId);
                    }
                },
            })
        );

        this.subscriptions.push(
            this.indigoDataService.groupedEventFilterResults$.subscribe({
                next: (result) => {
                    if (result?.data) this.setGroupedEventsLayer(result.data);
                },
            })
        );
    }

    createTestLayer() {
        console.log(fromLonLat([-3.3839533759999654,   55.990810186000033]));
        const forthBridge = new Feature({
            geometry: new Point(
                fromLonLat([-3.3839533759999654,   55.990810186000033])
            )});

        const testLayer = new Vector({
            source: new VectorSource({
                features : [forthBridge]
            }),
            style:  new Style({
                image: new Circle({
                    fill: new Fill({
                        color: "rgba(55, 200, 250, 0.5)",
                    }),
                    stroke: new Stroke({
                        width: 1,
                        color: "rgba(55, 200, 150, 0.8)",
                    }),
                    radius: 16,
                })
            })
        });

        return testLayer;
    }


    createTrackLayer() {
        const styleCache = [];
        const trackLayer = new Vector({
            //projection: 'EPSG:900913',
            source: new VectorSource({
                url: "/map/NetworkLinks.shp.json",
                format: new GeoJSON(),
            }),
            style: (feature, resolution) => {
                var text = resolution < 5000 ? "track" : "";
                if (!styleCache[text]) {
                    styleCache[text] = [
                        new Style({
                            fill: new Fill({
                                color: "rgba(255, 255, 255, 0.1)",
                            }),
                            stroke: new Stroke({
                                color: "#319FD3",
                                width: 1,
                            }),
                            zIndex: 999,
                        }),
                    ];
                }
                return styleCache[text];
            },
        });
        return trackLayer;
    }

    createRouteLayer() {
        const styleCache = [];
        const routeLayer = new Vector({
            source: new VectorSource({
                url: "/map/NetworkReferenceLines.shp.json",
                format: new GeoJSON(),
            }),
            style: (feature, resolution) => {
                var text = resolution < 5000 ? "route" : "";
                if (!styleCache[text]) {
                    styleCache[text] = [
                        new Style({
                            fill: new Fill({
                                color: "rgba(255, 255, 255, 0.1)",
                            }),
                            stroke: new Stroke({
                                color: "#D39F91",
                                width: 1,
                            }),
                            zIndex: 999,
                        }),
                    ];
                }
                return styleCache[text];
            },
        });
        return routeLayer;
    }

    createMilepostLayer() {
        const styleCache = [];
        const pointLayer = new Vector({
            source: new VectorSource({
                url: "/map/NetworkWaymarks.shp.json",
                format: new GeoJSON(),
            }),
            maxResolution: 20,
            style: (feature, resolution) => {
                var text = this.showLocation ? feature.get("Mileage") : "";

                if (!styleCache[text]) {
                    styleCache[text] = [
                        new Style({
                            text: new Text({
                                font: "12px Calibri,sans-serif",
                                text: text,
                                textAlign: "right",
                                offsetX: -10,
                                fill: new Fill({
                                    color: "#000",
                                }),
                                stroke: new Stroke({
                                    color: "#fff",
                                    width: 3,
                                }),
                            }),
                            image: new Circle({
                                fill: new Fill({
                                    color: "rgba(55, 200, 150, 0.5)",
                                }),
                                stroke: new Stroke({
                                    width: 1,
                                    color: "rgba(55, 200, 150, 0.8)",
                                }),
                                radius: 6,
                            }),
                            zIndex: 999,
                        }),
                    ];
                }
                return styleCache[text];
            },
        });
        return pointLayer;
    }

    getColorOfPoi(poi : Poi) : string {
        switch (poi.poiCode) {
            case "V.BP":
            case "V.RQ":
                return "rgba(200, 55, 55, 0.8)";
            case "L.BP":
            case "L.RQ":
                return "rgba(55, 55, 200, 0.8)";
            default:
                // Bright Green to highlight undhandled Poi Code
                return "rgba(0, 255, 0, 1)";
        }
    }

    getStyleOfPoi(poi : Poi) : Style {
        var color = this.getColorOfPoi(poi);
        switch (poi.poiCode) {
            case "V.BP":
            case "L.BP":
                return new Style({
                    image: new Circle({
                        fill: new Fill({
                            color: color,
                        }),
                        stroke: new Stroke({
                            width: 1,
                            color: color,
                        }),
                        radius: 6,
                    }),
                    zIndex: 999,
                });
            case "V.RQ":
            case "L.RQ":
                return new Style({
                    image: new RegularShape({
                        fill: new Fill({
                            color: color,
                        }),
                        stroke: new Stroke({
                            width: 1,
                            color: color,
                        }),
                        points: 3,
                        radius: 8,
                        //angle: Math.PI / 4
                    }),
                    zIndex: 999,
                });

        }
    }

    createEventsLayer() {
        const styleCache = [];
        const eventsLayer = new Vector({
            source: new VectorSource({}),
            style: (feature, resolution) => {
                var poi : Poi = feature.get("poi");
                var text = poi.poiId;
                if (!styleCache[text]) {
                    styleCache[text] = [
                        this.getStyleOfPoi(poi)
                    ];
                }
                return styleCache[text];
            },
        });
        return eventsLayer;
    }

    createGroupedEventsLayer() {
        const styleCache = [];
        const groupedEventsLayer = new Vector({
            source: new VectorSource({}),
            style: (feature, resolution) => {
                var id = feature.getId();
                var text = feature.get("trackLocation");
                var trendline = feature.get("trendLine");
                var valueAtLastDate = Math.round(trendline.valueAtLastDate);
                var gradient = trendline.gradient;
                var colour =
                    gradient < 0.2
                        ? "rgba(200, 55, 150, 0.1)"
                        : gradient < 1.5
                        ? "rgba(200, 55, 150, " + gradient / 2 + ")"
                        : "rgba(255, 55, 150, 0.75)";
                if (!styleCache[id]) {
                    styleCache[id] = [
                        new Style({
                            text: new Text({
                                font: "12px Calibri,sans-serif",
                                text: valueAtLastDate + "mg",
                                textAlign: "left",
                                offsetX: 10,
                                fill: new Fill({
                                    color: "#000",
                                }),
                                stroke: new Stroke({
                                    color: "#fff",
                                    width: 3,
                                }),
                            }),
                            image: new Circle({
                                fill: new Fill({
                                    color: colour,
                                }),
                                stroke: new Stroke({
                                    width: 1,
                                    color: colour,
                                }),
                                radius: 5 + valueAtLastDate / 20,
                            }),
                            zIndex: 999,
                        }),
                    ];
                }
                return styleCache[id];
            },
        });
        return groupedEventsLayer;
    }

    createImportLayer() {
        const styleCache = [];
        const importLayer = new Vector({
            source: new VectorSource({}),
            style: (feature, resolution) => {
                var text = feature.getId();
                var dateTime = feature.get("DateTime");
                var speed = feature.get("speed");
                if (!styleCache[text]) {
                    styleCache[text] = [
                        new Style({
                            stroke: new Stroke({
                                color: "#9c0",
                                width: 2,
                            }),
                            text: new Text({
                                font: "12px Calibri,sans-serif",
                                text: feature.get("DateTime"),
                                textAlign: "left",
                                offsetX: 10,
                                fill: new Fill({
                                    color: "#000",
                                }),
                                stroke: new Stroke({
                                    color: "#fff",
                                    width: 3,
                                }),
                            }),
                            image: new Circle({
                                fill: new Fill({
                                    color: "rgba(0, 0, 180, 0.5)",
                                }),
                                stroke: new Stroke({
                                    width: 1,
                                    color: "rgba(0, 0, 180, 0.5)",
                                }),
                                radius: 5,
                            }),
                            zIndex: 999,
                        }),
                    ];
                }
                return styleCache[text];
            },
        });
        return importLayer;
    }

    createHighlightLayer() {
        const styleCache = [];
        const highlightLayer = new Vector({
            source: new VectorSource(),
            style: (feature, resolution) => {
                var text = resolution < 5000 ? feature.get("name") : "";
                if (!styleCache[text]) {
                    styleCache[text] = [
                        new Style({
                            fill: new Fill({
                                color: "rgba(255, 255, 255, 0.1)",
                            }),
                            stroke: new Stroke({
                                color: "#FF0000",
                                width: 2,
                            }),
                            text: new Text({
                                font: "12px Calibri,sans-serif",
                                text: text,
                                fill: new Fill({
                                    color: "#000",
                                }),
                                stroke: new Stroke({
                                    color: "#fff",
                                    width: 3,
                                }),
                            }),
                            image: new Circle({
                                fill: new Fill({
                                    color: "rgba(224, 224, 0, 0.8)",
                                }),
                                stroke: new Stroke({
                                    width: 3,
                                    color: "rgba(100, 28, 75, 0.8)",
                                }),
                                radius: 7,
                            }),
                            zIndex: 999,
                        }),
                    ];
                }
                return styleCache[text];
            },
        });
        return highlightLayer;
    }

    createRqLayer() {
        const styleCache = [];
        const rqLayer = new Vector({
            source: new VectorSource(),
            style: (feature, resolution) => {
                var name = feature.get("name");
                if (!styleCache[name]) {
                    styleCache[name] = [
                        new Style({
                            stroke: new Stroke({
                                color: feature.get("stroke"),
                                width: parseInt(feature.get("stroke-width")),
                            }),
                            zIndex: 999,
                        }),
                    ];
                }
                return styleCache[name];
            },
        });
        return rqLayer;
    }

    creategEventsLayer() {
        const styleCache = [];
        const gEventsLayer = new Vector({
            source: new VectorSource(),
            style: (feature, resolution) => {
                var name = feature.get("name");
                if (!styleCache[name]) {
                    styleCache[name] = [
                        new Style({
                            stroke: new Stroke({
                                color: "#eb1", // orange
                                width: 6,
                            }),
                            zIndex: 999,
                        }),
                    ];
                }
                return styleCache[name];
            },
        });
        return gEventsLayer;
    }

    createGpsMatchLayer() {
        const styleCache = [];
        const gpsMatchLayer = new Vector({
            source: new VectorSource({}),
            style: (feature, resolution) => {
                var id = feature.getId();
                var type = feature.get("type"); // Get type of point (raw|route) from feature for styling.
                if (!styleCache[id]) {
                    var colour =
                        type === "raw"
                            ? "rgba(0, 55, 200, 0.8)"
                            : "rgba(0, 130, 200, 0.8)";
                    styleCache[id] = [
                        new Style({
                            image: new Circle({
                                fill: new Fill({
                                    color: colour,
                                }),
                                stroke: new Stroke({
                                    width: 1,
                                    color: colour,
                                }),
                                radius: 6,
                            }),
                            zIndex: 999,
                        }),
                    ];
                }
                return styleCache[id];
            },
        });
        return gpsMatchLayer;
    }

    setEventsLayer(pois) {
        this.eventsLayer.getSource().clear();

        for (const poi of pois) {
            var f = new Feature({
                geometry: new Point(
                    fromLonLat([poi.location[1], poi.location[0]])
                ),
                eventid: poi.poiId,
                poi: poi
            });
            f.setId(poi.poiId);
            this.eventsLayer.getSource().addFeature(f);
        }
    }

    setGroupedEventsLayer(groupedEvents) {
        this.groupedEventsLayer.getSource().clear();

        for (const ge of groupedEvents) {
            var f = new Feature({
                geometry: new Point(
                    fromLonLat([ge.location[1], ge.location[0]])
                ),
                trackLocation: ge.trackLocation,
                numEvents: ge.numPois,
                trendLine: ge.trendLine,
            });
            f.setId(ge.poiId);
            this.groupedEventsLayer.getSource().addFeature(f);
        }
    }

    zoomToFeature(feature : Feature) {
        if (feature) {
            let center = getCenter(feature.getGeometry().getExtent());
            this.Map.getView().setCenter(center);
            this.Map.getView().setZoom(12);
        }
    }

    zoomToEvent(poiID : number) {
        if (!poiID) return;
        var feature = this.eventsLayer.getSource().getFeatureById(poiID);
        if (feature) {
            this.zoomToFeature(feature);
            this.highlightFeature(feature);
        }
    }

    highlightFeature(feature) {
        this.highlightLayer.getSource().clear();
        this.highlightLayer.getSource().addFeature(feature);
    }
}
