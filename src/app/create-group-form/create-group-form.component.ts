import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-create-group-form',
  templateUrl: './create-group-form.component.html',
  styleUrls: ['./create-group-form.component.css']
})
export class CreateGroupFormComponent {

  constructor() { }

  @Output() emitter: EventEmitter<any> = new EventEmitter();

  Submit(data) {
    this.emitter.emit(data);
  }

  GoBack() {
    this.emitter.emit("Close");
  }
}
