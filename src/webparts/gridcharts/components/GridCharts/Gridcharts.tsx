import * as React from 'react';
import styles from '../Gridcharts.module.scss';
import { IGridchartsProps } from './IGridchartsProps';
import { IGridchartsState, IGridchartsData, IGridchartsDataPoint, IGridItemInfo } from './IGridchartsState';
import { escape } from '@microsoft/sp-lodash-subset';

import { Spinner, SpinnerSize, SpinnerLabelPosition } from 'office-ui-fabric-react/lib/Spinner';
import { Stack, IStackStyles, IStackTokens } from 'office-ui-fabric-react/lib/Stack';

import {
  MessageBar,
  MessageBarType,
  SearchBox,
  Icon,
  Label,
  Pivot,
  PivotItem,
  PivotLinkFormat,
  PivotLinkSize,
  Dropdown,
  IDropdownOption,
} from "office-ui-fabric-react";

import InfoPage from '../HelpInfo/infoPages';

import { saveTheTime, saveAnalytics, getTheCurrentTime } from '../../../../services/createAnalytics';
import { getAge, getDayTimeToMinutes, getBestTimeDelta, getLocalMonths, getTimeSpan, getGreeting,
          getNicks, makeTheTimeObject, getTimeDelta, monthStr3, monthStr, weekday3} from '@mikezimm/npmfunctions/dist/dateServices';


import { sortObjectArrayByStringKey, doesObjectExistInArray } from '@mikezimm/npmfunctions/dist/arrayServices';

import { IPickedWebBasic, IPickedList, IMyProgress,
  IPivot, IMyPivots, ILink, IUser, IMyFonts, IMyIcons,
} from '../../../../services/IReUsableInterfaces';

import { createGridList, getAllItems, IGridList } from './GetListData';
import { IGrid } from 'office-ui-fabric-react';
/**
 * Based upon example from
 * https://codepen.io/ire/pen/Legmwo
 */

 /**
  * This was manually copied from import { monthStr3 } from '@mikezimm/npmfunctions/dateServices';
  */
export const monthStr3x = {
  'en-us':["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  'es': ["Ene", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],

  'de-de': ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  'fr-fr': ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],

  'ja': ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  'ch': ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  'ko': ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  'thai': ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  'swe': ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  'ro-ro': ["Ian", "Feb", "Mar", "Apr", "Mai", "Iun", "Iul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};

 /**
  * This was manually copied from import { monthStr3 } from '@mikezimm/npmfunctions/dateServices';
  */
export const weekday3x = {
  'en-us': ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  'es': ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"], //Should start on Monday

  'de-de': ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], //Should start on Monday
  'fr-fr': ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], //Should start on Monday

  'ja': ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  'ch': ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  'ko': ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  'thai': ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  'swe': ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], //Should start on Monday
  'ro-ro': ["Dum", "Lun", "Mar", "Mie", "Joi", "Vin", "Sam"], //Should start on Monday
};

export default class Gridcharts extends React.Component<IGridchartsProps, IGridchartsState> {

    //https://stackoverflow.com/a/4413721
    private addDays (tempDate, days) {
      var date = new Date(tempDate.valueOf());
      date.setDate(date.getDate() + days);
      return date;
    }

    //https://stackoverflow.com/a/4413721
    private getDates(startDate, stopDate) {
      var dateArray = new Array();
      var currentDate = startDate;
      while (currentDate <= stopDate) {
          let tempDate = new Date (currentDate);
          dateArray.push(tempDate);
          currentDate = this.addDays( tempDate , 1);
      }
      return dateArray;
    }

