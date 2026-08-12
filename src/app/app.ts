import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ListeSignalement } from './components/liste-signalement/liste-signalement';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend-and-setal');
}
