
/**
 * 
 * 
 * Official Community Imports
 * 
 * 
 */

import { Web, IList, IItem } from "@pnp/sp/presets/all";

import "@pnp/sp/webs";
import "@pnp/sp/clientside-pages/web";
import "@pnp/sp/site-users/web";

/**
 * 
 * 
 * @mikezimm/npmfunctions Imports
 * 
 * 
 */

import { doesObjectExistInArray, addItemToArrayIfItDoesNotExist, sortKeysByOtherKey } from '@mikezimm/npmfunctions/dist/arrayServices';

import { getHelpfullError } from '@mikezimm/npmfunctions/dist/ErrorHandler';

/**
 * 
 * 
 * Services Imports
 * 
 * 
 */

import { IPickedList, IPickedWebBasic, IMyPivots, IPivot,  ILink, IUser, IMyProgress, IMyIcons, IMyFonts, IChartSeries, 
    ICharNote, IRefinerRules, RefineRuleValues, ICustViewDef, IRefinerStat, ICSSChartTypes, QuickCommandsTMT } from '../../../../services/IReUsableInterfaces';

import { ensureUserInfo } from '../../../../services/userServices';

import { getExpandColumns, getSelectColumns } from '../../../../services/getFunctions';


/**
 * 
 * This Component Imports
 * 
 * 
 */

import { IDrillItemInfo } from './IGridchartsState';




/***
 *    db    db d8888b. d8888b.  .d8b.  d888888b d88888b      d8888b. d8888b. d888888b db      db      db      d888888b .d8888. d888888b       .o88b.  .d88b.  db      db    db .88b  d88. d8b   db .d8888. 
 *    88    88 88  `8D 88  `8D d8' `8b `~~88~~' 88'          88  `8D 88  `8D   `88'   88      88      88        `88'   88'  YP `~~88~~'      d8P  Y8 .8P  Y8. 88      88    88 88'YbdP`88 888o  88 88'  YP 
 *    88    88 88oodD' 88   88 88ooo88    88    88ooooo      88   88 88oobY'    88    88      88      88         88    `8bo.      88         8P      88    88 88      88    88 88  88  88 88V8o 88 `8bo.   
 *    88    88 88~~~   88   88 88~~~88    88    88~~~~~      88   88 88`8b      88    88      88      88         88      `Y8b.    88         8b      88    88 88      88    88 88  88  88 88 V8o88   `Y8b. 
 *    88b  d88 88      88  .8D 88   88    88    88.          88  .8D 88 `88.   .88.   88booo. 88booo. 88booo.   .88.   db   8D    88         Y8b  d8 `8b  d8' 88booo. 88b  d88 88  88  88 88  V888 db   8D 
 *    ~Y8888P' 88      Y8888D' YP   YP    YP    Y88888P      Y8888D' 88   YD Y888888P Y88888P Y88888P Y88888P Y888888P `8888Y'    YP          `Y88P'  `Y88P'  Y88888P ~Y8888P' YP  YP  YP VP   V8P `8888Y' 
 *                                                                                                                                                                                                         
 *                                                                                                                                                                                                         
 */


export function updateDrillListColumns( list: IDrillList ) {
       
    let selectCols: string = "*";
    let expandThese = "";

    let allColumns = ['Title','Id','Created','Modified','Author/Title','Author/ID','Author/Name','Editor/Title','Editor/ID','Editor/Name'];

    //Add all refiner columns to array.

    let expColumns = getExpandColumns(allColumns);
    let selColumns = getSelectColumns(allColumns);

    selColumns.length > 0 ? selectCols += "," + allColumns.join(",") : selectCols = selectCols;
    if (expColumns.length > 0) { expandThese = expColumns.join(","); }

    list.selectColumns = selColumns;
    list.staticColumns = allColumns;
    list.expandColumns = expColumns;

    list.selectColumnsStr = selColumns.join(',') ;
    list.staticColumnsStr = allColumns.join(',');
    list.expandColumnsStr = expColumns.join(',');

    return list;

}


/***
 *     .o88b. d8888b. d88888b  .d8b.  d888888b d88888b      d8888b. d8888b. d888888b db      db           db      d888888b .d8888. d888888b 
 *    d8P  Y8 88  `8D 88'     d8' `8b `~~88~~' 88'          88  `8D 88  `8D   `88'   88      88           88        `88'   88'  YP `~~88~~' 
 *    8P      88oobY' 88ooooo 88ooo88    88    88ooooo      88   88 88oobY'    88    88      88           88         88    `8bo.      88    
 *    8b      88`8b   88~~~~~ 88~~~88    88    88~~~~~      88   88 88`8b      88    88      88           88         88      `Y8b.    88    
 *    Y8b  d8 88 `88. 88.     88   88    88    88.          88  .8D 88 `88.   .88.   88booo. 88booo.      88booo.   .88.   db   8D    88    
 *     `Y88P' 88   YD Y88888P YP   YP    YP    Y88888P      Y8888D' 88   YD Y888888P Y88888P Y88888P      Y88888P Y888888P `8888Y'    YP    
 *                                                                                                                                          
 *                                                                                                                                          
 */

