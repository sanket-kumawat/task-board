import { Component, OnInit } from '@angular/core';
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
import { CardModule } from '../../components/card/card.module';
import { taskStatus } from '../../constants/taskStatus';
import { Task } from '../../types/task';
import { MatDialog } from '@angular/material/dialog';
import { TaskFormModalComponent } from '../../components/task-form-modal/task-form-modal.component';
import { ApiService } from '../../services/api.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    MatButtonModule,
    MatIconModule,
    CardModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  toDoList: Task[] = [];
  inProgressList: Task[] = [];
  inReviewList: Task[] = [];
  doneList: Task[] = [];

  taskStatus = taskStatus;

  constructor(
    public dialog: MatDialog,
    private apiService: ApiService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getTaskList();
  }

  getTaskList() {
    this.apiService
      .getTaskList()
      .pipe(
        map((responseData) => {
          const taskArray = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              taskArray.push({ ...responseData[key], id: key });
            }
          }
          return taskArray;
        })
      )
      .subscribe((response) => {
        this.filterTaskList(response);
      });
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
      this.apiService.updateTask(movedTask).subscribe((response) => {
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
    console.log($event);
    this.openTaskForm($event);
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
          this.apiService.createTask(result).subscribe((response) => {
            this.openSnackBar('Task created successfully');
            this.toDoList.push({ ...result, id: response.name });
          });
        } else {
          this.apiService
            .updateTask(result)
            .subscribe((response) => console.log(response));
        }
      }
    });
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'Dismiss', {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 3000,
    });
  }
}
