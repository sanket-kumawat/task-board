import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CardModule } from '../../components/card/card.module';
import { taskStatus } from '../../constants/taskStatus';
import { Task } from '../../types/task';
import { MatDialog } from '@angular/material/dialog';
import { TaskFormModalComponent } from '../../components/task-form-modal/task-form-modal.component';
import { map } from 'rxjs';
import { TasksService } from '../../services/tasks.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    CardModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  @ViewChild('deleteConfirmationTemplate', { static: true })
  deleteConfirmationTemplateRef!: TemplateRef<any>;
  deleteDialogRef!: MatDialogRef<any>;

  toDoList: Task[] = [];
  inProgressList: Task[] = [];
  inReviewList: Task[] = [];
  doneList: Task[] = [];

  taskStatus = taskStatus;

  constructor(
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private tasksService: TasksService
  ) {}

  ngOnInit(): void {
    this.getTaskList();
  }

  getTaskList() {
    this.tasksService
      .getAll()
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes.map((c) => ({ ...c.payload.val(), id: c.payload.key }))
        )
      )
      .subscribe((value) => this.filterTaskList(value as Task[]));
  }

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      const movedTask = event.previousContainer.data[event.previousIndex];
      movedTask.status = event.container.id.charAt(
        event.container.id.length - 1
      );
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.tasksService.update(movedTask.id, movedTask).then(() => {
        this.openSnackBar('Task status updated successfully');
      });
    }
  }

  filterTaskList(taskList: Task[]) {
    this.toDoList = this.filterTask(taskList, taskStatus.toDo);
    this.inProgressList = this.filterTask(taskList, taskStatus.inProgress);
    this.inReviewList = this.filterTask(taskList, taskStatus.inReview);
    this.doneList = this.filterTask(taskList, taskStatus.done);
  }

  filterTask(taskList: Task[], status: string) {
    return taskList.filter((task) => task.status === status);
  }

  editTask($event: Task) {
    this.openTaskForm($event);
  }

  deleteTask($event: Task) {
    this.deleteDialogRef = this.dialog.open(
      this.deleteConfirmationTemplateRef,
      {
        width: '350px',
      }
    );

    this.deleteDialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.tasksService
          .delete($event.id)
          .then(() => this.openSnackBar('Task deleted successfully'));
      }
    });
  }

  openTaskForm(data?: Task) {
    let dialogConfig: {
      data?: Task;
    } = {};

    if (data) {
      dialogConfig = { data: data };
    }

    const dialogRef = this.dialog.open(TaskFormModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.id === '') {
          this.tasksService.create(result).then((response: any) => {
            this.openSnackBar('Task created successfully');
          });
        } else {
          this.tasksService
            .update(result.id, result)
            .then(() => this.openSnackBar('Task updated successfully'));
        }
      }
    });
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'Dismiss', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration: 3000,
    });
  }
}
