import { Sort } from "@angular/material/sort";
import { Poi } from "src/models/dto";

export class PoiSorting {

    // Create a sort function for Pois.
    // src - A func that will return an array of Pois to be sorted.
    // callback - A func that will be called with the new sortedPois and new sort

    public static createSortDataFunc = (
        src : () => Poi[],
        callback : (( sortedPois : Poi[], sort : Sort) => void)) => {
        return (sort: Sort) => {
            console.log("Sort function called");
            console.log(sort);
            const pois : Poi[] = src();
            if (!pois) {
                console.log("no data yet");
                return;
            }

            const sorted : Poi[] =
                (!sort.active || sort.direction === "")
                ? pois.slice()
                : pois.sort((a, b) => PoiSorting.comparePoiByColumn(a, b, sort));

            callback(sorted, sort);
        }
    }

    public static comparePoiByColumn(a: Poi, b: Poi, sort: Sort) {

        const compare = (
            a: number | string | Date,
            b: number | string | Date,
            isAsc: boolean
        ) => (a < b ? -1 : 1) * (isAsc ? 1 : -1);

        const isAsc = sort.direction === "asc";
        switch (sort.active) {
            case "poiId":
                return compare(a.poiId, b.poiId, isAsc);
            case "deviceName":
                return compare(a.deviceName, b.deviceName, isAsc);
            case "timestamp":
                return compare(a.timestamp, b.timestamp, isAsc);
            case "trackLocation":
                return compare(a.trackLocation, b.trackLocation, isAsc);
            case "mileageDir":
                return compare(a.mileageDir, b.mileageDir, isAsc);
            case "speed":
                return compare(a.speed, b.speed, isAsc);
            case "poiCode":
                return compare(a.poiCode, b.poiCode, isAsc);
            case "poiValue":
                return compare(a.poiValue, b.poiValue, isAsc);
            default:
                return 0;
        }
    }
}