    private createSampleGridData() {

      let arrDates: any[] = [];
      let startDate = new Date();
      let endDate = new Date();
      endDate.setDate(endDate.getDate() + 365 - 2 );

      arrDates = this.getDates( startDate, endDate);
      let dataPoints : IGridchartsDataPoint[] = [];

      for (var i = 1; i < 365; i++) {

        let data : IGridchartsDataPoint = {
          date: null,
          label: null,
          dateString: '',
          dataLevel: Math.floor(Math.random() * 3),
          value: Math.floor(Math.random() * 20),
          values: [],
          valuesString: [],
          count: null,
          sum: null,
          avg: null,
          min: null,
          max: null,
          items: [],
        };

        let thisDate : Date = arrDates[ i- 1];
        data.label = thisDate.toLocaleDateString();
        data.date = thisDate;
        dataPoints.push( data ); 

      }
      return dataPoints;
    }

/***
 *          .o88b.  .d88b.  d8b   db .d8888. d888888b d8888b. db    db  .o88b. d888888b  .d88b.  d8888b. 
 *         d8P  Y8 .8P  Y8. 888o  88 88'  YP `~~88~~' 88  `8D 88    88 d8P  Y8 `~~88~~' .8P  Y8. 88  `8D 
 *         8P      88    88 88V8o 88 `8bo.      88    88oobY' 88    88 8P         88    88    88 88oobY' 
 *         8b      88    88 88 V8o88   `Y8b.    88    88`8b   88    88 8b         88    88    88 88`8b   
 *         Y8b  d8 `8b  d8' 88  V888 db   8D    88    88 `88. 88b  d88 Y8b  d8    88    `8b  d8' 88 `88. 
 *          `Y88P'  `Y88P'  VP   V8P `8888Y'    YP    88   YD ~Y8888P'  `Y88P'    YP     `Y88P'  88   YD 
 *                                                                                                       
 *                                                                                                       
 */


    public constructor(props:IGridchartsProps){
        super(props);
          /**
           * This is copied later in code when you have to call the data in case something changed.
           */  //createGridList(webURL, parentListURL, name, isLibrary, performance, pageContext, title: string = null)

          /*
          dateColumn: string;
          valueColumn: string;
          valueType: string;
          valueOperator: string;
        */
        let allColumns : string[] = [];
        let dropDownColumns: string[] = this.props.dropDownColumns;
        let searchColumns : string[] = this.props.searchColumns;
        let metaColumns : string[] = this.props.metaColumns;
        let expandDates : string[] = [this.props.dateColumn, 'Created', 'Modified'];
        
        allColumns.push( this.props.dateColumn );
        allColumns.push( this.props.valueColumn );

        searchColumns.map( c => { allColumns.push( c ) ; });
        metaColumns.map( c => { allColumns.push( c ) ; });

        let dropDownSort : string[] = dropDownColumns.map( c => { let c1 = c.replace('>','') ; if ( c1.indexOf('-') === 0 ) { return 'dec' ; } else if ( c1.indexOf('+') === 0 ) { return 'asc' ; } else { return ''; } });

        dropDownColumns.map( c => { let c1 = c.replace('>','').replace('+','').replace('-','') ; searchColumns.push( c1 ) ; metaColumns.push( c1 ) ; allColumns.push( c1 ); });

        let gridList = createGridList( this.props.parentListWeb, null, this.props.parentListTitle, null, null, this.props.performance, this.props.pageContext, allColumns, searchColumns, metaColumns, expandDates, dropDownColumns, dropDownSort );
        let errMessage = null;

        let dataPoints : IGridchartsDataPoint[] = this.createSampleGridData();

        console.log('gridData', dataPoints );

        const s1 = dataPoints[0].date.getMonth();
        const s2 = s1 + 12;

        const monthLables = monthStr3["en-us"].concat( ... monthStr3["en-us"] ).slice(s1,s2) ;
        const monthScales = [ 4,4,4,5,4,4,5,4,4,5,4,5   ,   4,4,4,5,4,4,5,4,4,5,4,5 ].slice(s1,s2) ;

        let entireDateArray = [];

        let gridData: IGridchartsData = {
          startDate: null,
          endDate: null,
          gridEnd: null,
          gridStart: null,
          dataPoints: dataPoints,
          entireDateArray: entireDateArray,
          entireDateStringArray: [],
        };

        this.state = { 

          //Size courtesy of https://www.netwoven.com/2018/11/13/resizing-of-spfx-react-web-parts-in-different-scenarios/
          WebpartHeight: this.props.WebpartElement ? this.props.WebpartElement.getBoundingClientRect().height : null,
          WebpartWidth:  this.props.WebpartElement ? this.props.WebpartElement.getBoundingClientRect().width - 50 : null,

          monthLables: monthLables,
          monthScales: monthScales,

          selectedYear: null,
          selectedUser: null,
          selectedDropdowns: [],
          dropDownItems: [],

          gridData: gridData,

          gridList: gridList,

          bannerMessage: null,
          showTips: false,

          allowOtherSites: this.props.allowOtherSites === true ? true : false,
          allLoaded: false,

          allItems: [],
          searchedItems: [],
          stats: [],
          first20searchedItems: [],
          searchCount: 0,

          meta: [],

          webURL: this.props.parentListWeb,

          searchMeta: null, // [pivCats.all.title],
          searchText: '',

          errMessage: errMessage,
          
          pivotCats: [],

          lastStateChange: 'Loading',
          stateChanges: [],
//          style: this.props.style ? this.props.style : 'commandBar',

        };  

    }


