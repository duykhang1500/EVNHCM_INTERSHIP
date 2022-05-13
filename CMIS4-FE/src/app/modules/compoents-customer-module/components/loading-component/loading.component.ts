import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'cmis-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent  {
  public isLoadingPage: boolean = false;

  @Output() onTimeout: EventEmitter<any> = new EventEmitter<any>();
  @Input('timeout') timeout: any;
  @Input() set isLoading(value: boolean) {
    this.isLoadingPage = value; document.body.style.cursor = value ? 'wait' : 'default';
  }

  constructor() { }

  Loaded() {
    this.isLoadingPage = false;
    document.body.style.cursor = 'default';
  }
}
