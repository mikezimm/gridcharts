

import { getAge, getDayTimeToMinutes, getBestTimeDelta, getLocalMonths, getTimeSpan, getGreeting,
    getNicks, makeTheTimeObject, getTimeDelta, monthStr3, monthStr, weekday3, ITheTime, } from '@mikezimm/npmfunctions/dist/dateServices';

import { IPickedWebBasic, IPickedList, IMyProgress,
    IPivot, IMyPivots, ILink, IUser, IMyFonts, IMyIcons,
    } from '../../../../services/IReUsableInterfaces';

import { IDrillList } from './GetListData';

export interface IGridchartsData {
    date: any;
    label: any;
    dataLevel: number;
}

/***
 *    d888888b      .d8888. d888888b  .d8b.  d888888b 
 *      `88'        88'  YP `~~88~~' d8' `8b `~~88~~' 
 *       88         `8bo.      88    88ooo88    88    
 *       88           `Y8b.    88    88~~~88    88    
 *      .88.        db   8D    88    88   88    88    
 *    Y888888P      `8888Y'    YP    YP   YP    YP    
 *                                                    
 *                                                    
 */

export type IStatType = 'sum' | 'max' | 'mini' | 'range' | '';

export interface IStat {
    prop: string;
    label: string;
    type: IStatType;
    val1?: any;
    val2?: any;
    result?: string;
}

export interface IGridchartsState {

    selectedYear: number; //Used to determine selected Year Pivot
    selectedUser: any; //Used to determine filter of items ( current user or everyone )

    gridData: IGridchartsData[]; //One IGridchartsData per date between lowest and highest date range for input data

    monthLables: string[];  //Used to build the month labels on top of the gridChart
    monthScales: number[];  //Used to space the month labels on top of the gridChart

    entireDateArray: any[];  //Used as easy date index of entire range of data... to easily find correct item in gridData

    WebpartHeight?:  number;    //Size courtesy of https://www.netwoven.com/2018/11/13/resizing-of-spfx-react-web-parts-in-different-scenarios/
    WebpartWidth?:   number;    //Size courtesy of https://www.netwoven.com/2018/11/13/resizing-of-spfx-react-web-parts-in-different-scenarios/

    webURL?: string;
    
    allowOtherSites?: boolean; //default is local only.  Set to false to allow provisioning parts on other sites.

    allLoaded: boolean;

    bannerMessage: any;

    showTips: boolean;

    searchCount: number;

    searchText: string;
    searchMeta: string[];

    searchedItems: IDrillItemInfo[];
    stats: IStat[];
    first20searchedItems: IDrillItemInfo[];

    allItems: IDrillItemInfo[];

//    viewType?: IViewType;

    meta: string[];

    errMessage: string | JSX.Element;

    drillList: IDrillList;

    pivotCats: IMyPivCat[][];
 

  }

  

/***
 *    d888888b      d8888b. d888888b db    db  .o88b.  .d8b.  d888888b .d8888. 
 *      `88'        88  `8D   `88'   88    88 d8P  Y8 d8' `8b `~~88~~' 88'  YP 
 *       88         88oodD'    88    Y8    8P 8P      88ooo88    88    `8bo.   
 *       88         88~~~      88    `8b  d8' 8b      88~~~88    88      `Y8b. 
 *      .88.        88        .88.    `8bd8'  Y8b  d8 88   88    88    db   8D 
 *    Y888888P      88      Y888888P    YP     `Y88P' YP   YP    YP    `8888Y' 
 *                                                                             
 *                                                                             
 */

export interface IMyPivCat {
    title: string;
    desc: string;
    order: number;
    count: number;
}



/***
 *    d888888b      d8888b. d8888b. d888888b db      db           d888888b d888888b d88888b .88b  d88.      d888888b d8b   db d88888b  .d88b.  
 *      `88'        88  `8D 88  `8D   `88'   88      88             `88'   `~~88~~' 88'     88'YbdP`88        `88'   888o  88 88'     .8P  Y8. 
 *       88         88   88 88oobY'    88    88      88              88       88    88ooooo 88  88  88         88    88V8o 88 88ooo   88    88 
 *       88         88   88 88`8b      88    88      88              88       88    88~~~~~ 88  88  88         88    88 V8o88 88~~~   88    88 
 *      .88.        88  .8D 88 `88.   .88.   88booo. 88booo.        .88.      88    88.     88  88  88        .88.   88  V888 88      `8b  d8' 
 *    Y888888P      Y8888D' 88   YD Y888888P Y88888P Y88888P      Y888888P    YP    Y88888P YP  YP  YP      Y888888P VP   V8P YP       `Y88P'  
 *                                                                                                                                             
 *                                                                                                                                             
 */

export interface IDrillItemInfo extends Partial<any>{

    sort: string;
    searchString: string;
    meta: string[];

    Created: any;
    Modified: any;
    Author: any;
    Editor: any;
    timeCreated : ITheTime;

//    goToItemPreview: string;
//    goToItemLink: string;
//    goToPropsLink: string;
    isFile: boolean;

    timeModified : ITheTime;
    bestCreate: string;
    bestMod: string;

    author: IUser;
    editor: IUser;

//    refiners: IItemRefiners; //String of Keys representing the static name of the column used for drill downs

    Id: any;

}