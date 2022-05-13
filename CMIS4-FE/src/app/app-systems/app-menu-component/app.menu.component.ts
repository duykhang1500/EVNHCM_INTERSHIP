import { Location } from "@angular/common";
import {
    Component,
    forwardRef,
    Inject,
    Input,
    OnInit,
    ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { AppComponent } from "../../app.component";
import * as API from "src/app/services/apiURL";
import { AppMenuitemComponent } from "../app-menuitem-component/app.menuitem.component";
import { iServiceBase } from "src/app/modules/compoents-customer-module/components-customer";

@Component({
    selector: "app-menu",
    templateUrl: "./app.menu.component.html",
    styleUrls: ["./app.menu.component.scss"],
})
export class AppMenuComponent implements OnInit {
    @Input() reset: boolean;
    @ViewChild("itemMenu") itemMenu: AppMenuitemComponent;

    model: any[];
    menuF: any[];
    menuC: any[];
    menuAll: any[];
    lstCombo: any[];
    lstDMuc: any[];
    selectedMenu: any;
    itemsC: any[] = [];
    modelAll: any[] = [];

    constructor(
        @Inject(forwardRef(() => AppComponent)) public app: AppComponent,
        public serviceBase: iServiceBase,
        public router: Router,
        public location: Location
    ) {}

    ngOnInit() {
        // if (Storage != undefined) {
        //     var ipUI = sessionStorage.getItem("IP_UI");
        //     if (!sessionStorage.getItem("SESSIONID")) {
        //         if (!localStorage.getItem("SESSIONID")) {
        //             this.router.navigate(["/"]).then((result) => {
        //                 window.location.href = ipUI + "";
        //             });
        //         }
        //     }
        //     if (localStorage.getItem("USER_INFO")) {
        //         if (localStorage.getItem("DVI_LOGIN")) {
        //             var user_Info = JSON.parse(
        //                 localStorage.getItem("USER_INFO")
        //             );
        //             var SUBDIVISIONID = localStorage.getItem("DVI_LOGIN");
        //             let param = {
        //                 USERNAME: user_Info[0].USERNAME,
        //                 SUBDIVISIONID: SUBDIVISIONID,
        //             };
        //             this.model = [];
        //             this.menuF = [];
        //             this.menuC = [];
        //             this.menuAll = [];
        //             this.serviceBase
        //                 .getDataByPostRequest(
        //                     API.PHAN_HE.QTRIHTHONG,
        //                     API.API_QTHT.GET_MENU_OF_USER,
        //                     param
        //                 )
        //                 .subscribe((response) => {
        //                     if (response.length > 0) {
        //                         //Loadmenu new version
        //                         for (let i = 0; i < response.length; i++) {
        //                             let libIDMenu = response[i]["LIBID"];
        //                             this.menuAll.push(response[i]);
        //                             if (libIDMenu == "-1") {
        //                                 this.menuF.push(response[i]);
        //                             } else {
        //                                 this.menuC.push(response[i]);
        //                             }
        //                         }
        //                         //Sử dụng đệ quy tạo Menu
        //                         var lstAllMenu = [];
        //                         lstAllMenu = this.menuAll.filter(function (
        //                             item: any
        //                         ) {
        //                             return item.PARENTMENUID == 0;
        //                         });
        //                         if (lstAllMenu.length > 0) {
        //                             for (
        //                                 let i = 0;
        //                                 i < lstAllMenu.length;
        //                                 i++
        //                             ) {
        //                                 let idF = lstAllMenu[i]["MENUID"];
        //                                 let label1 = lstAllMenu[i]["HEADER"];
        //                                 let icon1 = "pi pi-bars";
        //                                 let itemsC: Object[] = [];
        //                                 itemsC = this.creatMenu(
        //                                     this.menuAll,
        //                                     "pi pi-play",
        //                                     idF
        //                                 );
        //                                 this.model.push({
        //                                     label: label1,
        //                                     icon: icon1,
        //                                     items: itemsC,
        //                                 });
        //                             }
        //                             this.modelAll.push({
        //                                 label: "CMIS 4",
        //                                 icon: "pi pi-fw pi-home",
        //                                 items: this.model,
        //                             });
        //                         }
        //                     }
        //                 });
        //             if (!sessionStorage.getItem("SESSIONID")) {
        //                 var sessionId = localStorage.getItem("SESSIONID");
        //                 //Luu vao session
        //                 sessionStorage.setItem("SESSIONID", sessionId);
        //                 localStorage.removeItem("SESSIONID");
        //             }
        //         }
        this.modelAll = [
            // {
            //     label: "Danh mục vật tư",
            //     icon: "pi pi-fw pi-home",
            //     items: this.model,
            //     routerLink: "/Home/DanhMuc/DMVatTu",
            // },
        ];
        // this.modelAll.push({
        //     label: "Danh mục nhân công",
        //     icon: "pi pi-fw pi-home",
        //     items: this.model,
        //     routerLink: "/Home/DanhMuc/DMNhanCong",
        // });
        //     }
        // }
        // =========================================== My Internship Task ======================================
        this.modelAll.push({
            label: " Danh mục chi phí khảo sát",
            icon: "pi pi-credit-card",
            item: this.model,
            routerLink: "/Home/DanhMuc/DMChiPhiKhaoSat",
        });
        this.modelAll.push({
            label: " Danh mục vật tư",
            icon: "pi pi-credit-card",
            item: this.model,
            routerLink: "/Home/DanhMuc/DMVatTu",
        });
    }

    private creatMenu(lstMenu: any, icon: any, menuid: any): any {
        var lstAllMenu = [];
        var lstAllFuncMenu = [];
        var itemsC: Object[] = [];
        let check = this.checkFnMenu(lstMenu, menuid);
        if (check > 0) {
            lstAllFuncMenu = this.createFnMenu(lstMenu, menuid);
            for (let i = 0; i < lstAllFuncMenu.length; i++) {
                itemsC.push(lstAllFuncMenu[i]);
            }
        } else {
            lstAllMenu = lstMenu.filter(function (item: any) {
                return item.PARENTMENUID == menuid && item.LIBID == -1;
            });
            for (let i = 0; i < lstAllMenu.length; i++) {
                let header1 = lstAllMenu[i]["HEADER"];
                let menuid1 = lstAllMenu[i]["MENUID"];
                let check1 = this.checkFnMenu(lstMenu, menuid1);
                if (check1 > 0) {
                    lstAllFuncMenu = this.createFnMenu(lstMenu, menuid1);
                    itemsC.push({
                        label: header1,
                        icon: icon,
                        items: lstAllFuncMenu,
                    });
                } else {
                    this.creatMenu(lstMenu, icon, menuid1);
                }
            }
            lstAllFuncMenu = this.createFnMenu(lstMenu, menuid);
            for (let i = 0; i < lstAllFuncMenu.length; i++) {
                itemsC.push(lstAllFuncMenu[i]);
            }
        }
        return itemsC;
    }

    private createFnMenu(lstMenu: any, menuid: any): any {
        var itemsC: Object[] = [];
        var lstFuncMenu = [];
        lstFuncMenu = lstMenu.filter(function (item: any) {
            return item.PARENTMENUID == menuid && item.LIBID != -1;
        });
        if (lstFuncMenu.length > 0) {
            for (let i = 0; i < lstFuncMenu.length; i++) {
                let label1 = lstFuncMenu[i]["HEADER"];
                let routerLink1 =
                    lstFuncMenu[i]["PRJNAME"] +
                    "/" +
                    lstFuncMenu[i]["NAMESPACE"];
                let param1 = lstFuncMenu[i]["MENU_PARAM"];
                let libid1 = lstFuncMenu[i]["LIBID"];
                itemsC.push({
                    label: label1,
                    routerLink: routerLink1,
                    param: param1,
                    libid: libid1,
                });
                this.itemsC.push({
                    label: label1,
                    routerLink: routerLink1,
                    param: param1,
                    libid: libid1,
                    index: i,
                });
            }
        }
        return itemsC;
    }

    private checkFnMenu(lstMenu: any, menuid: any): any {
        var lstFuncMenu = [];
        lstFuncMenu = lstMenu.filter(function (item: any) {
            return item.PARENTMENUID == menuid && item.LIBID == -1;
        });
        if (lstFuncMenu.length > 0) {
            return 0;
        } else {
            return 1;
        }
    }

    showSelect() {
        let item = this.selectedMenu.value;
        this.router.navigate(["/Home/" + item.routerLink]);
    }

    search(event: any) {
        let query = event.query;
        this.lstCombo = this.filterMenu(query, this.itemsC);
    }

    filterMenu(query: any, menu: any[]) {
        //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
        let filtered: any[] = [];
        for (let i = 0; i < menu.length; i++) {
            let item = menu[i];
            if (item.label.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
                filtered.push({ label: item.label, value: item });
            }
        }
        return filtered;
    }

    changeTheme(theme: any) {
        let themeLink: HTMLLinkElement = <HTMLLinkElement>(
            document.getElementById("theme-css")
        );
        let layoutLink: HTMLLinkElement = <HTMLLinkElement>(
            document.getElementById("layout-css")
        );

        themeLink.href = "assets/theme/theme-" + theme + ".css";
        layoutLink.href = "assets/layout/css/layout-" + theme + ".css";
    }
}
