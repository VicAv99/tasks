import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { TasksService } from './tasks/tasks.service';

@NgModule({
  imports: [CommonModule, HttpClientModule],
  providers: [TasksService]
})
export class CoreDataModule {}
