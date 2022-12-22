import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SchedulerComponent } from '../../pages/scheduler/scheduler.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { CreateScheduleComponent } from './create-schedule/create-schedule.component';

const routes: Routes = [
  {
    path: '',
    component: SchedulerComponent
  }
]

@NgModule({
  declarations: [
    SchedulerComponent,
    CreateScheduleComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  providers: [DatePipe]
})
export class ScheduleMasterModule { }
