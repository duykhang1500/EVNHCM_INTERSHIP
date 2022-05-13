import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { trigger, style, transition, animate, AnimationEvent } from '@angular/animations';
import { MegaMenuItem, MessageService } from 'primeng/api';
import { AppComponent } from '../../app.component';
import { AppMainComponent } from '../../app.main.component';
import { Router } from '@angular/router';
import * as API from 'src/app/services/apiURL';
import { iServiceBase, ShareData, iComponentBase } from 'src/app/modules/compoents-customer-module/components-customer';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    animations: [
        trigger('topbarActionPanelAnimation', [
            transition(':enter', [
                style({ opacity: 0, transform: 'scaleY(0.8)' }),
                animate('.12s cubic-bezier(0, 0, 0.2, 1)', style({ opacity: 1, transform: '*' })),
            ]),
            transition(':leave', [
                animate('.1s linear', style({ opacity: 0 }))
            ])
        ])
    ]
})

export class AppTopBarComponent extends iComponentBase implements OnInit {
    @ViewChild('searchInput') searchInputViewChild: ElementRef;

    activeItem: number;
    lstDViNhan: any[];
    strDViNhan: string;
    strTenDNhap: any;
    lstDViQLy: any[];
    strTenDViQLy: any;
    strTenDViCTren: any;
    strMaDViQLy: any;
    strMaDViCTren: any;

    constructor(public appMain: AppMainComponent,
        public app: AppComponent,
        private router: Router,
        private shareData: ShareData,
        public iserviceBase: iServiceBase,
        public messageService: MessageService) {
        super(messageService);
        this.lstDViQLy = [];
        this.strMaDViQLy = this.getUserInformation() ? this.getUserInformation()[0].SUBDIVISIONID : "";
        this.strTenDNhap = this.getUserInformation() ? this.getUserInformation()[0].USERNAME : "";
        this.strTenDViQLy = this.getUserInformation() ? this.getUserInformation()[0].SUBDIVISIONNAME : "";
        this.strTenDViCTren = this.getUserInformation() ? this.getUserInformation()[0].SUBDIVISIONNAME_U : "";
        this.strMaDViCTren = this.getUserInformation() ? this.getUserInformation()[0].SUBDIVISIONID_U : "";

    }

    async ngOnInit() {
        var dvi_dn = localStorage.getItem('DVI_LOGIN');
        var tendvi_dn = localStorage.getItem('TEN_DVI_LOGIN');
        this.lstDViNhan = [];
        this.lstDViNhan.push({ label: dvi_dn + '-' + tendvi_dn, value: dvi_dn });
        this.strDViNhan = this.strMaDViQLy != "" ? this.strMaDViQLy : dvi_dn;

        let rowDViQly = {
            MA_DVIQLY: dvi_dn,
            TEN_DVIQLY: tendvi_dn
        }

        this.lstDViQLy.push(rowDViQly);
    }

