import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit, OnDestroy {
  @Output() close: EventEmitter<boolean> = new EventEmitter(false);
  @Input() title: string = '';
  @Input() msg: string = '';

  constructor() { }

  ngOnInit(): void {
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  closeModal(): void {
    this.close.emit(true);
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeModal();
    }
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
  }
}
