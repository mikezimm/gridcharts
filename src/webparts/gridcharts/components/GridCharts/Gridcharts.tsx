import * as React from 'react';
import styles from './Gridcharts.module.scss';
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

import  EarlyAccess from '../HelpInfo/EarlyAccess';
import * as links from '../HelpInfo/AllLinks';

import { createSlider, createChoiceSlider } from '../fields/sliderFieldBuilder';

import { saveTheTime, saveAnalytics, getTheCurrentTime } from '../../../../services/createAnalytics';
import { getAge, getDayTimeToMinutes, getBestTimeDelta, getLocalMonths, getTimeSpan, getGreeting,
          getNicks, makeTheTimeObject, getTimeDelta, monthStr3, monthStr, weekday3, msPerDay} from '@mikezimm/npmfunctions/dist/dateServices';


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
      let allDataPoints : IGridchartsDataPoint[] = [];

      for (var i = 1; i < 365; i++) {

        let data : IGridchartsDataPoint = {
          date: null,
          dateNo: null,
          dayNo: null,
          week: null,
          month: null,
          year: null,
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

        let allDataPoints : IGridchartsDataPoint[] = this.createSampleGridData();

        //console.log('gridData', allDataPoints );

        const s1 = allDataPoints[0].date.getMonth();
        const s2 = s1 + 12;

        const monthLables = monthStr3["en-us"].concat( ... monthStr3["en-us"] ).slice(s1,s2) ;
        const monthScales = [ 4,4,4,5,4,4,5,4,4,5,4,5   ,   4,4,4,5,4,4,5,4,4,5,4,5 ].slice(s1,s2) ;

        let allDateArray = [];

        let gridData: IGridchartsData = {

          startDate: null,
          endDate: null,
          gridEnd: null,
          gridStart: null,

          allDataPoints: allDataPoints,
          allDateArray: allDateArray,
          allDateStringArray: [],
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

          timeSliderValue: 0,
          choiceSliderValue: 0,
          breadCrumb: [],
          choiceSliderDropdown: null,
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
        'pivotSize', 'pivotFormat', 'pivotOptions', 'pivotTab', 'advancedPivotStyles', 'gridStyles',

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

        dropDownColumns.map( c => { let c1 = c.replace('>','').replace('+','').replace('-','') ; searchColumns.push( c1 ) ; metaColumns.push( c1 ) ; allColumns.push( c1 ); });

        let gridList = createGridList(this.props.parentListWeb, null, this.props.parentListTitle, null, null, this.props.performance, this.props.pageContext, allColumns, searchColumns, metaColumns, expandDates, dropDownColumns, dropDownSort );

        getAllItems( gridList, this.addTheseItemsToState.bind(this), null, null );
        
      } else if ( refreshMe === true ) {  this.setState({ }) ; }


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

    let gridElement = null;
    let searchStack = null;
    let timeSliderValue = this.state.timeSliderValue;

    let sliderTransform = null;
    let sliderMax = ( this.state.gridData.allDateArray.length -365 ) / 7 + 1;
    if ( sliderMax < 2 ) { sliderMax = 2 ; }

    const squares : any[] = [];

    if ( this.state.allLoaded === true ) {

      /**
       * These loops add leading squares and must be before pushing actual data
       */
      if ( this.props.scaleMethod === 'slider') {
        //Do nothing special at this time
        sliderTransform = this.props.scaleMethod === 'slider' ? "translate3d(" + ( -timeSliderValue ) + "vw, 0, 0)" : null;

      } else if ( this.props.scaleMethod === 'blink' && timeSliderValue < 0 ) {
          for (let i = 1; i < timeSliderValue * 7; i++) { //This just tests sliding grid animation
            squares.push(<li data-level={ -1 }></li>);
          }
          sliderTransform = '';
      }

      if ( this.state.gridData.leadingBlanks > 0 ) {
        for (let lb = 1; lb < this.state.gridData.leadingBlanks; lb++) { //this works for regular leading blanks
            squares.push(<li data-level={ -1 }></li>);
          }
      }

      /**
       * This loop adds all the real squares to the mix
       */
      this.state.gridData.allDataPoints.map( ( d, index ) => {
        if ( this.props.scaleMethod === 'blink' && timeSliderValue > 0 &&
            index < timeSliderValue * 7 ) {
          //Skip drawing these squares (this week is to left of grid )
        } else if ( squares.length < 370 ) { //Only push 1 year's worth of items

          //This will add 7 days of white spaces between months
          if ( index !== 0 && d.dateNo === 1 ) {
            for (let day = 0; day < 7; day++) { //this works for regular leading blanks
              squares.push(<li data-level={ -1 }></li>);
            }
          }
          
          squares.push( <li title={ d.label + ' : ' + d.dataLevel } data-level={ d.dataLevel }></li> ) ;

        }
      });
        

      /**
       * Adding overflow hidden on Squares limits visible squares to the width of the element.
       * BUT the entire year slides and is not trimmed by parent element size location... so the 1 year can slide over dates and off the screen.
       * Need to have something else mask it when it goes out of the visible area.
       * That would also mean having it not transparent so you have to fix the background color which may not match another color.
      */


      gridElement = <ul className={styles.squares} style={{ listStyleType: 'none', transform: sliderTransform, transition: 'transform .3s cubic-bezier(0, .52, 0, 1)' }}>
                        { squares }
                    </ul>;

      let searchElements = [];
      let choiceSlider = null;
      /**
       * Add Dropdown search
       */
        if ( this.state.dropDownItems.length > 0 ) {

          let choiceSliderDropdown = this.state.choiceSliderDropdown;
          if ( choiceSliderDropdown !== null ) {
            let choiceSliderValue = this.state.choiceSliderValue;
            let choiceMax = this.state.dropDownItems[choiceSliderDropdown].length -1 ;
  
            if ( choiceSliderValue !== null ) {
              console.log('choiceSliderValue, this.state.dropDownItems:', choiceSliderValue, this.state.dropDownItems);
              console.log('choiceSliderDropdown, this.state.dropDownItems[choiceSliderDropdown]:', choiceSliderDropdown, this.state.dropDownItems[choiceSliderDropdown]);
              let theChoice = choiceSliderValue > -1 ? `${ this.state.dropDownItems[choiceSliderDropdown][choiceSliderValue].text } ` : 'TBD' ;
  
              choiceSlider = this.state.dropDownItems.length === 0 ? null : 
                <div><div style={{position: 'absolute', paddingTop: '10px', paddingLeft: '30px'}}>{ /* theChoice */  }</div>
                  <Stack horizontal horizontalAlign='center' >
                    <div style={{ width: '30%', paddingLeft: '50px', paddingRight: '50px', paddingTop: '10px' }}>
                      { createChoiceSlider('Slideto adjust choice', theChoice , choiceMax, 1 , this._updateChoiceSlider.bind(this)) }
                    </div>
                  </Stack></div>;
              
            }
          }

          searchElements = this.state.dropDownItems.map( ( dropDownChoices, index ) => {

              let dropDownSort = this.state.gridList.dropDownSort[ index ];
              let dropDownChoicesSorted = dropDownSort === '' ? dropDownChoices : sortObjectArrayByStringKey( dropDownChoices, dropDownSort, 'text' );
              let DDLabel = this.state.gridList.dropdownColumns[ index ].replace('>','').replace('+','').replace('-','');
              return <Dropdown
                  placeholder={ `Select a ${ DDLabel }` }
                  label={ DDLabel }
                  options={dropDownChoicesSorted}
                  selectedKey={ this.state.selectedDropdowns [index ] === '' ? null : this.state.selectedDropdowns [index ] }
                  onChange={(ev: any, value: IDropdownOption) => {
                    this.searchForItems(value.key.toString(), index, ev);
                  }}
                  styles={{ dropdown: { width: 200 } }}
              />;
          });
        } 

        /**
         * Add Text search box
         */
        if ( this.props.enableSearch === true ) {

          let searchBox = <div>
          <div style={{ paddingTop: '20px' }}></div>
          <SearchBox className={ styles.searchBox }
              placeholder= { 'Search items' }
              iconProps={{ iconName : 'Search'}}
              onSearch={ this.textSearch.bind(this) }
              value={this.state.searchText}
              onChange={ this.textSearch.bind(this) } />
          </div>;

          searchElements.push( searchBox ) ;

        }

        searchStack = <div style={{marginLeft: '38px'}}>
                <Stack horizontal horizontalAlign="start" verticalAlign="end" wrap tokens={wrapStackTokens}>
                  { searchElements }
                </Stack>
                <div> { choiceSlider } </div>
            </div>;

    } else {

      gridElement = <div style={{ position: 'absolute', top: '50%', left: '42%' }}>
          <Spinner 
            size={SpinnerSize.large}
            label={ 'Loading data' }
            labelPosition='left'
          ></Spinner>
        </div> ;
    }

    let metrics = this.state.gridData.count > 0 ? `${ this.state.gridData.count } items with ${ this.props.valueOperator} of ${ this.props.valueColumn } = ${ this.state.gridData.total.toFixed(0) }` : 'TBD' ;

    let timeSlider = this.props.scaleMethod !== 'slider' &&  this.props.scaleMethod !== 'blink'? null : 
          <div><div style={{position: 'absolute', paddingTop: '10px', paddingLeft: '30px'}}>{ metrics }</div>
          <Stack horizontal horizontalAlign='center' >
            <div style={{ width: '30%', paddingLeft: '50px', paddingRight: '50px', paddingTop: '10px' }}>
              { createSlider('Slide to adjust range', timeSliderValue , sliderMax, 1 , this._updateTimeSlider.bind(this)) }
            </div>
          </Stack></div>;

    const months : any[] = this.state.monthLables;
    const days : any[] = weekday3['en-us'];

    const gridTemplateColumns : string = this.state.monthScales.map( v => 20*v*.9 + 'px').join( ' ');

    /**
     * Add early access bar
     */
    let earlyAccess = null;

    if ( this.props.showEarlyAccess === true ) {
      let messages : any[] = [];
      if ( this.state.WebpartWidth > 800 ) { 
          messages.push( <div><span><b>{ 'Welcome to ALV Webpart Early Access!!!' }</b></span></div> ) ;
          messages.push( <div><span><b>{ 'Get more info here -->' }</b></span></div> ) ;
      }
      else if ( this.state.WebpartWidth > 700 ) {
          messages.push( <div><span><b>{ 'Webpart Early Access!' }</b></span></div> ) ;
          messages.push( <div><span><b>{ 'More info ->' }</b></span></div> ) ;
      } else if ( this.state.WebpartWidth > 600 ) {
          messages.push( <div><span><b>{ 'info ->' }</b></span></div> ) ;
  
      } else if ( this.state.WebpartWidth > 400 ) {
          messages.push( <div><span><b>{ 'info ->' }</b></span></div> ) ;
      }
  
      earlyAccess = 
      <div style={{ paddingBottom: 10 }}>
        <EarlyAccess 
            image = { "https://autoliv.sharepoint.com/sites/crs/PublishingImages/Early%20Access%20Image.png" }
            messages = { messages }
            links = { [ this.state.WebpartWidth > 450 ? links.gitRepoGridCharts.wiki : null, 
                this.state.WebpartWidth > 600 ? links.gitRepoGridCharts.issues : null,
                this.state.WebpartWidth > 800 ? links.gitRepoGridCharts.projects : null ]}
            email = { 'mailto:General - WebPart Dev <0313a49d.Autoliv.onmicrosoft.com@amer.teams.ms>?subject=Drilldown Webpart Feedback&body=Enter your message here :)  \nScreenshots help!' }
            farRightIcons = { [ ] }
        ></EarlyAccess>
      </div>;

    }


    let theGraph = <div className={styles.graph} style={{ width: '900px' }}>
        <ul className={ styles.months } style={{ listStyleType: 'none', gridTemplateColumns: gridTemplateColumns, transform: sliderTransform, transition: 'transform .3s cubic-bezier(0, .52, 0, 1)' }}>
          { months.map( m=> { return <li> { m } </li> ; }) }
        </ul>
        <ul className={styles.days} style={{ listStyleType: 'none' }}>
            { days.map( d=> { return <li> { d } </li> ; }) }
        </ul>
        { gridElement }
      </div>;

    if ( this.state.errMessage !== '' && this.state.errMessage != null ) {
      let errMessageString : any = this.state.errMessage;
      let extraMessage1 = errMessageString.indexOf('Error making HttpClient request in queryable [404]') > -1 ? 'Verify Web URL is correct': null ;
      let extraMessage2 = errMessageString.indexOf('Error making HttpClient request in queryable [404]') > -1 ? this.props.parentListWeb.replace( this.props.tenant, '' ) : null ;

      theGraph = <div style={{ textAlign: 'center', margin: '50px', height: '100px', width: '80%%'}}>
                    <span style={{ fontSize: 'larger', fontWeight: 600, paddingTop: '40px'}}>
                      <mark>{ this.state.errMessage }</mark>
                    </span><p style={{ fontSize: 'larger', fontWeight: 600 }}> { extraMessage1 } : { extraMessage2 } </p></div> ;
    } else if ( this.state.allLoaded === true && this.state.searchedItems && this.state.searchedItems.length === 0 ) {
          theGraph = <div style={{ textAlign: 'center', margin: '50px', height: '100px', width: '80%'}}>
                    <span style={{ fontSize: 'larger', fontWeight: 600, paddingTop: '40px'}}>
                      Sorry but there were no items found meeting your search criteria!
                    </span></div> ;
    }

    return (
      <div className={ styles.gridcharts }>
        <div className={ styles.container }>
          { earlyAccess }
          { searchStack }
          { theGraph }
          { timeSlider }
        </div>
      </div>
    );
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
  
private _updateTimeSlider(newValue: number){

  let now = new Date();
  let then = new Date();
  then.setMinutes(then.getMinutes() + newValue);

  if ( this.props.scaleMethod === 'slider' || this.props.scaleMethod === 'blink' ) {
    //Just update slider, render method does transition with css
    this.setState({
      timeSliderValue: newValue,
    });
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

  this.fullSearch( theChoice, null );

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

    this.fullSearch( null, searchText );

  }

  public searchForItems = (item, choiceSliderDropdown: number, ev: any): void => {

    let choiceSliderValue = null;  //choiceSliderValue
    if ( ev.ctrlKey === true ) { 
      
      if ( choiceSliderDropdown !== this.state.choiceSliderDropdown && this.state.choiceSliderDropdown !== null ) { //Different CTRL-Dropdown was picked, reset the choiceSliderValue to null so it doesn't crash webpart.
        choiceSliderValue = null;
      } else { choiceSliderValue = this.state.choiceSliderValue }
      
      this.setState({
        choiceSliderDropdown: choiceSliderDropdown, //Number of Dropdown ( ie 1 2 or 3 )
        choiceSliderValue: choiceSliderValue, // Selected Choice of Dropdown
      });

    } else {

      this.state.dropDownItems[choiceSliderDropdown].map( ( dd, ddIndex ) => {
        if ( dd.text === item ) { choiceSliderValue = ddIndex ; }
      });

      this.setState({
        choiceSliderValue: choiceSliderValue, // Selected Choice of Dropdown
      });
    }

    console.log('searchForItems: ',item, choiceSliderDropdown, choiceSliderValue, ev ) ;
    this.fullSearch( item, null );

  }

  public fullSearch = (item: any, searchText: string ): void => {

    //This sends back the correct pivot category which matches the category on the tile.
    let e: any = event;

    /*
    console.log('searchForItems: e',e);
    console.log('searchForItems: item', item);
    console.log('searchForItems: this', this);
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

    let gridData : IGridchartsData = this.buildGridData (this.state.gridList, newFilteredItems);
    
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

      let gridData : IGridchartsData = this.buildGridData (gridList, theseItems);

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

  private buildVisibleItems( gridData : IGridchartsData , gridList : IGridList ) {

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

  private buildGridData ( gridList: IGridList, allItems : IGridItemInfo[] ) {
    
    let count = allItems.length;

    let allDateArray : any[] = [];
    let allDateStringArray : string[] = [];
    let allDataPoints : IGridchartsDataPoint[] = [];

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
    allDateArray.map ( d => { allDateStringArray.push( d.toLocaleDateString() ) ; });

    /**
     * Build the IGridchartsDataPoint[] array
     */

    allDateArray.map( theDate => {
      allDataPoints.push( {
        date: theDate,

        dateNo: theDate.getDate(),
        dayNo: theDate.getDay(),
        week: null,
        month: theDate.getMonth(),
        year: theDate.getFullYear(),

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
      let itemDate = new Date( itemDateProp.theTime ).toLocaleDateString();
      let dateIndex = allDateStringArray.indexOf( itemDate ) ;
      item.dateIndex = dateIndex;

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


    let gridData: IGridchartsData = {
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
      allDataPoints: allDataPoints,
                
      visibleDataPoints: [],
      visibleDateArray: [],
      visibleDateStringArray: [],
      visibleWeeks: 0,

    };

    return gridData;

  }

}
