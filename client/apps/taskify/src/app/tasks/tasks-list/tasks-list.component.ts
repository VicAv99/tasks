import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Task } from '@tasks/core-data';

@Component({
  selector: 'tasks-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss']
})
export class TasksListComponent {
  @Input() tasks: Task[];
  @Output() selected = new EventEmitter();
  @Output() deleted = new EventEmitter();

  select(task: Task) {
    this.selected.emit(task);
  }

  delete(taskId: string, event: any) {
    event.stopImmediatePropagation();
    this.deleted.emit(taskId);
  }
}
