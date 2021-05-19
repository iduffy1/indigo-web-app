import { Poi } from "./dto";


export interface DataTrace {
    name : string;
    units : string;
    values : any[];
    indices? : any[];
}

export interface PoiData {
    poi : Poi;
    traces : DataTrace[];
}
