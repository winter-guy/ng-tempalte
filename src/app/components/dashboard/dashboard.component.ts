import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  imports: [MatSidenavModule, MatButtonModule],
  templateUrl: './dashboard.component.html',
  styles: ``
})
export class DashboardComponent {
  showFiller = false;
}
