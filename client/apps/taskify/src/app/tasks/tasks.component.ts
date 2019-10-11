import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { TasksService, Task } from '@tasks/core-data';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tasks-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {
  form: FormGroup;
  task: Task;
  tasks$: Observable<Task[]>;

  constructor(
    private formBuilder: FormBuilder,
    private tasksService: TasksService
  ) { }

  ngOnInit() {
    this.getTasks();
    this.initForm();
  }

  getTasks() {
    this.tasks$ = this.tasksService.all();
  }

  select(task: Task) {
    this.task = task;
    this.form.patchValue(task);
  }

  save(task: Task) {
    if (task.id) {
      this.tasksService.update(task).subscribe(_ => this.mutationReset());
      return;
    }
    this.tasksService.create(task).subscribe(_ => this.mutationReset());
  }

  deleteTask(taskId: string) {
    this.tasksService.delete(taskId).subscribe(_ => this.mutationReset());
  }

  reset() {
    this.form.reset();
  }

  private mutationReset() {
    this.getTasks();
    this.reset();
  }

  private initForm() {
    this.form = this.formBuilder.group({
      id: null,
      description: ['', Validators.required]
    }, {updateOn: 'submit'});
  }

}
