import { Component } from '@angular/core';
import { Sidebar } from '../../sidebar/sidebar';
import { NavSidebar } from '../../nav-sidebar/nav-sidebar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Sidebar, NavSidebar],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {}
