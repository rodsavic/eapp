import { Routes } from '@angular/router';
import { AppDashboardComponent } from './dashboard/dashboard.component';
import { WordComponent } from './word/word.component';
import { HomeComponent } from './home/home.component';

export const PagesRoutes: Routes = [
  {
    path:'',
    component: HomeComponent,
  },
  {
    path: 'dashboard',
    component: AppDashboardComponent,
    data: {
      title: 'Starter Page',
    },
  },
  {
    path:'word',
    component: WordComponent,
    data:{
      title: 'Word Page'
    }
  }
];
