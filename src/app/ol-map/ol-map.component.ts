import {Component, NgZone, AfterViewInit, Output, Input, EventEmitter, ChangeDetectorRef } from '@angular/core';

import {View, Map, Feature } from 'ol';
import { ScaleLine, defaults as DefaultControls} from 'ol/control';
import {Coordinate} from 'ol/coordinate';
import {Extent} from 'ol/extent';
import GeoJSON from 'ol/format/GeoJSON';
import Point from 'ol/geom/Point';
import {Vector as VectorLayer, Tile as TileLayer} from 'ol/layer';
import {fromLonLat, get as GetProjection} from 'ol/proj'
import Projection from 'ol/proj/Projection';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import { Fill, Stroke, Circle, Style, Text } from 'ol/style';

import { GroupedEvent, Poi } from 'src/models/dto';
import { IndigoDataService } from '../indigo-data.service';

@Component({
  selector: 'app-ol-map',
  templateUrl: './ol-map.component.html',
  styleUrls: ['./ol-map.component.scss']
})
export class OlMapComponent implements  AfterViewInit {

  @Input() center: Coordinate;
  @Input() zoom: number;
  view: View;
  projection: Projection;
  extent: Extent = [-20026376.39, -20048966.10, 20026376.39, 20048966.10];
  Map: Map;
  @Output() mapReady = new EventEmitter<Map>();

  eventsLayer : VectorLayer;
  groupedEventsLayer : VectorLayer;

  showLocation = true;
  public pois: Poi[];
  public groupedEvents : GroupedEvent[];

  constructor(
    private zone: NgZone,
    private cd: ChangeDetectorRef,
    private indigoDataService: IndigoDataService) { }


  ngAfterViewInit():void {
    if (! this.Map) {
      this.zone.runOutsideAngular(() => this.initMap())
    }
    setTimeout(()=>this.mapReady.emit(this.Map));
  }

  private initMap(): void{
    //proj4.defs("EPSG:3857","+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs");
    //register(proj4)

    this.projection = GetProjection('EPSG:3857');
    this.projection.setExtent(this.extent);
    this.view = new View({
      center: fromLonLat(this.center),
      zoom: this.zoom,
      projection: this.projection,
    });

    this.eventsLayer = this.createEventsLayer();
    this.groupedEventsLayer = this.createGroupedEventsLayer();

    this.Map = new Map({
      layers: [
        new TileLayer({
          source: new OSM({url : 'http://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'})
        }),
        this.createTrackLayer(),
        this.createRouteLayer(),
        this.createMilepostLayer(),
        this.eventsLayer,
        this.createHighlightLayer(),
        this.groupedEventsLayer,
        this.createImportLayer(),
        this.createGpsMatchLayer()
      ],
      target: 'map',
      view: this.view,
      controls: DefaultControls().extend([
        new ScaleLine({}),
      ]),
    });
    this.onMapReady(null);
  }

  onMapReady(e) {
    console.log('OnMap Ready');
    console.log(e);

    this.indigoDataService.poisChanged.subscribe({
      next: (pois) => this.setEventsLayer(pois)
    });

    this.indigoDataService.groupedEventsChanged.subscribe({
      next: (groupedEvents) => this.setGroupedEventsLayer(groupedEvents)
    })

    this.indigoDataService.loadEvents();
    this.indigoDataService.loadEventGroups();
  }

  createTrackLayer() {
    const styleCache = [];
    const trackLayer = new VectorLayer({
      //projection: 'EPSG:900913',
      source: new VectorSource({
        url: '/map/NetworkLinks.shp.json',
        format: new GeoJSON()
      }),
      style: (feature, resolution) => {
        var text = resolution < 5000 ? 'track' : '';
        if (!styleCache[text]) {
          styleCache[text] = [new Style({
            fill: new Fill({
              color: 'rgba(255, 255, 255, 0.1)'
            }),
            stroke: new Stroke({
              color: '#319FD3',
              width: 1
            }),
            zIndex: 999
          })];
        }
        return styleCache[text];
      }
    });
    return trackLayer;
  }

