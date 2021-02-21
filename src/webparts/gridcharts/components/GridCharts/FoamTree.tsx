import * as React from 'react';
import styles from './FoamTree.module.scss';
import { IFoamTreeProps } from './IFoamTreeProps';
import { IFoamTreeState, IFoamTreeData, IFoamTreeDataPoint, IGridItemInfo, ITimeScale } from './IFoamTreeState';
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

import  EarlyAccess from '../HelpInfo/EarlyAccess';
import * as links from '../HelpInfo/AllLinks';

import { createSlider, createChoiceSlider } from '../fields/sliderFieldBuilder';

import { saveTheTime, saveAnalytics, getTheCurrentTime } from '../../../../services/createAnalytics';
import { getAge, getDayTimeToMinutes, getBestTimeDelta, getLocalMonths, getTimeSpan, getGreeting,
          getNicks, makeTheTimeObject, makeSmallTimeObject, ISO8601_week_no, getTimeDelta, monthStr3, monthStr, weekday3, msPerDay} from '@mikezimm/npmfunctions/dist/dateServices';


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

export default class FoamTree extends React.Component<IFoamTreeProps, IFoamTreeState> {

  
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
      let allDataPoints : IFoamTreeDataPoint[] = [];

      for (var i = 1; i < 365; i++) {

        let data : IFoamTreeDataPoint = {
          date: null,
          dateNo: null,
          dayNo: null,
          week: null,
          month: null,
          year: null,
          yearMonth: null,
          yearWeek: null,

          yearIndex: null,
          yearMonthIndex: null,
          yearWeekIndex: null,

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
        allDataPoints.push( data ); 

      }
      return allDataPoints;
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


    public constructor(props:IFoamTreeProps){
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
        let selectedDropdowns: string[] = [];
        allColumns.push( this.props.dateColumn );
        allColumns.push( this.props.valueColumn );

        searchColumns.map( c => { allColumns.push( c ) ; });
        metaColumns.map( c => { allColumns.push( c ) ; });

        let dropDownSort : string[] = dropDownColumns.map( c => { let c1 = c.replace('>','') ; if ( c1.indexOf('-') === 0 ) { return 'dec' ; } else if ( c1.indexOf('+') === 0 ) { return 'asc' ; } else { return ''; } });

        dropDownColumns.map( c => { let c1 = c.replace('>','').replace('+','').replace('-','') ; searchColumns.push( c1 ) ; metaColumns.push( c1 ) ; allColumns.push( c1 ); selectedDropdowns.push('') ; });


        let gridList = createGridList( this.props.parentListWeb, null, this.props.parentListTitle, null, null, this.props.performance, this.props.pageContext, allColumns, searchColumns, metaColumns, expandDates, dropDownColumns, dropDownSort );
        /**
         * Add this at this point to be able to search on specific odata types
         * gridList.odataSearch = ['odata.type'];
        */

        let errMessage = null;

        let allDataPoints : IFoamTreeDataPoint[] = this.createSampleGridData();

        //console.log('gridData', allDataPoints );

        const s1 = allDataPoints[0].date.getMonth();
        const s2 = s1 + 12;

        const monthLables = monthStr3["en-us"].concat( ... monthStr3["en-us"] ).slice(s1,s2) ;
        const monthScales = [ 4,4,4,5,4,4,5,4,4,5,4,5   ,   4,4,4,5,4,4,5,4,4,5,4,5 ].slice(s1,s2) ;

        let allDateArray = [];

        let gridData: IFoamTreeData = {

          startDate: null,
          endDate: null,
          gridEnd: null,
          gridStart: null,

          allDataPoints: allDataPoints,
          allDateArray: allDateArray,
          allDateStringArray: [],

          allYearsStringArray: [],
          allMonthsStringArray: [],
          allWeekNosStringArray: [],

          allWeeks: 0,

          visibleDataPoints: [],
          visibleDateArray: [],
          visibleDateStringArray: [],
          visibleWeeks: 0,
          
          total: null,
          count: 0,
          leadingBlanks: 0,

        };

        this.state = { 

          //Size courtesy of https://www.netwoven.com/2018/11/13/resizing-of-spfx-react-web-parts-in-different-scenarios/
          WebpartHeight: this.props.WebpartElement ? this.props.WebpartElement.getBoundingClientRect().height : null,
          WebpartWidth:  this.props.WebpartElement ? this.props.WebpartElement.getBoundingClientRect().width - 50 : null,

          monthLables: monthLables,
          monthScales: monthScales,

          sliderValueWeek: 0,

          sliderValueYear: 0,
          sliderValueMonth: 0,
          sliderValueWeekNo: 0,

          timeSliderScale: [ 'Weeks', 'Years', 'Months', 'WeekNo'],
          currentTimeScale: 'Weeks',

          choiceSliderValue: 0,
          breadCrumb: [],
          choiceSliderDropdown: null,
          showChoiceSlider: false,

          dropdownColumnIndex: null,

          selectedYear: null,
          selectedUser: null,
          selectedDropdowns: selectedDropdowns,
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

    componentDidMount() {

    }
    
    componentDidUpdate() {
      if (this.props.groups !== this.foamtree.get("dataObject").groups) {
      this.foamtree.set("dataObject", {
        groups: this.props.groups
      });
      }
    }
    
    componentWillUnmount() {
      this.foamtree.dispose();
    }
    
    render() {
      return <div style={{height: "100%"}} ref={e => this.element = e}></div>;
    }



/***
 *         db    db d8888b.      .d8888. db      d888888b d8888b. d88888b d8888b. 
 *         88    88 88  `8D      88'  YP 88        `88'   88  `8D 88'     88  `8D 
 *         88    88 88oodD'      `8bo.   88         88    88   88 88ooooo 88oobY' 
 *         88    88 88~~~          `Y8b. 88         88    88   88 88~~~~~ 88`8b   
 *         88b  d88 88           db   8D 88booo.   .88.   88  .8D 88.     88 `88. 
 *         ~Y8888P' 88           `8888Y' Y88888P Y888888P Y8888D' Y88888P 88   YD 
 *                                                                                
 *                                                                                
 */
  
private _updateTimeSliderWeeks(newValue: number){

  let now = new Date();
  let then = new Date();
  then.setMinutes(then.getMinutes() + newValue);

  if ( this.props.scaleMethod === 'slider' || this.props.scaleMethod === 'blink' ) {
    //Just update slider, render method does transition with css
    this.setState({
      sliderValueWeek: newValue,
    });
  } else if ( this.props.scaleMethod === 'TBD' ) { //Update grid selected elements and date range

  }

}

private _updateCurrentTimeScale( e: any ) {
  let currentTimeScale : ITimeScale = this.state.currentTimeScale;

  if ( e.ctrlKey === true ) {
    console.log('_updateCurrentTimeScale CTRL clicked');
    if ( currentTimeScale === 'Weeks' ) { currentTimeScale = 'Years' ; }
    else if ( currentTimeScale === 'Years' ) { currentTimeScale = 'Months' ; }
    else if ( currentTimeScale === 'Months' ) { currentTimeScale = 'WeekNo' ; }
    else if ( currentTimeScale === 'WeekNo' ) { currentTimeScale = 'Weeks' ; }
  
    this.setState({
      currentTimeScale: currentTimeScale,
    });

  }


}

private _updateTimeSliderPeriods(newValue: number){
  let currentTimeScale : ITimeScale = this.state.currentTimeScale;
  let now = new Date();
  let then = new Date();
  then.setMinutes(then.getMinutes() + newValue);

  if ( this.props.scaleMethod === 'slider' || this.props.scaleMethod === 'blink' ) {
    //Just update slider, render method does transition with css

    if ( currentTimeScale === 'Weeks' ) { this.setState({ sliderValueWeek: newValue, }) ; }
    else if ( currentTimeScale === 'Years' ) { this.setState({ sliderValueYear: newValue, }) ; }
    else if ( currentTimeScale === 'Months' ) { this.setState({ sliderValueMonth: newValue, }) ; }
    else if ( currentTimeScale === 'WeekNo' ) { this.setState({ sliderValueWeekNo: newValue, }) ; }

  } else if ( this.props.scaleMethod === 'TBD' ) { //Update grid selected elements and date range

  }


}



private _updateChoiceSlider(newValue: number){

  let choiceSliderDropdown = this.state.choiceSliderDropdown;


  let theChoice = newValue > -1 ? `${ this.state.dropDownItems[choiceSliderDropdown][newValue].text }` : '' ;
  console.log('_updateChoiceSlider: choiceSliderDropdown, newValue, theChoice', choiceSliderDropdown, newValue, theChoice );

  this.setState({
    choiceSliderValue: newValue,
  });

  this.fullSearch( theChoice, null, this.state.currentTimeScale );

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
  private textSearch = ( searchText: string ): void => {

    this.fullSearch( null, searchText, this.state.currentTimeScale );

  }

  public searchForItems = (item, choiceSliderDropdown: number, ev: any): void => {

    let choiceSliderValue = null;  //choiceSliderValue

    let showChoiceSlider = this.state.showChoiceSlider;
    if ( ev.ctrlKey === true ) { 
      showChoiceSlider = true;
    } else if ( ev.altKey === true ) { 
      showChoiceSlider = false;
    }

    this.state.dropDownItems[choiceSliderDropdown].map( ( dd, ddIndex ) => {
      if ( dd.text === item ) { choiceSliderValue = ddIndex ; }
    });

    this.setState({
      choiceSliderDropdown: choiceSliderDropdown, //Number of Dropdown ( ie 1 2 or 3 )
      choiceSliderValue: choiceSliderValue, // Selected Choice of Dropdown
      showChoiceSlider: showChoiceSlider,
    });

    console.log('searchForItems: ',item, choiceSliderDropdown, choiceSliderValue, ev ) ;
    this.fullSearch( item, null, this.state.currentTimeScale );

  }

  public fullSearch = (item: any, searchText: string , currentTimeScale: ITimeScale, ): void => {

    //This sends back the correct pivot category which matches the category on the tile.
    let e: any = event;

    /*
    console.log('searchForItems: e',e);
    console.log('searchForItems: item', item);
    console.log('searchForItems: this', this);


   
   if ( currentTimeScale === 'Weeks' ) { this.setState({ sliderValueWeek: newValue, }) ; }
   else if ( currentTimeScale === 'Years' ) { this.setState({ sliderValueYear: newValue, }) ; }
   else if ( currentTimeScale === 'Months' ) { this.setState({ sliderValueMonth: newValue, }) ; }
   else if ( currentTimeScale === 'WeekNo' ) { this.setState({ sliderValueWeekNo: newValue, }) ; }
    */

    let searchItems : IGridItemInfo[] = [];
    let newFilteredItems: IGridItemInfo[]  = [];

    searchItems =this.state.allItems;

    let searchCount = searchItems.length;

    let selectedDropdowns = this.state.selectedDropdowns;
    let dropDownItems = this.state.dropDownItems;
    let dropdownColumnIndex = null; //Index of dropdown column that was picked

    if ( searchText === null ) { //Then this is a choice dropdown filter

      dropDownItems.map ( ( thisDropDown, ddIndex ) => {
        thisDropDown.map( thisChoice => {
          if ( dropdownColumnIndex === null && thisChoice.text === item ) { dropdownColumnIndex = ddIndex ; thisChoice.isSelected = true ; }  else { thisChoice.isSelected = false;} 
        });
      });

      selectedDropdowns.map( (dd, index ) => {
        if ( dropdownColumnIndex !== null ) {  //This should never be null but just in case... 
          selectedDropdowns[index] = dropdownColumnIndex === index ? item : ''; 
        }
      });

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
    } else { //This is a text box filter

      //Clears the selectedDropdowns array
      selectedDropdowns.map( (dd, index ) => {
          selectedDropdowns[index] = ''; 
      });

      //Sets isSelected on all dropdown options to false
      dropDownItems.map ( ( thisDropDown ) => {
        thisDropDown.map( thisChoice => {
         thisChoice.isSelected = false;
        });
      });

      if ( searchText == null || searchText === '' ) {
        newFilteredItems = searchItems;
      } else {
        let searchTextLC = searchText.toLowerCase();
        for (let thisItem of searchItems) {
          if(thisItem.searchString.indexOf( searchTextLC ) > -1) {
            newFilteredItems.push(thisItem);
          }
        }
      }
    }

    searchCount = newFilteredItems.length;

    let gridData : IFoamTreeData = this.buildGridData (this.state.gridList, newFilteredItems);
    
    const s1 = gridData.startDate.getMonth();
    const s2 = s1 + 12;

    const monthLables = monthStr3["en-us"].concat( ... monthStr3["en-us"] ).slice(s1,s2) ;
    const monthScales = [ 4,4,4,5,4,4,5,4,4,5,4,5   ,   4,4,4,5,4,4,5,4,4,5,4,5 ].slice(s1,s2) ;

    this.setState({
      /*          */
        searchedItems: newFilteredItems, //newFilteredItems,  //Replaced with theseItems to update when props change.
        searchCount: newFilteredItems.length,
        searchText: searchText,
        searchMeta: [],
        dropDownItems: dropDownItems,
        selectedDropdowns: selectedDropdowns,
        dropdownColumnIndex: dropdownColumnIndex,
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

      let gridData : IFoamTreeData = this.buildGridData (gridList, theseItems);

      gridData= this.buildVisibleItems ( gridData, gridList );

      let dropDownItems : IDropdownOption[][] = allNewData === true ? this.buildDataDropdownItems( gridList, allItems ) : this.state.dropDownItems ;
      
      const s1 = gridData.startDate.getMonth();
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

  private buildVisibleItems( gridData : IFoamTreeData , gridList : IGridList ) {

    return gridData;
  }


  private buildDataDropdownItems( gridList: IGridList, allItems : IGridItemInfo[] ) {

    let dropDownItems : IDropdownOption[][] = [];

    this.props.dropDownColumns.map( ( col, colIndex ) => {

      let actualColName = col.replace('>', '' ).replace('+', '' ).replace('-', '' );
      let parentColName = colIndex > 0 && col.indexOf('>') > -1 ? this.props.dropDownColumns[colIndex - 1] : null;
      parentColName = parentColName !== null ? parentColName.replace('>', '' ).replace('+', '' ).replace('-', '' ) : null;

      let thisColumnChoices : IDropdownOption[] = [];
      let foundChoices : string[] = [];
      allItems.map( item => {
        let thisItemsChoices = item[ actualColName ];
        if ( actualColName.indexOf( '/') > -1 ) {
          let parts = actualColName.split('/');
          thisItemsChoices = item[ parts[0] ] ? item[ parts[0] ] [parts[1]] :  `. missing ${ parts[0] }`;
        }
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

    //This will be in npmfunctions in v.0.0.5
    private getOffSetDayOfWeek ( d : string, day: number, which: 'prior' | 'next' ) {
      //First get current day number of week
      let theDate = new Date( d );
      let dayOfWeek = theDate.getDay();
      if ( dayOfWeek === day ) {
        return theDate; 

      } else {
        let deltaDays = which === 'prior' ? -dayOfWeek :  7 - dayOfWeek ;
        let deltaMS = deltaDays * msPerDay;
        let adjustedTime = theDate.getTime() + deltaMS;
        let adjustedDate = new Date( adjustedTime );

        return adjustedDate;
      }
  } 

  private getYearMonthLabel ( theDate : Date ) {

    let year = theDate.getFullYear();
    let month = theDate.getMonth();
    let monthNo = ( month + 1 ).toString();
    let monthLabel : any = year + ' : ' + monthNo + '-' + monthStr3["en-us"][month];

    return monthLabel;

  }

  private getYearWeekLabel ( theDate : Date ) {

    let year = theDate.getFullYear();
    let weekNo = ISO8601_week_no(theDate).toString();
    if ( weekNo.length === 1 ) { weekNo = "0" + weekNo; }
    let weekLabel : any = year + ' :  w' + weekNo ;
    return weekLabel;

  }

  private buildGridData ( gridList: IGridList, allItems : IGridItemInfo[] ) {
    
    let count = allItems.length;

    let allDateArray : any[] = [];
    let allDateStringArray : string[] = [];

    let allYearsStringArray: string[] = [];
    let allMonthsStringArray: string[] = [];
    let allWeekNosStringArray: string[] = [];

    let allDataPoints : IFoamTreeDataPoint[] = [];

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
    // let gridStart = this.getOffSetDayOfWeek( firstDate, 7, 'prior' ); //This gets prior sunday
    let gridStart  = new Date( startDate.getFullYear(), startDate.getMonth() , 1 ); //First day of this month

    let priorSundayStart = this.getOffSetDayOfWeek( gridStart.toDateString(), 7, 'prior' ); //This gets prior sunday
    
    let leadingBlanks = getTimeDelta( priorSundayStart, gridStart, 'days' ) + 1; //Days gives full days but not difference between dates so I'm taking away 1 day.

    gridStart.setHours(0,0,0,0);
    let endDate = this.getOffSetDayOfWeek( lastDate, 7, 'next' );
    endDate.setHours(0,0,0,0);

    // Last day of current month: https://stackoverflow.com/a/222439
    let gridEnd  = new Date( endDate.getFullYear(), endDate.getMonth() + 1, 0 );
    //let gridEnd = new Date( tempEnd.toLocaleString() );
    allDateArray = this.getDates( gridStart, gridEnd);
    allDateArray.map ( d => { 
      allDateStringArray.push( d.toLocaleDateString() ) ;

      let thisYear = d.getFullYear();
      let yearMonth : any = this.getYearMonthLabel(d);
      let yearWeek : any = this.getYearWeekLabel(d);

      if (  allYearsStringArray.indexOf( thisYear.toString() ) < 0 ) {  allYearsStringArray.push( thisYear.toString() ) ; }
      if (  allMonthsStringArray.indexOf( yearMonth ) < 0 ) {  allMonthsStringArray.push( yearMonth ) ; }
      if (  allWeekNosStringArray.indexOf( yearWeek ) < 0 ) {  allWeekNosStringArray.push( yearWeek ) ; }

    });

    /**
     * Build the IFoamTreeDataPoint[] array
     */

    allDateArray.map( theDate => {
      allDataPoints.push( {
        date: theDate,

        dateNo: theDate.getDate(),
        dayNo: theDate.getDay(),
        week: null,
        month: theDate.getMonth(),
        year: theDate.getFullYear(),
        yearMonth: this.getYearMonthLabel( theDate ),
        yearWeek: this.getYearWeekLabel( theDate ),

        yearIndex: null,
        yearMonthIndex: null,
        yearWeekIndex: null,

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
     * Go through items and add to allDataPoints
     */

    let minValue = 951212732100099;
    let maxValue = -951212732100099;
    let gridDataTotal = 0;
    let valueOperator = this.props.valueOperator.toLowerCase() ;

    allItems.map( item => {
      let itemDateProp = item['time' + this.props.dateColumn ];
      let itemDateDate = new Date( itemDateProp.theTime );
      let itemDate = itemDateDate.toLocaleDateString();
      let dateIndex = allDateStringArray.indexOf( itemDate ) ;
      item.dateIndex = dateIndex;

      item.dateNo = itemDateProp.date;
      item.dayNo = itemDateProp.day;
      item.week = itemDateProp.week;
      item.month = itemDateProp.month;
      item.year = itemDateProp.year;
      
      let yearMonth : any =this.getYearMonthLabel( itemDateDate ) ;
      let yearWeek : any = this.getYearWeekLabel( itemDateDate ) ;

      item.yearMonth = yearMonth;
      item.yearWeek = yearWeek;

      item.yearIndex = allYearsStringArray.indexOf( item.year.toString() ) ;
      item.yearMonthIndex = allMonthsStringArray.indexOf( yearMonth ) ;
      item.yearWeekIndex = allWeekNosStringArray.indexOf( yearWeek ) ;

      item.meta.push( item.yearMonth ) ;
      item.meta.push( item.yearWeek ) ;
      item.meta.push( item.year.toString() ) ;

      item.searchString += 'yearMonth=' + item.yearMonth + '|||' + 'yearWeek=' + item.yearWeek + '|||' + 'year=' + item.year + '|||' + 'week=' + item.week + '|||';

      let valueColumn = item[ this.props.valueColumn ];
      let valueType = typeof valueColumn;

      if ( valueType === 'string' ) { valueColumn = parseFloat( valueColumn ) ; }
      else if ( valueType === 'number' ) { valueColumn = parseFloat( valueColumn ) ; }
      else if ( valueType === 'boolean' ) { valueColumn = valueColumn === true ? 1 : 0 ; }
      else if ( valueType === 'object' ) { valueColumn = 0 ; }
      else if ( valueType === 'undefined' ) { valueColumn = 0 ; }
      else if ( valueType === 'function' ) { valueColumn = 0 ; }

      allDataPoints[dateIndex].items.push( item );
      allDataPoints[dateIndex].values.push( valueColumn );
      allDataPoints[dateIndex].valuesString.push( valueColumn.toFixed(2) );

      allDataPoints[dateIndex].count ++;
      allDataPoints[dateIndex].sum += valueColumn;      
      if ( allDataPoints[dateIndex].min === null || allDataPoints[dateIndex].min > valueColumn ) { allDataPoints[dateIndex].min = valueColumn; }  
      if ( allDataPoints[dateIndex].max === null || allDataPoints[dateIndex].max < valueColumn ) { allDataPoints[dateIndex].max = valueColumn; }  

      if ( allDataPoints[dateIndex].yearIndex === null ) { allDataPoints[dateIndex].yearIndex = item.yearIndex; }  
      if ( allDataPoints[dateIndex].yearMonthIndex === null ) { allDataPoints[dateIndex].yearMonthIndex = item.yearMonthIndex; }  
      if ( allDataPoints[dateIndex].yearWeekIndex === null ) { allDataPoints[dateIndex].yearWeekIndex = item.yearWeekIndex; }  

      let compareValue = allDataPoints[dateIndex][ valueOperator ] ;
      if ( compareValue < minValue ) { minValue = compareValue; }
      if ( compareValue > maxValue ) { maxValue = compareValue; } 

      if ( valueOperator === 'sum' || valueOperator === 'avg' ) { gridDataTotal += valueColumn ; } 
      else if ( valueOperator === 'count' ) { gridDataTotal ++ ; } 
      else if ( valueOperator === 'max' && valueColumn > gridDataTotal ) { gridDataTotal = valueColumn ; } 
      else if ( valueOperator === 'min' && valueColumn < gridDataTotal ) { gridDataTotal = valueColumn ; } 

    });

    if ( valueOperator === 'avg' ) { gridDataTotal = count != 0 ? gridDataTotal / count : null ; } 

    /**
     * Update datalevel based on min/max
     */
    
    let dataLevelIncriment = ( maxValue - minValue ) / 3;

    allDataPoints.map( data => {
      data.avg = data.count !== null && data.count !== undefined && data.count !== 0 ? data.sum / data.count : null;
      data.value = data[ this.props.valueOperator.toLowerCase() ] ;

      if ( data.count === 0 ) { data.dataLevel = 0 ; }
      else if ( data.value > ( maxValue - 1 * dataLevelIncriment ) ) { data.dataLevel = 3 ; }
      else if ( data.value > ( maxValue - 2 * dataLevelIncriment ) ) { data.dataLevel = 2 ; }
      else if ( data.value >= minValue ) { data.dataLevel = 1 ; }
      else { data.dataLevel = 0 ; }

      data.label = data.count === 0 ? `${data.dateString} : No data available` : `${data.dateString} : ${this.props.valueOperator} = ${data.value.toFixed(this.props.valueOperator === 'count' ? 0 : 2 )}  ( ${data.valuesString.join(', ') } )`;
    });

    let gridData: IFoamTreeData = {
      total: gridDataTotal,
      count: count,
      leadingBlanks: leadingBlanks,
      gridStart: startDate,
      gridEnd: gridEnd,
      startDate: startDate,
      endDate: endDate,

      allWeeks: 0,
      allDateArray: allDateArray,
      allDateStringArray: allDateStringArray,
      
      allYearsStringArray: allYearsStringArray,
      allMonthsStringArray: allMonthsStringArray,
      allWeekNosStringArray: allWeekNosStringArray,

      allDataPoints: allDataPoints,
                
      visibleDataPoints: [],
      visibleDateArray: [],
      visibleDateStringArray: [],
      visibleWeeks: 0,

    };

    return gridData;

  }

}