    public componentDidMount() {

      getAllItems( this.state.gridList, this.addTheseItemsToState.bind(this), null, null );
      
    }


/***
*         d8888b. d888888b d8888b.      db    db d8888b. d8888b.  .d8b.  d888888b d88888b 
*         88  `8D   `88'   88  `8D      88    88 88  `8D 88  `8D d8' `8b `~~88~~' 88'     
*         88   88    88    88   88      88    88 88oodD' 88   88 88ooo88    88    88ooooo 
*         88   88    88    88   88      88    88 88~~~   88   88 88~~~88    88    88~~~~~ 
*         88  .8D   .88.   88  .8D      88b  d88 88      88  .8D 88   88    88    88.     
*         Y8888D' Y888888P Y8888D'      ~Y8888P' 88      Y8888D' YP   YP    YP    Y88888P 
*                                                                                         
*                                                                                         
*/

    public componentDidUpdate(prevProps){

      let reloadData : any = false;
      let refreshMe : any = false;

      let reloadOnThese = [
        'stressMultiplierTime', 'webPartScenario', '', '', '',
        'parentListTitle', 'parentListName', 'parentListWeb', '', '',
        'dateColumn', 'valueColumn', 'valueType', 'valueOperator','dropDownColumns',
      ];

      let reloadOnPerformance = [ 'fetchCount', 'fetchCountMobile', 'restFilter', 'minDataDownload' ] ;

      let refreshOnThese = [
        'setSize','setTab','otherTab','setTab','otherTab','setTab','otherTab','setTab','otherTab', '',
        'pivotSize', 'pivotFormat', 'pivotOptions', 'pivotTab', 'advancedPivotStyles', '',

      ];

      reloadOnThese.map( key => {
        if ( prevProps[key] !== this.props[key] ) { reloadData = true; }
      });

      reloadOnPerformance.map ( key => {
        if ( prevProps.performance[key] !== this.props.performance[key] ) { reloadData = true; }
      });

      if (reloadData === false) {
        refreshOnThese.map( key => {
          if ( prevProps[key] !== this.props[key] ) { refreshMe = true; }
        });
      }

      if (reloadData === true) {
        //Need to first update gridList and pass it on.

        let allColumns : string[] = [];
        let dropDownColumns: string[] = this.props.dropDownColumns;
        let searchColumns : string[] = this.props.searchColumns;
        let metaColumns : string[] = this.props.metaColumns;
        let expandDates : string[] = [this.props.dateColumn, 'Created', 'Modified'];
        
        allColumns.push( this.props.dateColumn );
        allColumns.push( this.props.valueColumn );

        searchColumns.map( c => { allColumns.push( c ) ; });
        metaColumns.map( c => { allColumns.push( c ) ; });

        let dropDownSort : string[] = dropDownColumns.map( c => { let c1 = c.replace('>','') ; if ( c1.indexOf('-') === 0 ) { return 'dec' ; } else if ( c1.indexOf('+') === 0 ) { return 'asc' ; } else { return ''; } });

        dropDownColumns.map( c => { let c1 = c.replace('>','') ; searchColumns.push( c1 ) ; metaColumns.push( c1 ) ; allColumns.push( c1 ); });

        let gridList = createGridList(this.props.parentListWeb, null, this.props.parentListTitle, null, null, this.props.performance, this.props.pageContext, allColumns, searchColumns, metaColumns, expandDates, dropDownColumns, dropDownSort );

        getAllItems( gridList, this.addTheseItemsToState.bind(this), null, null );
      }


      //if (this.props.defaultProjectPicker !== prevProps.defaultProjectPicker) {  rebuildTiles = true ; }

      //if (rebuildTiles === true) {
        //this._updateStateOnPropsChange({});
      //}
    }



/***
 *         d8888b. d88888b d8b   db d8888b. d88888b d8888b. 
 *         88  `8D 88'     888o  88 88  `8D 88'     88  `8D 
 *         88oobY' 88ooooo 88V8o 88 88   88 88ooooo 88oobY' 
 *         88`8b   88~~~~~ 88 V8o88 88   88 88~~~~~ 88`8b   
 *         88 `88. 88.     88  V888 88  .8D 88.     88 `88. 
 *         88   YD Y88888P VP   V8P Y8888D' Y88888P 88   YD 
 *                                                          
 *                                                          
 */

