import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrentComponent } from './current/current.component';



@NgModule({
  declarations: [
    CurrentComponent
  ],
  imports: [
    CommonModule,
  ],
  exports:[
    CurrentComponent
  ]
})
export class CurrentModule { }
