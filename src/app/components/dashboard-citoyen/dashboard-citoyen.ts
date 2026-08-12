import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-dashboard-citoyen',
  imports: [RouterLink, Navbar],
  templateUrl: './dashboard-citoyen.html',
  styleUrl: './dashboard-citoyen.css',
})
export class DashboardCitoyen {}
