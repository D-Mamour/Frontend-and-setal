import { Routes } from '@angular/router';

import { AjouterMembre } from './components/ajouter-membre/ajouter-membre';
import { AdminSecurite } from './components/admin/admin-securite/admin-securite';
import { AdminAnalyse } from './components/admin/admin-analyse/admin-analyse';
import { Dashboard } from './components/admin/dashboard/dashboard';
import { DashboardCitoyen } from './components/citoyen/dashboard-citoyen/dashboard-citoyen';
import { DashboardCitoyenConnecter } from './components/citoyen/dashboard-citoyen-connecter/dashboard-citoyen-connecter';
import { Connexion } from './components/citoyen/auth/connexion/connexion';
import { InscriptionComponent } from './components/citoyen/auth/inscription/inscription-component/inscription-component';
import { MesSignalement } from './components/citoyen/signalement/mes-signalement/mes-signalement';
import { SignalerProbleme } from './components/citoyen/signalement/signaler-probleme/signaler-probleme';
import { SignalementSuccess } from './components/citoyen/signalement/signalement-success/signalement-success';
import { GestionSignalement } from './components/admin/gestion-signalement/gestion-signalement';
import { Layout } from './components/admin/layout/layout';
import { LoginAdmin } from './components/admin/login-admin/login-admin';
import { Dashboard } from './components/admin/dashboard/dashboard';
import { DashboardCitoyenConnecter } from './components/citoyen/dashboard-citoyen-connecter/dashboard-citoyen-connecter';
import { Layout } from './components/admin/layout/layout';
import { GestionSignalement } from './components/gestion-signalement/gestion-signalement';
import { AdminSecurite } from './components/admin-securite/admin-securite';
import {AdminAnalyse} from './components/admin-analyse/admin-analyse';
import { AjouterMembre } from './components/ajouter-membre/ajouter-membre';

export const routes: Routes = [

  // ESPACE CITOYEN
  {path: '', component: DashboardCitoyen},
  {path: 'home', component: DashboardCitoyenConnecter},
  {path: 'inscription', component: InscriptionComponent},
  {path: 'connexion', component: Connexion},
  {path: 'signaler-probleme', component: SignalerProbleme},
  {path: 'signalement-success', component: SignalementSuccess},
  {path: 'signalements', component: MesSignalement},

  //ESPACE AGENT
  {path: 'agent/signalements', component: ListeSignalement},
  {path: 'agent/signalements/detail', component: SignalementDetails},
  {path: 'agent/signalements/map', component: SignalementMap},


  // ESPACE ADMIN
  {path: 'admin/login', component: LoginAdmin},
  {path: 'ajouter-membre', component: AjouterMembre},

  {
    path: 'admin', component: Layout,
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'signalements', component: GestionSignalement},
      { path: 'signalements/detail', component: SignalementDetailAdmin},
      { path: 'statistiques', component: AdminAnalyse},
      { path: 'parametres', component: AdminSecurite},
    ],
  },

  // fallback: redirige vers l'accueil si la route n'existe pas
  { path: '**', redirectTo: '', pathMatch: 'full' },

];
