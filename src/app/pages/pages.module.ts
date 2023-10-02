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
import { WordUpdateComponent } from './word/word-update/word-update.component';
import { TypeComponent } from './type/type.component';
import { CookieService } from 'ngx-cookie-service';
import { PhraseCreateComponent } from './word/phrase-create/phrase-create.component';
import { SentenceComponent } from './sentence/sentence.component';
import { CreateSenteceComponent } from './sentence/create-sentece/create-sentece.component';
import { UpdateSenteceComponent } from './sentence/update-sentece/update-sentece.component';

@NgModule({
  declarations: [AppDashboardComponent, HomeComponent,WordComponent, WordCreateComponent, MeaningComponent, WordUpdateComponent, TypeComponent, PhraseCreateComponent, SentenceComponent, CreateSenteceComponent, UpdateSenteceComponent],
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
  providers: [CookieService],
})
export class PagesModule {}