  public render(): React.ReactElement<IGridchartsProps> {

    const wrapStackTokens: IStackTokens = { childrenGap: 30 };

//    const squares = document.querySelector(styles.squares);
//    const squares = document.querySelector(styles.squares);

    const squares : any[] = [];
    let gridElement = null;
    let searchStack = null;

    if ( this.state.allLoaded === true ) {
      this.state.gridData.dataPoints.map( ( d ) => {
        squares.push( <li title={ d.label + ' : ' + d.dataLevel } data-level={ d.dataLevel }></li> ) ;
      });
      gridElement = <ul className={styles.squares} style={{ listStyleType: 'none' }}>
                      { squares }
                    </ul>;

      if ( this.state.dropDownItems.length > 0 ) {

        let searchElements = this.state.dropDownItems.map( ( dropDownChoices, index ) => {

            let dropDownSort = this.state.gridList.dropDownSort[ index ];
            let dropDownChoicesSorted = dropDownSort === '' ? dropDownChoices : sortObjectArrayByStringKey( dropDownChoices, dropDownSort, 'text' );

            return <Dropdown
                placeholder={ 'DDPlaceholder' }
                label={'DDSLabel'}
                options={dropDownChoicesSorted}
                selectedKey={ this.state.selectedDropdowns [index ] }
                onChange={(ev: any, value: IDropdownOption) => {
                  this.searchForItems(value.key.toString());
                }}
                styles={{ dropdown: { width: 200 } }}
            />;
        });
        searchStack = <div>
              <Stack horizontal horizontalAlign="center" wrap tokens={wrapStackTokens}>
                { searchElements }
              </Stack>
          </div>;

      } 


    } else {

      gridElement = <div style={{ position: 'absolute', top: '50%', left: '42%' }}>
          <Spinner 
            size={SpinnerSize.large}
            label={ 'Loading data' }
            labelPosition='left'
          ></Spinner>
        </div> ;
    }


    const months : any[] = this.state.monthLables;
    const days : any[] = weekday3['en-us'];

    const gridTemplateColumns : string = this.state.monthScales.map( v => 20*v*.9 + 'px').join( ' ');

    return (
      <div className={ styles.gridcharts }>
        <div className={ styles.container }>
          { searchStack }
          <div className={styles.graph} style={{ width: '900px' }}>

            <ul className={styles.months} style={{ listStyleType: 'none', gridTemplateColumns: gridTemplateColumns }}>
              { months.map( m=> { return <li> { m } </li> ; }) }
            </ul>
            <ul className={styles.days} style={{ listStyleType: 'none' }}>
                { days.map( d=> { return <li> { d } </li> ; }) }
            </ul>
            { gridElement }
          </div>

        </div>
      </div>
    );
  }


  /***
 *    .d8888. d88888b  .d8b.  d8888b.  .o88b. db   db      d88888b  .d88b.  d8888b.      d888888b d888888b d88888b .88b  d88. .d8888. 
 *    88'  YP 88'     d8' `8b 88  `8D d8P  Y8 88   88      88'     .8P  Y8. 88  `8D        `88'   `~~88~~' 88'     88'YbdP`88 88'  YP 
 *    `8bo.   88ooooo 88ooo88 88oobY' 8P      88ooo88      88ooo   88    88 88oobY'         88       88    88ooooo 88  88  88 `8bo.   
 *      `Y8b. 88~~~~~ 88~~~88 88`8b   8b      88~~~88      88~~~   88    88 88`8b           88       88    88~~~~~ 88  88  88   `Y8b. 
 *    db   8D 88.     88   88 88 `88. Y8b  d8 88   88      88      `8b  d8' 88 `88.        .88.      88    88.     88  88  88 db   8D 
 *    `8888Y' Y88888P YP   YP 88   YD  `Y88P' YP   YP      YP       `Y88P'  88   YD      Y888888P    YP    Y88888P YP  YP  YP `8888Y' 
 *                                                                                                                                    
 *                                                                                                                                    
 */

