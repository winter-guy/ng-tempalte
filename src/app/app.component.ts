import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SelectPreviewComponent } from "./components/select.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DashboardComponent],
  template: `
    <app-dashboard />
    <router-outlet />
  `,
  styles: [],
})
export class AppComponent {
  title = 'ng-tempalte';
}
