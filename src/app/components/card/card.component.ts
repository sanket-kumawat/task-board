import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Task } from '../../types/task';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input() cardConfig: Task = {
    id: '',
    task: '',
    status: '',
    assignedTo: '',
  };

  @Output() editTask: EventEmitter<Task> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  onEditTask() {
    this.editTask.emit(this.cardConfig);
  }
}