export function createDrillList(webURL: string, parentListURL: string, name: string, isLibrary: boolean, performance: any, pageContext: any, title: string = null) {

    let list: IDrillList = {
        title: title,
        name: name,
        guid: '',
        contextUserInfo: {
            LoginName: pageContext.user.loginName,
            Title: pageContext.user.displayName,
            email: pageContext.user.email,
            remoteID: null, //This is for cross site ID requirements
            Id: pageContext.user.Id

        },
        sourceUserInfo: null,
        fetchCount: performance.fetchCount,
        fetchCountMobile: performance.fetchCountMobile,
        restFilter: !performance.restFilter ? ' ' : performance.restFilter,

        isLibrary: isLibrary,
        hasAttach: false,

        webURL: webURL,
        parentListURL: parentListURL,
        staticColumns: [],
        selectColumns: [],
        expandColumns: [],
        staticColumnsStr: '',
        selectColumnsStr: '',
        expandColumnsStr: '',
        removeFromSelect: ['currentTime','currentUser'],
    };

    list = this.updateDrillListColumns( list ) ;

    return list;
}


/***
 *    d888888b      d8888b. d8888b. d888888b db      db      db      d888888b .d8888. d888888b 
 *      `88'        88  `8D 88  `8D   `88'   88      88      88        `88'   88'  YP `~~88~~' 
 *       88         88   88 88oobY'    88    88      88      88         88    `8bo.      88    
 *       88         88   88 88`8b      88    88      88      88         88      `Y8b.    88    
 *      .88.        88  .8D 88 `88.   .88.   88booo. 88booo. 88booo.   .88.   db   8D    88    
 *    Y888888P      Y8888D' 88   YD Y888888P Y88888P Y88888P Y88888P Y888888P `8888Y'    YP    
 *                                                                                             
 *                                                                                             
 */

export interface IDrillList extends Partial<IPickedList> {
    title: string;
    name?: string;
    guid?: string;
    fetchCount: number;
    fetchCountMobile: number;
    restFilter: string;
    isLibrary?: boolean;
    hasAttach: boolean;
    webURL?: string;
    parentListURL?: string;
    contextUserInfo?: IUser;  //For site you are on ( aka current page context )
    sourceUserInfo?: IUser;   //For site where the list is stored

//    refinerRules: IRefinerRules[][];
//    refinerStats: IRefinerStat[];
//    viewDefs: ICustViewDef[];
    staticColumns: string[];
    selectColumns: string[];
    expandColumns: string[];
    staticColumnsStr: string;
    selectColumnsStr: string;
    expandColumnsStr: string;
    removeFromSelect: string[];
  }



//   d888b  d88888b d888888b  .d8b.  db      db      d888888b d888888b d88888b .88b  d88. .d8888. 
//  88' Y8b 88'     `~~88~~' d8' `8b 88      88        `88'   `~~88~~' 88'     88'YbdP`88 88'  YP 
//  88      88ooooo    88    88ooo88 88      88         88       88    88ooooo 88  88  88 `8bo.   
//  88  ooo 88~~~~~    88    88~~~88 88      88         88       88    88~~~~~ 88  88  88   `Y8b. 
//  88. ~8~ 88.        88    88   88 88booo. 88booo.   .88.      88    88.     88  88  88 db   8D 
//   Y888P  Y88888P    YP    YP   YP Y88888P Y88888P Y888888P    YP    Y88888P YP  YP  YP `8888Y' 
//                                                                                                
//        

