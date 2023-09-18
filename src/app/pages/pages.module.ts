import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PagesRoutes } from './pages.routing.module';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';
import { AppDashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { WordComponent } from './word/word.component';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { WordCreateComponent } from './word/word-create/word-create.component';
import { MeaningComponent } from './word/meaning/meaning.component';
import format from 'date-fns/format';

@NgModule({
  declarations: [AppDashboardComponent, HomeComponent,WordComponent, WordCreateComponent, MeaningComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    NgApexchartsModule,
    MatSelectModule,
    RouterModule.forChild(PagesRoutes),
    TablerIconsModule.pick(TablerIcons),
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
  
  ],
  exports: [TablerIconsModule],
})
export class PagesModule {}