  createRouteLayer() {
    const styleCache = [];
    const routeLayer = new VectorLayer({
      source: new VectorSource({
//          projection: 'EPSG:900913',
          url: '/map/NetworkReferenceLines.shp.json',
          format: new GeoJSON()
      }),
      style: (feature, resolution) => {
        var text = resolution < 5000 ? 'route' : '';
        if (!styleCache[text]) {
          styleCache[text] = [new Style({
            fill: new Fill({
              color: 'rgba(255, 255, 255, 0.1)'
            }),
            stroke: new Stroke({
              color: '#D39F91',
              width: 1
            }),
            zIndex: 999
          })];
        }
        return styleCache[text];
      }
    });
    return routeLayer;
  }

  createMilepostLayer() {
    const styleCache = [];
    const pointLayer = new VectorLayer({
      source: new VectorSource({
        //projection: 'EPSG:900913',
        url: '/map/NetworkWaymarks.shp.json',
        format: new GeoJSON()
      }),
      maxResolution: 20,
      style: (feature, resolution) => {
        var text = this.showLocation ? feature.get('Mileage') : "";

        if (!styleCache[text]) {
          styleCache[text] = [new Style({
            text: new Text({
                font: '12px Calibri,sans-serif',
                text: text,
                textAlign: "right",
                offsetX: -10,
                fill: new Fill({
                    color: '#000'
                }),
                stroke: new Stroke({
                    color: '#fff',
                    width: 3
                })
            }),
            image: new Circle({
              fill: new Fill({
                color: 'rgba(55, 200, 150, 0.5)'
              }),
              stroke: new Stroke({
                width: 1,
                color: 'rgba(55, 200, 150, 0.8)'
              }),
              radius: 6
            }),
            zIndex: 999
          })];
        }
        return styleCache[text];
      }
    });
    return pointLayer;
  }

  createEventsLayer() {
    const styleCache = [];
    const eventsLayer = new VectorLayer({
      source: new VectorSource({}),
      style: (feature, resolution) => {
        var text = feature.get('eventid');
        if (!styleCache[text]) {
            styleCache[text] = [new Style({
                image: new Circle({
                    fill: new Fill({
                        color: 'rgba(200, 55, 150, 0.8)'
                    }),
                    stroke: new Stroke({
                        width: 1,
                        color: 'rgba(200, 55, 150, 0.8)'
                    }),
                    radius: 6
                }),
                zIndex: 999
            })];
        }
        return styleCache[text];
      }
    });
    return eventsLayer;
  }

  createGroupedEventsLayer() {
    const styleCache = [];
    const groupedEventsLayer = new VectorLayer({
      source: new VectorSource({}),
      style: (feature, resolution) => {
        var id = feature.getId();
        var text = feature.get('trackLocation');
        var trendline = feature.get('trendLine');
        var valueAtLastDate = Math.round(trendline.valueAtLastDate)
        var gradient = trendline.gradient;
        var colour = gradient < 0.2 ? 'rgba(200, 55, 150, 0.1)' :
            gradient < 1.5 ? 'rgba(200, 55, 150, ' + gradient/2 + ')' :
                'rgba(255, 55, 150, 0.75)'
        if (!styleCache[id]) {
          styleCache[id] = [new Style({
            text: new Text({
                font: '12px Calibri,sans-serif',
                text: valueAtLastDate + 'mg',
                textAlign: "left",
                offsetX: 10,
                fill: new Fill({
                    color: '#000'
                }),
                stroke: new Stroke({
                    color: '#fff',
                    width: 3
                })
            }),
            image: new Circle({
                fill: new Fill({
                    color: colour
                }),
                stroke: new Stroke({
                    width: 1,
                    color: colour
                }),
                radius: 5 + (valueAtLastDate / 20)
            }),
            zIndex: 999
          })];
        }
        return styleCache[id];
      }
    });
    return groupedEventsLayer;
  }

  createImportLayer() {
    const styleCache = [];
    const importLayer = new VectorLayer({
      source: new VectorSource({}),
      style: (feature, resolution) => {
        var text = feature.getId();
        var dateTime = feature.get("DateTime");
        var speed = feature.get("speed");
        if (!styleCache[text]) {
          styleCache[text] = [new Style({
            stroke: new Stroke({
                color: '#9c0',
                width: 2
            }),
            text: new Text({
                font: '12px Calibri,sans-serif',
                text: feature.get('DateTime'),
                textAlign: "left",
                offsetX: 10,
                fill: new Fill({
                    color: '#000'
                }),
                stroke: new Stroke({
                    color: '#fff',
                    width: 3
                })
            }),
            image: new Circle({
                fill: new Fill({
                    color: 'rgba(0, 0, 180, 0.5)'
                }),
                stroke: new Stroke({
                    width: 1,
                    color: 'rgba(0, 0, 180, 0.5)'
                }),
                radius: 5
            }),
            zIndex: 999
          })];
        }
        return styleCache[text];
      }
    });
    return importLayer;
  }