 /**
  * Based on PivotTiles.tsx
  * @param item
  */
  public searchForItems = (item): void => {

    //This sends back the correct pivot category which matches the category on the tile.
    let e: any = event;

    console.log('searchForItems: e',e);

    console.log('searchForItems: item', item);
    console.log('searchForItems: this', this);
          /*
    */

    let dropdownColumnIndex = null;
    this.state.dropDownItems.map ( ( thisDropDown, ddIndex ) => {
      thisDropDown.map( thisChoice => {
        if ( ddIndex === null && thisChoice.text === item ) { dropdownColumnIndex = ddIndex ; } 
      });
    });

    let selectedDropdowns = this.state.selectedDropdowns;
    if ( dropdownColumnIndex !== null ) { selectedDropdowns[ dropdownColumnIndex ] = item; }

    let searchItems : IGridItemInfo[] = [];
    let newFilteredItems: IGridItemInfo[]  = [];

    searchItems =this.state.allItems;

    let searchCount = searchItems.length;

    if ( item === '' ) {
      newFilteredItems = searchItems;
    } else {
      for (let thisItem of searchItems) {
        let searchChoices = thisItem.meta ;
        if(searchChoices.indexOf( item ) > -1) {
          //console.log('fileName', fileName);
          newFilteredItems.push(thisItem);
        }
      }
    }


    searchCount = newFilteredItems.length;

    let gridData : IGridchartsData = this.buildGridData (this.state.gridList, newFilteredItems);
    
    const s1 = gridData.gridStart.getMonth();
    const s2 = s1 + 12;

    const monthLables = monthStr3["en-us"].concat( ... monthStr3["en-us"] ).slice(s1,s2) ;
    const monthScales = [ 4,4,4,5,4,4,5,4,4,5,4,5   ,   4,4,4,5,4,4,5,4,4,5,4,5 ].slice(s1,s2) ;

    this.setState({
      /*          */
        searchedItems: newFilteredItems, //newFilteredItems,  //Replaced with theseItems to update when props change.
        searchCount: newFilteredItems.length,
        searchText: '',
        searchMeta: [],
        selectedDropdowns: selectedDropdowns,
        gridData: gridData,
        allLoaded: true,
        monthLables: monthLables,
        monthScales: monthScales,
        lastStateChange: 'searchForItems: ' + item,

    });

    return ;
    
  }

  /***
 *     .d8b.  d8888b. d8888b.      d888888b d888888b d88888b .88b  d88. .d8888.      d888888b  .d88b.       .d8888. d888888b  .d8b.  d888888b d88888b 
 *    d8' `8b 88  `8D 88  `8D        `88'   `~~88~~' 88'     88'YbdP`88 88'  YP      `~~88~~' .8P  Y8.      88'  YP `~~88~~' d8' `8b `~~88~~' 88'     
 *    88ooo88 88   88 88   88         88       88    88ooooo 88  88  88 `8bo.           88    88    88      `8bo.      88    88ooo88    88    88ooooo 
 *    88~~~88 88   88 88   88         88       88    88~~~~~ 88  88  88   `Y8b.         88    88    88        `Y8b.    88    88~~~88    88    88~~~~~ 
 *    88   88 88  .8D 88  .8D        .88.      88    88.     88  88  88 db   8D         88    `8b  d8'      db   8D    88    88   88    88    88.     
 *    YP   YP Y8888D' Y8888D'      Y888888P    YP    Y88888P YP  YP  YP `8888Y'         YP     `Y88P'       `8888Y'    YP    YP   YP    YP    Y88888P 
 *                                                                                                                                                    
 *                                                                                                                                                    
 */


