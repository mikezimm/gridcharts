
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
 * @mikezimm/npmfunctions/dist/ Imports
 * 
 * 
 */

import { doesObjectExistInArray, addItemToArrayIfItDoesNotExist, sortKeysByOtherKey } from '@mikezimm/npmfunctions/dist/arrayServices';

import { makeTheTimeObject,  } from '@mikezimm/npmfunctions/dist/dateServices';

import { getHelpfullError } from '@mikezimm/npmfunctions/dist/ErrorHandler';

import { IPickedList, IPickedWebBasic, IMyPivots, IPivot,  ILink, IUser, IMyProgress, IMyIcons, IMyFonts, IChartSeries, 
    ICharNote, IRefinerRules, RefineRuleValues, ICustViewDef, IRefinerStat, ICSSChartTypes, QuickCommandsTMT } from '@mikezimm/npmfunctions/dist/IReUsableInterfaces';

import { ensureUserInfo } from '@mikezimm/npmfunctions/dist/userServices';

import { getExpandColumns, getSelectColumns } from '@mikezimm/npmfunctions/dist/getFunctions';

/**
 * 
 * 
 * Services Imports
 * 
 * 
 */



/**
 * 
 * This Component Imports
 * 
 * 
 */

import { IGridItemInfo } from './IGridchartsState';




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


