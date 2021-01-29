import * as React from 'react';
import styles from '../Gridcharts.module.scss';
import { IGridchartsProps } from './IGridchartsProps';
import { IGridchartsState, IGridchartsData } from './IGridchartsState';
import { escape } from '@microsoft/sp-lodash-subset';


import InfoPage from '../HelpInfo/infoPages';

import { saveTheTime, saveAnalytics, getTheCurrentTime } from '../../../../services/createAnalytics';
import { getAge, getDayTimeToMinutes, getBestTimeDelta, getLocalMonths, getTimeSpan, getGreeting,
          getNicks, makeTheTimeObject, getTimeDelta, monthStr3, monthStr, weekday3} from '@mikezimm/npmfunctions/dist/dateServices';


import { sortObjectArrayByStringKey, doesObjectExistInArray } from '@mikezimm/npmfunctions/dist/arrayServices';

import { IPickedWebBasic, IPickedList, IMyProgress,
  IPivot, IMyPivots, ILink, IUser, IMyFonts, IMyIcons,
} from '../../../../services/IReUsableInterfaces';

import { createDrillList } from './GetListData';
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
      let gridData : IGridchartsData[] = [];
      let arrDates: any[] = [];
      let startDate = new Date();
      let endDate = new Date();
      endDate.setDate(endDate.getDate() + 365 - 2 );

      arrDates = this.getDates( startDate, endDate);

      for (var i = 1; i < 365; i++) {

        let data : IGridchartsData = {
          date: null,
          label: null,
          dataLevel: null,
        }

        const level : number = Math.floor(Math.random() * 3);  
        data.dataLevel= level ;
        let thisDate : Date = arrDates[ i- 1];
        data.label = thisDate.toLocaleDateString();
        data.date = thisDate;
        gridData.push( data ); 

      }
      return gridData;
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
         */
        let drillList = createDrillList(this.props.webURL, this.props.listName, false, this.props.refiners, this.props.rules, this.props.stats, null, this.props.toggles.togOtherChartpart, '');
        let errMessage = null;


        let gridData : IGridchartsData[] = this.createSampleGridData();

        console.log('gridData', gridData );

        const s1 = gridData[0].date.getMonth();
        const s2 = s1 + 12;

        const monthLables = monthStr3["en-us"].concat( ... monthStr3["en-us"] ).slice(s1,s2) ;
        const monthScales = [ 4,4,4,5,4,4,5,4,4,5,4,5   ,   4,4,4,5,4,4,5,4,4,5,4,5 ].slice(s1,s2) ;

        let entireDateArray = [];

        this.state = { 

          //Size courtesy of https://www.netwoven.com/2018/11/13/resizing-of-spfx-react-web-parts-in-different-scenarios/
          WebpartHeight: this.props.WebpartElement ? this.props.WebpartElement.getBoundingClientRect().height : null,
          WebpartWidth:  this.props.WebpartElement ? this.props.WebpartElement.getBoundingClientRect().width - 50 : null,

          monthLables: monthLables,
          monthScales: monthScales,

          selectedYear: null,
          selectedUser: null,
          
          entireDateArray: entireDateArray,

          gridData: gridData,

          drillList: drillList,

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

          webURL: this.props.webURL,

          searchMeta: null, // [pivCats.all.title],
          searchText: '',

          errMessage: errMessage,
          
          pivotCats: [],

//          style: this.props.style ? this.props.style : 'commandBar',

        };                            

    }


    public componentDidMount() {

      //this._getListItems();
      
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

      let rebuildTiles = false;
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

//    const squares = document.querySelector(styles.squares);
//    const squares = document.querySelector(styles.squares);

    const squares : any[] = [];

    this.state.gridData.map( ( d ) => {
      squares.push( <li title={ d.label + ' : ' + d.dataLevel } data-level={ d.dataLevel }></li> ) ;
    });

    const months : any[] = this.state.monthLables;
    const days : any[] = weekday3['en-us'];

    const gridTemplateColumns : string = this.state.monthScales.map( v => 20*v*.9 + 'px').join( ' ');

    return (
      <div className={ styles.gridcharts }>
        <div className={ styles.container }>

          <div className={styles.graph} style={{ width: '900px' }}>
            <ul className={styles.months} style={{ listStyleType: 'none', gridTemplateColumns: gridTemplateColumns }}>
              { months.map( m=> { return <li> { m } </li> ; }) }
            </ul>
            <ul className={styles.days} style={{ listStyleType: 'none' }}>
                { days.map( d=> { return <li> { d } </li> ; }) }
            </ul>
            <ul className={styles.squares} style={{ listStyleType: 'none' }}>
              { squares }
            </ul>
          </div>

        </div>
      </div>
    );
  }
}