  private addTheseItemsToState( gridList: IGridList, theseItems , errMessage : string, allNewData : boolean = true ) {

      if ( theseItems.length < 300 ) {
          console.log('addTheseItemsToState theseItems: ', theseItems);
      } {
          console.log('addTheseItemsToState theseItems: QTY: ', theseItems.length );
      }

      let allItems = allNewData === false ? this.state.allItems : theseItems;

      let gridData : IGridchartsData = this.buildGridData (gridList, theseItems);

      let dropDownItems : IDropdownOption[][] = allNewData === true ? this.buildDataDropdownItems( gridList, allItems ) : this.state.dropDownItems ;
      
      const s1 = gridData.gridStart.getMonth();
      const s2 = s1 + 12;

      const monthLables = monthStr3["en-us"].concat( ... monthStr3["en-us"] ).slice(s1,s2) ;
      const monthScales = [ 4,4,4,5,4,4,5,4,4,5,4,5   ,   4,4,4,5,4,4,5,4,4,5,4,5 ].slice(s1,s2) ;

      this.setState({
        /*          */
          allItems: allItems,
          searchedItems: theseItems, //newFilteredItems,  //Replaced with theseItems to update when props change.
          searchCount: theseItems.length,
          dropDownItems: dropDownItems,
          errMessage: errMessage,
          searchText: '',
          searchMeta: [],
          gridList: gridList,
          gridData: gridData,
          allLoaded: true,
          monthLables: monthLables,
          monthScales: monthScales,

      });

      console.log('loadedState:', this.state );
      //This is required so that the old list items are removed and it's re-rendered.
      //If you do not re-run it, the old list items will remain and new results get added to the list.
      //However the list will show correctly if you click on a pivot.
      //this.searchForItems( '', this.state.searchMeta, 0, 'meta' );
      return true;
  }

  private buildDataDropdownItems( gridList: IGridList, allItems : IGridItemInfo[] ) {

    let dropDownItems : IDropdownOption[][] = [];

    this.props.dropDownColumns.map( ( col, colIndex ) => {

      let actualColName = col.replace('>', '' );
      let parentColName = colIndex > 0 && col.indexOf('>') > -1 ? this.props.dropDownColumns[colIndex - 1] : null;

      let thisColumnChoices : IDropdownOption[] = [];
      let foundChoices : string[] = [];
      allItems.map( item => {
        let thisItemsChoices = item[ actualColName ];
        if ( parentColName !== null ) { thisItemsChoices = item[ parentColName ] + ' > ' + item[ actualColName ] ; }
        if ( thisItemsChoices && thisItemsChoices.length > 0 ) {
          if ( foundChoices.indexOf( thisItemsChoices ) < 0 ) {
            if ( thisColumnChoices.length === 0 ) { thisColumnChoices.push( { key: '', text: '- all -' } ) ; }
            thisColumnChoices.push( { key: thisItemsChoices, text: thisItemsChoices } ) ;
            foundChoices.push( thisItemsChoices ) ;
          }
        }
      });

      dropDownItems.push( thisColumnChoices ) ;

    });

    return dropDownItems;

  }



/***
 *    d8888b. db    db d888888b db      d8888b.       d888b  d8888b. d888888b d8888b.      d8888b.  .d8b.  d888888b  .d8b.  
 *    88  `8D 88    88   `88'   88      88  `8D      88' Y8b 88  `8D   `88'   88  `8D      88  `8D d8' `8b `~~88~~' d8' `8b 
 *    88oooY' 88    88    88    88      88   88      88      88oobY'    88    88   88      88   88 88ooo88    88    88ooo88 
 *    88~~~b. 88    88    88    88      88   88      88  ooo 88`8b      88    88   88      88   88 88~~~88    88    88~~~88 
 *    88   8D 88b  d88   .88.   88booo. 88  .8D      88. ~8~ 88 `88.   .88.   88  .8D      88  .8D 88   88    88    88   88 
 *    Y8888P' ~Y8888P' Y888888P Y88888P Y8888D'       Y888P  88   YD Y888888P Y8888D'      Y8888D' YP   YP    YP    YP   YP 
 *                                                                                                                          
 *                                                                                                                          
 */

