import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndiaInfoComponent } from './india-info/india-info.component';

const routes: Routes = [
  {path: 'indiaInfo' , component: IndiaInfoComponent},
  {path: '', redirectTo: 'indiaInfo', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
