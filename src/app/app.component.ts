import { Component } from "@angular/core";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
})
export class AppComponent {
    title = "app";

    onMapReady(e) {
        console.log("Map ready");
        console.log(e);
    }
}
