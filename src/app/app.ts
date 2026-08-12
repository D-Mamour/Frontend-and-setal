import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardCitoyen } from './components/dashboard-citoyen/dashboard-citoyen';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DashboardCitoyen],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend-and-setal');
}
