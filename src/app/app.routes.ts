import { Routes } from '@angular/router';
import { DashboardCitoyen } from './components/dashboard-citoyen/dashboard-citoyen';
import { InscriptionComponent } from './components/auth/inscription/inscription-component/inscription-component';
import { SignalerProbleme } from './components/signalement/signaler-probleme/signaler-probleme';
import { SignalementSuccess } from './components/signalement/signalement-success/signalement-success';
import { MesSignalement } from './components/signalement/mes-signalement/mes-signalement';
import { Connexion } from './components/auth/connexion/connexion';
import { DashboardCitoyenConnecter } from './components/dashboard-citoyen-connecter/dashboard-citoyen-connecter';

export const routes: Routes = [
  {path: '', component: DashboardCitoyen},
  {path: 'home', component: DashboardCitoyenConnecter},
  {path: 'inscription', component: InscriptionComponent},
  {path: 'connexion', component: Connexion},
  {path: 'signaler-probleme', component: SignalerProbleme},
  {path: 'signalement-success', component: SignalementSuccess},
  {path: 'signalements', component: MesSignalement},

];
