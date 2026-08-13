import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SignalementDetailAdmin } from './components/signalement-detail-admin/signalement-detail-admin';

@Component({
  selector: 'app-root',
  imports: [SignalementDetailAdmin],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend-and-setal');
}
