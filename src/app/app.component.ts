import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SelectPreviewComponent } from "./components/select.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SelectPreviewComponent],
  template: `
    <h1>Welcome to {{title}}!</h1>
      <spartan-select-preview></spartan-select-preview>
    <router-outlet />
  `,
  styles: [],
})
export class AppComponent {
  title = 'ng-tempalte';
}
