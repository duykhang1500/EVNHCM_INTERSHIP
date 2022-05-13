import { Component, Input } from '@angular/core';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { AppMainComponent } from '../../app.main.component';
import { AppComponent } from '../../app.component';
import { MessageService } from 'primeng/api';
import { iComponentBase } from 'src/app/modules/compoents-customer-module/components-customer';

@Component({
    selector: 'app-inline-menu',
    templateUrl: './app.inlinemenu.component.html',
    animations: [
        trigger('menu', [
            state('hiddenAnimated', style({
                height: '0px',
                paddingBottom: '0px',
                overflow: 'hidden'
            })),
            state('visibleAnimated', style({
                height: '*',
                overflow: 'visible'
            })),
            state('visible', style({
                opacity: 1,
                'z-index': 100
            })),
            state('hidden', style({
                opacity: 0,
                'z-index': '*'
            })),
            transition('visibleAnimated => hiddenAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
            transition('hiddenAnimated => visibleAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
            transition('visible => hidden', animate('.1s linear')),
            transition('hidden => visible', [style({transform: 'scaleY(0.8)'}), animate('.12s cubic-bezier(0, 0, 0.2, 1)')])
        ])
    ]
})
export class AppInlineMenuComponent extends iComponentBase {
    @Input() key = 'inline-menu';
    @Input() style: any;
    @Input() styleClass: string;

    active: boolean;
    tenDVQL: any;
    maDVQL: any;
    userName: any;
    fullName: any;

    constructor(public appMain: AppMainComponent,
        public app: AppComponent,
        public msg: MessageService
    ) {
        super(msg);
        this.tenDVQL = this.getUserInformation()[0].SUBDIVISIONNAME;
        this.maDVQL = this.getUserInformation()[0].SUBDIVISIONID;
        this.userName = this.getUserInformation()[0].USERNAME;
        this.fullName = this.getUserInformation()[0].FULLNAME;
    }

    onClick(event) {
        this.appMain.onInlineMenuClick(event, this.key);
        event.preventDefault();
    }

    get isTooltipDisabled() {
        return !(this.appMain.isSlim() && !this.appMain.isMobile());
    }

    get tabIndex() {
        return !this.appMain.inlineMenuActive  ? '-1' : null;
    }

    isHorizontalActive() {
       return this.appMain.isHorizontal() && !this.appMain.isMobile();
    }
}