export function updateGridListColumns( list: IGridList ) {
       
    let selectCols: string = list.minDataDownload === true ? "" : "*";
    let expandThese = "";

    let allColumns = ['Title','Id','Created','Modified','Author/Title','Author/ID','Author/Name','Editor/Title','Editor/ID','Editor/Name'];

    list.staticColumns.map( c => {
        allColumns.push( c );
    });

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

export function createGridList(webURL: string, parentListURL: string, title: string, name: string, isLibrary: boolean, performance: any, pageContext: any, 
    staticColumns: string[] , searchColumns: string[], metaColumns: string[], expandDates: string[] , dropDownColumns: string[], dropDownSort: string[] ) {

    let list: IGridList = {
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
        minDataDownload: performance.minDataDownload === true ? true : false,
        odataSearch: [],

        isLibrary: isLibrary,
        hasAttach: false,

        webURL: webURL,
        parentListURL: parentListURL,
        staticColumns: staticColumns,
        searchColumns: searchColumns,
        metaColumns: metaColumns,
        expandDates: expandDates,
        selectColumns: [],
        expandColumns: [],
        dropdownColumns: dropDownColumns,
        dropDownSort: dropDownSort,
        staticColumnsStr: '',
        selectColumnsStr: '',
        expandColumnsStr: '',
        removeFromSelect: ['currentTime','currentUser'],
    };

    list = updateGridListColumns( list ) ;

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

export interface IZBasicList extends Partial<IPickedList> {
    title: string;
    name?: string;
    guid?: string;
    fetchCount: number;
    fetchCountMobile: number;
    restFilter: string;
    minDataDownload: boolean;
    isLibrary?: boolean;
    hasAttach: boolean;
    webURL?: string;
    parentListURL?: string;
    contextUserInfo?: IUser;  //For site you are on ( aka current page context )
    sourceUserInfo?: IUser;   //For site where the list is stored

//    refinerRules: IRefinerRules[][];
//    refinerStats: IRefinerStat[];
//    viewDefs: ICustViewDef[];
    metaColumns: string[];
    searchColumns: string[];
    expandDates: string[];
    odataSearch?: string[];  //Used optionally in search text... but can cause issues if the list name/content type are the same text as you may want to search

    staticColumns: string[];
    selectColumns: string[];
    expandColumns: string[];

    staticColumnsStr: string;
    selectColumnsStr: string;
    expandColumnsStr: string;
    removeFromSelect: string[];
}


export interface IGridList extends IZBasicList {
    dropdownColumns: string[];
    dropDownSort: string[];
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
export async function getAllItems( fetchList: IGridList, addTheseItemsToState: any, setProgress: any, markComplete: any ): Promise<void>{

    let allItems : IGridItemInfo[] = [];
    let errMessage = '';

    let sourceUserInfo: any = null;
    try {
        sourceUserInfo = await ensureUserInfo( fetchList.webURL, fetchList.contextUserInfo.email );
    } catch (e) {
        errMessage = getHelpfullError(e, true, true);
    }


    fetchList.sourceUserInfo = sourceUserInfo;
    //lists.getById(listGUID).webs.orderBy("Title", true).get().then(function(result) {
    //let allItems : IGridItemInfo[] = await sp.web.webs.get();



    let thisListWeb = Web(fetchList.webURL);
    let selColumns = fetchList.selectColumnsStr;
    let expandThese = fetchList.expandColumnsStr;
    let staticCols = fetchList.staticColumns.length > 0 ? fetchList.staticColumns.join(',') : '';
    let selectCols = fetchList.minDataDownload === true ?  staticCols :  '*,' + staticCols;

    let thisListObject = thisListWeb.lists.getByTitle(fetchList.title);

    /**
     * IN FUTURE, ALWAYS BE SURE TO PUT SELECT AND EXPAND AFTER .ITEMS !!!!!!
     */

    try {
        let fetchCount = fetchList.fetchCount > 0 ? fetchList.fetchCount : 200;
        if ( fetchList.restFilter.length > 1 ) {
            allItems = await thisListObject.items.select(selectCols).expand(expandThese).orderBy('ID',false).top(fetchCount).filter(fetchList.restFilter).get();
        } else {
            allItems = await thisListObject.items.select(selectCols).expand(expandThese).orderBy('ID',false).top(fetchCount).get();
        }
    } catch (e) {
        errMessage = getHelpfullError(e, true, true);

    }

    /**
     * Add meta and searchString to every item
     */
    allItems.map( i => {
        //Add all date field objects
        fetchList.expandDates.map( d => {
            i['time' + d] = makeTheTimeObject(i[d]);
        });

        //Add Meta tags
        i.meta = buildMetaFromItem( i, fetchList );
        
        //Add Search string
        i.searchString = buildSearchStringFromItem( i, fetchList );
    });

    //private addTheseItemsToState( fetchList: IGridList, allItems , errMessage : string ) {
    allItems = addTheseItemsToState( fetchList, allItems, errMessage );

}







  
//  d8888b. db    db d888888b db      d8888b.      .88b  d88. d88888b d888888b  .d8b.  
//  88  `8D 88    88   `88'   88      88  `8D      88'YbdP`88 88'     `~~88~~' d8' `8b 
//  88oooY' 88    88    88    88      88   88      88  88  88 88ooooo    88    88ooo88 
//  88~~~b. 88    88    88    88      88   88      88  88  88 88~~~~~    88    88~~~88 
//  88   8D 88b  d88   .88.   88booo. 88  .8D      88  88  88 88.        88    88   88 
//  Y8888P' ~Y8888P' Y888888P Y88888P Y8888D'      YP  YP  YP Y88888P    YP    YP   YP 
//                                                                                     
//     

function buildMetaFromItem( theItem: IGridItemInfo, fetchList: IGridList, ) {
    let meta: string[] = ['All'];

    fetchList.metaColumns.map( c=> {
        if ( c.indexOf('/') > -1 ) { 
            let cols = c.split('/');
            //console.log( 'theItem', theItem);
            if ( theItem[ cols[0] ]) {
                meta = addItemToArrayIfItDoesNotExist( meta, theItem[ cols[0] ][ cols[1] ] ) ;
            } else { meta = addItemToArrayIfItDoesNotExist( meta, `. missing ${ c }` ) ; }
        } else if ( c.indexOf('.') > -1 ) { 
            let cols = c.split('.');
            if ( theItem[ cols[0] ]) {
                meta = addItemToArrayIfItDoesNotExist( meta, theItem[ cols[0] ][ cols[1]]  ) ;
            } else { meta = addItemToArrayIfItDoesNotExist( meta, `. missing ${ c }` ) ; }
        } else {
            meta = addItemToArrayIfItDoesNotExist( meta, theItem[ c ] ) ;
        }
        
    });

    fetchList.dropdownColumns.map( ( col , colIndex ) => {

        let actualColName = col.replace('>', '' ).replace('+', '' ).replace('-', '' );
        let parentColName = colIndex > 0 && col.indexOf('>') > -1 ? fetchList.dropdownColumns[colIndex - 1] : null;
        parentColName = parentColName !== null ? parentColName.replace('>', '' ).replace('+', '' ).replace('-', '' ) : null;

        let thisItemsChoices = theItem[ actualColName ];
        if ( parentColName !== null ) { thisItemsChoices = theItem[ parentColName ] + ' > ' + theItem[ actualColName ] ; }

        meta = addItemToArrayIfItDoesNotExist( meta, thisItemsChoices ) ;

    });

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

function buildSearchStringFromItem ( theItem: IGridItemInfo, fetchList: IGridList, ) {

    let result = '';
    let delim = '|||';

    if ( theItem.Title ) { result += 'Title=' + theItem.Title + delim ; }
    if ( theItem.Id ) { result += 'Id=' + theItem.Id + delim ; }

    fetchList.searchColumns.map( c => {
        let thisCol = c.replace('/','');
        if ( c.indexOf('/') > -1 ) { 
            let cols = c.split('/');
            if ( theItem[ cols[0] ] && theItem[ cols[0] ][ cols[1] ] ) { result += thisCol + '=' + theItem[ cols[0] ][ cols[1] ] + delim ; }
        } else if ( c.indexOf('.') > -1 ) { 
            let cols = c.split('.');
            if ( theItem[ cols[0] ] && theItem[ cols[0] ][ cols[1] ] ) { result += thisCol + '=' + theItem[ cols[0] ][ cols[1] ] + delim ; }
        } else {
            if ( theItem[thisCol] ) { result += thisCol + '=' + theItem[thisCol] + delim ; }
        }  

    });

    /**
     * Had this odata search from prior code:
     * if ( theItem['odata.type'] ) { result += theItem['odata.type'] + delim ; }
     * 
     */
    fetchList.odataSearch.map( odata => {
        if ( theItem[ odata ] ) { result += theItem[ odata ] + delim ; }
    });

    if ( theItem.meta.length > 0 ) { result += 'Meta=' + theItem.meta.join(',') + delim ; }

    result = result.toLowerCase();

    return result;

}