    model: MegaMenuItem[] = [
        {
            label: 'UI KIT',
            items: [
                [
                    {
                        label: 'UI KIT 1',
                        items: [
                            { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/formlayout'] },
                            { label: 'Input', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/input'] },
                            { label: 'Float Label', icon: 'pi pi-fw pi-bookmark', routerLink: ['/uikit/floatlabel'] },
                            { label: 'Button', icon: 'pi pi-fw pi-mobile', routerLink: ['/uikit/button'] },
                            { label: 'File', icon: 'pi pi-fw pi-file', routerLink: ['/uikit/file'] }
                        ]
                    }
                ],
                [
                    {
                        label: 'UI KIT 2',
                        items: [
                            { label: 'Table', icon: 'pi pi-fw pi-table', routerLink: ['/uikit/table'] },
                            { label: 'List', icon: 'pi pi-fw pi-list', routerLink: ['/uikit/list'] },
                            { label: 'Tree', icon: 'pi pi-fw pi-share-alt', routerLink: ['/uikit/tree'] },
                            { label: 'Panel', icon: 'pi pi-fw pi-tablet', routerLink: ['/uikit/panel'] },
                            { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/uikit/charts'] }
                        ]
                    }
                ],
                [
                    {
                        label: 'UI KIT 3',
                        items: [
                            { label: 'Overlay', icon: 'pi pi-fw pi-clone', routerLink: ['/uikit/overlay'] },
                            { label: 'Media', icon: 'pi pi-fw pi-image', routerLink: ['/uikit/media'] },
                            { label: 'Menu', icon: 'pi pi-fw pi-bars', routerLink: ['/uikit/menu'] },
                            { label: 'Message', icon: 'pi pi-fw pi-comment', routerLink: ['/uikit/message'] },
                            { label: 'Misc', icon: 'pi pi-fw pi-circle-off', routerLink: ['/uikit/misc'] }
                        ]
                    }
                ]
            ]
        },
        {
            label: 'UTILITIES',
            items: [
                [
                    {
                        label: 'UTILITIES 1',
                        items: [
                            { label: 'Display', icon: 'pi pi-fw pi-desktop', routerLink: ['utilities/display'] },
                            { label: 'Elevation', icon: 'pi pi-fw pi-external-link', routerLink: ['utilities/elevation'] }
                        ]
                    },
                    {
                        label: 'UTILITIES 2',
                        items: [
                            { label: 'FlexBox', icon: 'pi pi-fw pi-directions', routerLink: ['utilities/flexbox'] }
                        ]
                    }
                ],
                [
                    {
                        label: 'UTILITIES 3',
                        items: [
                            { label: 'Icons', icon: 'pi pi-fw pi-search', routerLink: ['utilities/icons'] }
                        ]
                    },
                    {
                        label: 'UTILITIES 4',
                        items: [
                            { label: 'Text', icon: 'pi pi-fw pi-pencil', routerLink: ['utilities/text'] },
                            { label: 'Widgets', icon: 'pi pi-fw pi-star-o', routerLink: ['utilities/widgets'] }
                        ]
                    }
                ],
                [
                    {
                        label: 'UTILITIES 5',
                        items: [
                            { label: 'Grid System', icon: 'pi pi-fw pi-th-large', routerLink: ['utilities/grid'] },
                            { label: 'Spacing', icon: 'pi pi-fw pi-arrow-right', routerLink: ['utilities/spacing'] },
                            { label: 'Typography', icon: 'pi pi-fw pi-align-center', routerLink: ['utilities/typography'] }
                        ]
                    }
                ],
            ]
        }
    ];

    onSearchAnimationEnd(event: AnimationEvent) {
        switch (event.toState) {
            case 'visible':
                this.searchInputViewChild.nativeElement.focus();
                break;
        }
    }

    async getDviqly() {
        var dvi_dn = localStorage.getItem('DVI_LOGIN');
        let inputparam = {
            MA_DVIQLY: dvi_dn,
            LOAI: "ONG"
        };
        let response = await this.iserviceBase.getData_AsyncByPostRequest(API.PHAN_HE.QTRIHTHONG, API.API_QTHT.GET_DVI_QLY, inputparam);
        if (response) {
            if (typeof response.length !== undefined && response.length > 0) {
                for (let i = 0; i < response.length; i++) {
                    this.lstDViNhan.push({ label: response[i].MA_DVIQLY + '-' + response[i].TEN_DVIQLY, value: response[i].MA_DVIQLY });
                    let rowDViQly = {
                        MA_DVIQLY: response[i].MA_DVIQLY,
                        TEN_DVIQLY: "  " + response[i].TEN_DVIQLY
                    }
                    this.lstDViQLy.push(rowDViQly);
                }
            }
        }
    }

    logOut(event) {
        localStorage.removeItem('USER_INFO');
        localStorage.removeItem('MENU_INFO');
        localStorage.removeItem('THAM_SO_HT');
        localStorage.removeItem('THANG_NAM_HT');
        sessionStorage.removeItem('SESSIONID');
        sessionStorage.removeItem('TIME_LOGIN');
        localStorage.clear();
        localStorage.setItem('VERSION', " 31.10.2021");
        event.preventDefault();
        this.router.navigate(['/login']);
    }

    async clearFilter() {
        //Set lai thong tin user
        let param = { MA_DVIQLY: this.strDViNhan };
        let inputparam = {
            MA_DVIQLY: this.strDViNhan,
            LOAI: ""
        };

        let responseDvi = await this.iserviceBase.getData_AsyncByPostRequest(API.PHAN_HE.QTRIHTHONG, API.API_QTHT.GET_DVI_QLY, inputparam);
        if (responseDvi) {
            if (typeof responseDvi.length !== undefined && responseDvi.length > 0) {
                var userInfor = JSON.parse(localStorage.getItem('USER_INFO'));
                userInfor[0].SUBDIVISIONID = responseDvi[0].MA_DVIQLY;
                userInfor[0].SUBDIVISIONNAME = responseDvi[0].TEN_DVIQLY;
                userInfor[0].SUBDIVISIONLEVEL = responseDvi[0].CAP_DVI;
                userInfor[0].SUBDIVISIONID_U = responseDvi[0].MA_DVICTREN;
                userInfor[0].SUBDIVISIONNAME_U = this.strTenDViQLy;

                localStorage.removeItem('USER_INFO');
                localStorage.setItem('USER_INFO', JSON.stringify(userInfor));
            }
        }

        this.iserviceBase.getDataByPostRequest(API.PHAN_HE.QTRIHTHONG, API.API_QTHT.GET_THANG_NAM_LV, param)
            .subscribe((responseThangLviec: any) => {
                localStorage.removeItem('THANG_NAM_HT');
                localStorage.setItem('THANG_NAM_HT', JSON.stringify(responseThangLviec));
            });

        //Load thông số hệ thống
        this.iserviceBase.getDataByPostRequest(API.PHAN_HE.QTRIHTHONG, API.API_QTHT.GET_ALL_PARAMETER, param)
            .subscribe((responseThamSoHeThong: any) => {
                localStorage.removeItem('THAM_SO_HT');
                localStorage.setItem('THAM_SO_HT', JSON.stringify(responseThamSoHeThong));
            });
    }

    thayDoiDvi() {
        this.shareData.sendMessage("123");
        this.router.navigateByUrl("/Home");
    }

}