  private buildGridData ( gridList: IGridList, allItems : IGridItemInfo[] ) {
    let entireDateArray : any[] = [];
    let entireDateStringArray : string[] = [];
    let dataPoints : IGridchartsDataPoint[] = [];

    /**
     * Get entire date range
     * miliseconds for "2021-01-31" is 1612127321000
     * 
     * 1012127321000; 
     * 1612127321000
     */

    let firstTime = 2512127321000; 
    let lastTime = 1012127321000;
    let firstDate = "";
    let lastDate = "";

    allItems.map( item => {
      let theStartTimeMS = item['time' + this.props.dateColumn ].milliseconds;
      let theStartTimeStr = item['time' + this.props.dateColumn ].theTime;

      if ( theStartTimeMS > lastTime ) { 
        lastTime = theStartTimeMS ; 
        lastDate = theStartTimeStr ; }

      if ( theStartTimeMS < firstTime ) { 
        firstTime = theStartTimeMS ; 
        firstDate = theStartTimeStr ; }

    });

    let startDate = new Date( firstDate );
    startDate.setHours(0,0,0,0);
    let gridStart = new Date( startDate.setDate(0) ) ;
    let endDate = new Date( lastDate );
    endDate.setHours(0,0,0,0);

    //https://stackoverflow.com/a/222439
    let gridEnd  = new Date( endDate.getFullYear(), endDate.getMonth() + 1, 0 );
    //let gridEnd = new Date( tempEnd.toLocaleString() );
    entireDateArray = this.getDates( gridStart, gridEnd);
    entireDateArray.map ( d => { entireDateStringArray.push( d.toLocaleDateString() ) ; });

    /**
     * Build the IGridchartsDataPoint[] array
     */

    entireDateArray.map( theDate => {
      dataPoints.push( {
        date: theDate,
        dateString: theDate.toLocaleDateString(),
        label: '',
        dataLevel: null,
        value: null,
        count: 0,
        sum: null,
        avg: null,
        min: null,
        max: null,
        values: [],
        valuesString: [],
        items: [],
      });
    });

    /**
     * Go through items and add to dataPoints
     */

    let minValue = 951212732100099;
    let maxValue = -951212732100099;

    allItems.map( item => {
      let itemDateProp = item['time' + this.props.dateColumn ];
      let itemDate = new Date( itemDateProp.theTime ).toLocaleDateString();
      let dateIndex = entireDateStringArray.indexOf( itemDate ) ;
      item.dateIndex = dateIndex;

      let valueColumn = item[ this.props.valueColumn ];
      let valueType = typeof valueColumn;

      if ( valueType === 'string' ) { valueColumn = parseFloat( valueColumn ) ; }
      else if ( valueType === 'number' ) { valueColumn = parseFloat( valueColumn ) ; }
      else if ( valueType === 'boolean' ) { valueColumn = valueColumn === true ? 1 : 0 ; }
      else if ( valueType === 'object' ) { valueColumn = 0 ; }
      else if ( valueType === 'undefined' ) { valueColumn = 0 ; }
      else if ( valueType === 'function' ) { valueColumn = 0 ; }

      dataPoints[dateIndex].items.push( item );
      dataPoints[dateIndex].values.push( valueColumn );
      dataPoints[dateIndex].valuesString.push( valueColumn.toFixed(2) );

      dataPoints[dateIndex].count ++;
      dataPoints[dateIndex].sum += valueColumn;      
      if ( dataPoints[dateIndex].min === null || dataPoints[dateIndex].min > valueColumn ) { dataPoints[dateIndex].min = valueColumn; }  
      if ( dataPoints[dateIndex].max === null || dataPoints[dateIndex].max < valueColumn ) { dataPoints[dateIndex].max = valueColumn; }  

      let compareValue = dataPoints[dateIndex][ this.props.valueOperator.toLowerCase() ] ;
      if ( compareValue < minValue ) { minValue = compareValue; }
      if ( compareValue > maxValue ) { maxValue = compareValue; }      

    });

    /**
     * Update datalevel based on min/max
     */
    
    let dataLevelIncriment = ( maxValue - minValue ) / 3;

    dataPoints.map( data => {
      data.avg = data.count !== null && data.count !== undefined && data.count !== 0 ? data.sum / data.count : null;
      data.value = data[ this.props.valueOperator.toLowerCase() ] ;

      if ( data.count === 0 ) { data.dataLevel = 0 ; }
      else if ( data.value > ( maxValue - 1 * dataLevelIncriment ) ) { data.dataLevel = 3 ; }
      else if ( data.value > ( maxValue - 2 * dataLevelIncriment ) ) { data.dataLevel = 2 ; }
      else if ( data.value > ( maxValue - 3 * dataLevelIncriment ) ) { data.dataLevel = 1 ; }
      else { data.dataLevel = 0 ; }

      data.label = data.count === 0 ? `${data.dateString} : No data available` : `${data.dateString} : ${this.props.valueOperator} = ${data.value.toFixed(this.props.valueOperator === 'count' ? 0 : 2 )}  ( ${data.valuesString.join(', ') } )`;
    });

    let gridData: IGridchartsData = {

      gridStart: gridStart,
      gridEnd: gridEnd,
      startDate: startDate,
      endDate: endDate,
      entireDateArray: entireDateArray,
      entireDateStringArray: entireDateStringArray,
      dataPoints: dataPoints,

    };

    return gridData;

  }

}
