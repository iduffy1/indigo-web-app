import { Sort } from "@angular/material/sort";
import { GroupedEvent } from "src/models/dto";

export class GroupedEventsSorting {
    // Create a sort function for Grouped Events.
    // src - A func that will return an array of GroupedEvents to be sorted.
    // callback - A func that will be called with the new sortedGroupedEvents and new sort

    public static createSortDataFunc = (
        src: () => GroupedEvent[],
        callback: (sortedGroupedEvents: GroupedEvent[], sort: Sort) => void) => {
        return (sort: Sort) => {
            const groupedEvents: GroupedEvent[] = src();
            if (!groupedEvents) {
                console.log("no data yet");
                return;
            }

            const sorted: GroupedEvent[] =
                !sort.active || sort.direction === ""
                    ? groupedEvents.slice()
                    : groupedEvents.sort((a, b) =>
                          GroupedEventsSorting.compareGroupedEventByColumn(a, b, sort)
                      );

            callback(sorted, sort);
        };
    };

    public static compareGroupedEventByColumn(
        a: GroupedEvent,
        b: GroupedEvent,
        sort: Sort
    ) {
        const compare = (
            a: number | string | Date,
            b: number | string | Date,
            isAsc: boolean
        ) => (a < b ? -1 : 1) * (isAsc ? 1 : -1);

        const isAsc = sort.direction === "asc";
        switch (sort.active) {
            case "latestPoiDate":
                return compare(a.latestPoiDate, b.latestPoiDate, isAsc);
            case "trackLocation":
                return compare(a.trackLocation, b.trackLocation, isAsc);
            case "mileageDir":
                return compare(a.mileageDir, b.mileageDir, isAsc);
            case "numPois":
                return compare(a.numPois, b.numPois, isAsc);
            case "poiCode":
                return compare(a.poiCode, b.poiCode, isAsc);
            case "gradient":
                return compare(
                    a.trendLine.gradient,
                    b.trendLine.gradient,
                    isAsc
                );
            case "valueAtLastDate":
                return compare(
                    a.trendLine.valueAtLastDate,
                    b.trendLine.valueAtLastDate,
                    isAsc
                );
            case "daysSinceLastDate":
                return compare(
                    a.trendLine.daysSinceLastDate,
                    b.trendLine.daysSinceLastDate,
                    isAsc
                );
            default:
                return 0;
        }
    }
}