// This is what it was before I split off the other part
export async function getAllItems( drillList: IDrillList, addTheseItemsToState: any, setProgress: any, markComplete: any ): Promise<void>{

    let sourceUserInfo: any = await ensureUserInfo( drillList.webURL, drillList.contextUserInfo.email );

    drillList.sourceUserInfo = sourceUserInfo;
    //lists.getById(listGUID).webs.orderBy("Title", true).get().then(function(result) {
    //let allItems : IDrillItemInfo[] = await sp.web.webs.get();

    let allItems : IDrillItemInfo[] = [];
    let errMessage = '';

    let thisListWeb = Web(drillList.webURL);
    let selColumns = drillList.selectColumnsStr;
    let expandThese = drillList.expandColumnsStr;
    let staticCols = drillList.staticColumns.length > 0 ? drillList.staticColumns.join(',') : '';
    let selectCols = '*,' + staticCols;

    let thisListObject = thisListWeb.lists.getByTitle(drillList.name);

    /**
     * IN FUTURE, ALWAYS BE SURE TO PUT SELECT AND EXPAND AFTER .ITEMS !!!!!!
     */

    try {
        let fetchCount = drillList.fetchCount > 0 ? drillList.fetchCount : 200;
        if ( drillList.restFilter.length > 1 ) {
            allItems = await thisListObject.items.select(selectCols).expand(expandThese).orderBy('ID',false).top(fetchCount).filter(drillList.restFilter).get();
        } else {
            allItems = await thisListObject.items.select(selectCols).expand(expandThese).orderBy('ID',false).top(fetchCount).get();
        }
    } catch (e) {
        errMessage = getHelpfullError(e, true, true);

    }

//    allItems = processAllItems( allItems, errMessage, drillList, addTheseItemsToState, setProgress, markComplete );

}







  
//  d8888b. db    db d888888b db      d8888b.      .88b  d88. d88888b d888888b  .d8b.  
//  88  `8D 88    88   `88'   88      88  `8D      88'YbdP`88 88'     `~~88~~' d8' `8b 
//  88oooY' 88    88    88    88      88   88      88  88  88 88ooooo    88    88ooo88 
//  88~~~b. 88    88    88    88      88   88      88  88  88 88~~~~~    88    88~~~88 
//  88   8D 88b  d88   .88.   88booo. 88  .8D      88  88  88 88.        88    88   88 
//  Y8888P' ~Y8888P' Y888888P Y88888P Y8888D'      YP  YP  YP Y88888P    YP    YP   YP 
//                                                                                     
//     

function buildMetaFromItem( theItem: IDrillItemInfo ) {
    let meta: string[] = ['All'];

    if ( theItem.timeCreated.daysAgo === 0 ) {
        meta = addItemToArrayIfItDoesNotExist(meta, 'New');
    } else {
        meta = theItem.timeCreated.daysAgo < 180 ? addItemToArrayIfItDoesNotExist(meta, 'RecentlyCreated') : addItemToArrayIfItDoesNotExist(meta, 'Old');
    }

    meta = theItem.timeModified.daysAgo < 180 ? addItemToArrayIfItDoesNotExist(meta, 'RecentlyUpdated') : addItemToArrayIfItDoesNotExist(meta, 'Stale');

    for ( let L of Object.keys(theItem.refiners) ) {
        //Gets rid of the 'undefined' meta key found at the end of the keys
        //Only do this if it is the lev0, lev1 or lev2 arrays
        if (L.indexOf('lev') === 0 ) { 
            for ( let R in theItem.refiners[L] ) {
                meta = addItemToArrayIfItDoesNotExist(meta, theItem.refiners[L][R]);
            }
        }
    }

    meta = addItemToArrayIfItDoesNotExist(meta, theItem.sort );

    return meta;
}

//  d8888b. db    db d888888b db      d8888b.      .d8888. d88888b  .d8b.  d8888b.  .o88b. db   db 
//  88  `8D 88    88   `88'   88      88  `8D      88'  YP 88'     d8' `8b 88  `8D d8P  Y8 88   88 
//  88oooY' 88    88    88    88      88   88      `8bo.   88ooooo 88ooo88 88oobY' 8P      88ooo88 
//  88~~~b. 88    88    88    88      88   88        `Y8b. 88~~~~~ 88~~~88 88`8b   8b      88~~~88 
//  88   8D 88b  d88   .88.   88booo. 88  .8D      db   8D 88.     88   88 88 `88. Y8b  d8 88   88 
//  Y8888P' ~Y8888P' Y888888P Y88888P Y8888D'      `8888Y' Y88888P YP   YP 88   YD  `Y88P' YP   YP 
//                                                                                                 
//         

function buildSearchStringFromItem (newItem : IDrillItemInfo, staticColumns: string[]) {

    let result = '';
    let delim = '|||';

    if ( newItem.Title ) { result += 'Title=' + newItem.Title + delim ; }
    if ( newItem.Id ) { result += 'Id=' + newItem.Id + delim ; }

    staticColumns.map( c => {
        let thisCol = c.replace('/','');
        if ( newItem[thisCol] ) { result += c + '=' + newItem[thisCol] + delim ; }
    });

    if ( newItem['odata.type'] ) { result += newItem['odata.type'] + delim ; }

    if ( newItem.meta.length > 0 ) { result += 'Meta=' + newItem.meta.join(',') + delim ; }

    result = result.toLowerCase();

    return result;

}