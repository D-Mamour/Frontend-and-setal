import { Routes } from '@angular/router';
import { AjouterMembre } from './components/admin/ajouter-membre/ajouter-membre'; 
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
import { ListeSignalement } from './components/agent/liste-signalement/liste-signalement';
import { SignalementDetails } from './components/agent/signalement-details/signalement-details';
import { SignalementMap } from './components/agent/signalement-map/signalement-map';
import { SignalementDetailAdmin } from './components/admin/signalement-detail-admin/signalement-detail-admin';

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
