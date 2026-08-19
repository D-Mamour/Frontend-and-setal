import { Component, inject, OnInit, signal } from '@angular/core';
import { Navbar } from "../../navbar/navbar";
import { GeolocalisationError, GeolocalisationService } from '../../../Services/geolocalisation.service';

@Component({
  selector: 'app-signalement-map',
  imports: [Navbar],
  templateUrl: './signalement-map.html',
  styleUrl: './signalement-map.css',
})
export class SignalementMap {}