  createHighlightLayer() {
    const styleCache = [];
    const highlightLayer = new VectorLayer({
      source: new VectorSource(),
      style: (feature, resolution) => {
        var text = resolution < 5000 ? feature.get('name') : '';
        if (!styleCache[text]) {
          styleCache[text] = [new Style({
            fill: new Fill({
              color: 'rgba(255, 255, 255, 0.1)'
            }),
            stroke: new Stroke({
              color: '#FF0000',
              width: 2
            }),
            text: new Text({
              font: '12px Calibri,sans-serif',
              text: text,
              fill: new Fill({
                color: '#000'
              }),
              stroke: new Stroke({
                color: '#fff',
                width: 3
              })
            }),
            image: new Circle({
              fill: new Fill({
                  color: 'rgba(224, 224, 0, 0.8)'
              }),
              stroke: new Stroke({
                  width: 3,
                  color: 'rgba(100, 28, 75, 0.8)'
              }),
              radius: 7
            }),
            zIndex: 999
          })];
        }
        return styleCache[text];
      }
    });
    return highlightLayer;
  }

  createRqLayer() {
    const styleCache = [];
    const rqLayer = new VectorLayer({
      source: new VectorSource(),
      style: (feature, resolution) => {
        var name = feature.get('name');
        if (!styleCache[name]) {
          styleCache[name] = [new Style({
            stroke: new Stroke({
              color: feature.get('stroke'),
              width: parseInt(feature.get('stroke-width'))
            }),
            zIndex: 999
          })];
        }
        return styleCache[name];
      }
    });
    return rqLayer;
  }

  creategEventsLayer() {
    const styleCache = [];
    const gEventsLayer = new VectorLayer({
      source: new VectorSource(),
      style: (feature, resolution) => {
        var name = feature.get('name');
        if (!styleCache[name]) {
          styleCache[name] = [new Style({
            stroke: new Stroke({
                color:  '#eb1', // orange
                width: 6
            }),
            zIndex: 999
          })];
        }
        return styleCache[name];
      }
    });
    return gEventsLayer;
  }

  createGpsMatchLayer() {
    const styleCache = [];
    const gpsMatchLayer = new VectorLayer({
      source: new VectorSource({}),
      style: (feature, resolution) => {
        var id = feature.getId();
        var type = feature.get('type'); // Get type of point (raw|route) from feature for styling.
        if (!styleCache[id]) {
          var colour = type === 'raw' ? 'rgba(0, 55, 200, 0.8)' : 'rgba(0, 130, 200, 0.8)';
          styleCache[id] = [new Style({
              image: new Circle({
                  fill: new Fill({
                      color: colour
                  }),
                  stroke: new Stroke({
                      width: 1,
                      color: colour
                  }),
                  radius: 6
              }),
              zIndex: 999
          })];
        }
        return styleCache[id];
      }
    });
    return gpsMatchLayer;
  }


  setEventsLayer(pois) {
    this.eventsLayer.getSource().clear();

    for (const poi of pois) {
        var f = new Feature({
            geometry: new Point(fromLonLat([poi.location[1], poi.location[0]])),
            eventid: poi.poiId
        });
        f.setId(poi.poiId);
        this.eventsLayer.getSource().addFeature(f);
    }
  }

  setGroupedEventsLayer(groupedEvents) {
    this.groupedEventsLayer.getSource().clear();

    for (const ge of groupedEvents) {
      var f = new Feature({
        geometry: new Point(fromLonLat([ge.location[1], ge.location[0]])),
        trackLocation: ge.trackLocation,
        numEvents: ge.numPois,
        trendLine: ge.trendLine,
      });
      f.setId(ge.poiId);
      this.groupedEventsLayer.getSource().addFeature(f);
    }
  }
}
