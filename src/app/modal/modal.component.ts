import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @Input() title: string = '';
  @Output() close: EventEmitter<boolean> = new EventEmitter(false);

  constructor() { }

  ngOnInit(): void {
    //
  }

  closeModal(): void {
    this.close.emit(true);
  }

}
