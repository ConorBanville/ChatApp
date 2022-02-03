import { Component, Output, Input, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email-password-form',
  templateUrl: './email-password-form.component.html',
  styleUrls: ['./email-password-form.component.css']
})
export class EmailPasswordFormComponent{

  constructor(private router: Router) {}

  // Object to send data to parent
  @Output() formData: EventEmitter<any> = new EventEmitter();
  
  // Recieve data from parent
  @Input() formVariables: any;
  @Input() anchorVariables: any;

  // Pass form data to parent using the EventEmitter
  Emit(formData:any)
  {
    this.formData.emit(formData);
  }
}