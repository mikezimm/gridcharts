
/***
 *    d888888b .88b  d88. d8888b.  .d88b.  d8888b. d888888b       .d88b.  d88888b d88888b d888888b  .o88b. d888888b  .d8b.  db      
 *      `88'   88'YbdP`88 88  `8D .8P  Y8. 88  `8D `~~88~~'      .8P  Y8. 88'     88'       `88'   d8P  Y8   `88'   d8' `8b 88      
 *       88    88  88  88 88oodD' 88    88 88oobY'    88         88    88 88ooo   88ooo      88    8P         88    88ooo88 88      
 *       88    88  88  88 88~~~   88    88 88`8b      88         88    88 88~~~   88~~~      88    8b         88    88~~~88 88      
 *      .88.   88  88  88 88      `8b  d8' 88 `88.    88         `8b  d8' 88      88        .88.   Y8b  d8   .88.   88   88 88booo. 
 *    Y888888P YP  YP  YP 88       `Y88P'  88   YD    YP          `Y88P'  YP      YP      Y888888P  `Y88P' Y888888P YP   YP Y88888P 
 *                                                                                                                                  
 *                                                                                                                                  
 */

import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart, WebPartContext } from '@microsoft/sp-webpart-base';

import { PageContext } from '@microsoft/sp-page-context';

import { IPropertyFieldSite } from "@pnp/spfx-property-controls/lib/PropertyFieldSitePicker";

import { Web, IList, IItem, Item } from "@pnp/sp/presets/all";

// npm install @pnp/logging @pnp/common @pnp/odata @pnp/sp --save
import { sp } from '@pnp/sp';

/***
 *    d888888b .88b  d88. d8888b.  .d88b.  d8888b. d888888b      d8b   db d8888b. .88b  d88.      d88888b db    db d8b   db  .o88b. d888888b d888888b  .d88b.  d8b   db .d8888. 
 *      `88'   88'YbdP`88 88  `8D .8P  Y8. 88  `8D `~~88~~'      888o  88 88  `8D 88'YbdP`88      88'     88    88 888o  88 d8P  Y8 `~~88~~'   `88'   .8P  Y8. 888o  88 88'  YP 
 *       88    88  88  88 88oodD' 88    88 88oobY'    88         88V8o 88 88oodD' 88  88  88      88ooo   88    88 88V8o 88 8P         88       88    88    88 88V8o 88 `8bo.   
 *       88    88  88  88 88~~~   88    88 88`8b      88         88 V8o88 88~~~   88  88  88      88~~~   88    88 88 V8o88 8b         88       88    88    88 88 V8o88   `Y8b. 
 *      .88.   88  88  88 88      `8b  d8' 88 `88.    88         88  V888 88      88  88  88      88      88b  d88 88  V888 Y8b  d8    88      .88.   `8b  d8' 88  V888 db   8D 
 *    Y888888P YP  YP  YP 88       `Y88P'  88   YD    YP         VP   V8P 88      YP  YP  YP      YP      ~Y8888P' VP   V8P  `Y88P'    YP    Y888888P  `Y88P'  VP   V8P `8888Y' 
 *                                                                                                                                                                              
 *                                                                                                                                                                              
 */

import { makeTheTimeObject } from '@mikezimm/npmfunctions/dist/dateServices';

/***
 *    d888888b .88b  d88. d8888b.  .d88b.  d8888b. d888888b      .d8888. d88888b d8888b. db    db d888888b  .o88b. d88888b .d8888. 
 *      `88'   88'YbdP`88 88  `8D .8P  Y8. 88  `8D `~~88~~'      88'  YP 88'     88  `8D 88    88   `88'   d8P  Y8 88'     88'  YP 
 *       88    88  88  88 88oodD' 88    88 88oobY'    88         `8bo.   88ooooo 88oobY' Y8    8P    88    8P      88ooooo `8bo.   
 *       88    88  88  88 88~~~   88    88 88`8b      88           `Y8b. 88~~~~~ 88`8b   `8b  d8'    88    8b      88~~~~~   `Y8b. 
 *      .88.   88  88  88 88      `8b  d8' 88 `88.    88         db   8D 88.     88 `88.  `8bd8'    .88.   Y8b  d8 88.     db   8D 
 *    Y888888P YP  YP  YP 88       `Y88P'  88   YD    YP         `8888Y' Y88888P 88   YD    YP    Y888888P  `Y88P' Y88888P `8888Y' 
 *                                                                                                                                 
 *                                                                                                                                 
 */

import { propertyPaneBuilder } from '../../services/propPane/PropPaneBuilder';
 
require('../../services/GrayPropPaneAccordions.css');

 /***
 *    d888888b .88b  d88. d8888b.  .d88b.  d8888b. d888888b      db   db d88888b db      d8888b. d88888b d8888b. .d8888. 
 *      `88'   88'YbdP`88 88  `8D .8P  Y8. 88  `8D `~~88~~'      88   88 88'     88      88  `8D 88'     88  `8D 88'  YP 
 *       88    88  88  88 88oodD' 88    88 88oobY'    88         88ooo88 88ooooo 88      88oodD' 88ooooo 88oobY' `8bo.   
 *       88    88  88  88 88~~~   88    88 88`8b      88         88~~~88 88~~~~~ 88      88~~~   88~~~~~ 88`8b     `Y8b. 
 *      .88.   88  88  88 88      `8b  d8' 88 `88.    88         88   88 88.     88booo. 88      88.     88 `88. db   8D 
 *    Y888888P YP  YP  YP 88       `Y88P'  88   YD    YP         YP   YP Y88888P Y88888P 88      Y88888P 88   YD `8888Y' 
 *                                                                                                                       
 *                                                                                                                       
 */

import Gridcharts from './components/GridCharts/Gridcharts';


/***
 *    d888888b .88b  d88. d8888b.  .d88b.  d8888b. d888888b       .o88b.  .d88b.  .88b  d88. d8888b.  .d88b.  d8b   db d88888b d8b   db d888888b 
 *      `88'   88'YbdP`88 88  `8D .8P  Y8. 88  `8D `~~88~~'      d8P  Y8 .8P  Y8. 88'YbdP`88 88  `8D .8P  Y8. 888o  88 88'     888o  88 `~~88~~' 
 *       88    88  88  88 88oodD' 88    88 88oobY'    88         8P      88    88 88  88  88 88oodD' 88    88 88V8o 88 88ooooo 88V8o 88    88    
 *       88    88  88  88 88~~~   88    88 88`8b      88         8b      88    88 88  88  88 88~~~   88    88 88 V8o88 88~~~~~ 88 V8o88    88    
 *      .88.   88  88  88 88      `8b  d8' 88 `88.    88         Y8b  d8 `8b  d8' 88  88  88 88      `8b  d8' 88  V888 88.     88  V888    88    
 *    Y888888P YP  YP  YP 88       `Y88P'  88   YD    YP          `Y88P'  `Y88P'  YP  YP  YP 88       `Y88P'  VP   V8P Y88888P VP   V8P    YP    
 *                                                                                                                                               
 *                                                                                                                                               
 */

import * as strings from 'GridchartsWebPartStrings';

import { IGridchartsProps, IScaleMethod } from './components/GridCharts/IGridchartsProps';

/***
 *    d88888b db    db d8888b.  .d88b.  d8888b. d888888b      d888888b d8b   db d888888b d88888b d8888b. d88888b  .d8b.   .o88b. d88888b .d8888. 
 *    88'     `8b  d8' 88  `8D .8P  Y8. 88  `8D `~~88~~'        `88'   888o  88 `~~88~~' 88'     88  `8D 88'     d8' `8b d8P  Y8 88'     88'  YP 
 *    88ooooo  `8bd8'  88oodD' 88    88 88oobY'    88            88    88V8o 88    88    88ooooo 88oobY' 88ooo   88ooo88 8P      88ooooo `8bo.   
 *    88~~~~~  .dPYb.  88~~~   88    88 88`8b      88            88    88 V8o88    88    88~~~~~ 88`8b   88~~~   88~~~88 8b      88~~~~~   `Y8b. 
 *    88.     .8P  Y8. 88      `8b  d8' 88 `88.    88           .88.   88  V888    88    88.     88 `88. 88      88   88 Y8b  d8 88.     db   8D 
 *    Y88888P YP    YP 88       `Y88P'  88   YD    YP         Y888888P VP   V8P    YP    Y88888P 88   YD YP      YP   YP  `Y88P' Y88888P `8888Y' 
 *                                                                                                                                               
 *                                                                                                                                               
 */

export interface IGridchartsWebPartProps {
  description: string;
    // 0 - Context
    pageContext: PageContext;

    // 1 - Analytics options
    useListAnalytics: boolean;
    analyticsWeb?: string;
    analyticsList?: string;
    stressMultiplierTime?: number;
    stressMultiplierProject?: number;
    
    sites: IPropertyFieldSite[];
    lists: string | string[];

    parentListTitle: string;
    parentListName: string;
    parentListWeb: string;
    fetchListFieldTitles: string;

    dateColumn: string;
    monthGap: string;
    valueColumn: string;
    valueType: string;
    valueOperator: string;
    minDataDownload: boolean;
    dropDownColumns: string;
    searchColumns: string;
    metaColumns: string;
    enableSearch: boolean;

    webPartScenario: string; //Choice used to create mutiple versions of the webpart.
    showEarlyAccess: boolean;

    cellColor: string;
    yearStyles: string;
    monthStyles: string;
    dayStyles: string;
    cellStyles: string;
    cellhoverInfoColor: string;
    otherStyles: string;
    scaleMethod: IScaleMethod;

    squareCustom: string;
    squareColor: string;
    emptyColor: string;
    backGroundColor: string;    

    advancedPivotStyles: boolean;
    pivotSize: string;
    pivotFormat: string;
    pivotOptions: string;
    pivotTab: string;


    fetchCount: number;
    fetchCountMobile: number;
    restFilter: string;

}

export default class GridchartsWebPart extends BaseClientSideWebPart<IGridchartsWebPartProps> {

  

  /***
 *          .d88b.  d8b   db d888888b d8b   db d888888b d888888b 
 *         .8P  Y8. 888o  88   `88'   888o  88   `88'   `~~88~~' 
 *         88    88 88V8o 88    88    88V8o 88    88       88    
 *         88    88 88 V8o88    88    88 V8o88    88       88    
 *         `8b  d8' 88  V888   .88.   88  V888   .88.      88    
 *          `Y88P'  VP   V8P Y888888P VP   V8P Y888888P    YP    
 *                                                               
 *                                                               
 */

    //Added for Get List Data:  https://www.youtube.com/watch?v=b9Ymnicb1kc
    public onInit():Promise<void> {
      return super.onInit().then(_ => {
        // other init code may be present
        //https://stackoverflow.com/questions/52010321/sharepoint-online-full-width-page
        if ( window.location.href &&  
          window.location.href.toLowerCase().indexOf("layouts/15/workbench.aspx") > 0 ) {
            
          if (document.getElementById("workbenchPageContent")) {
            document.getElementById("workbenchPageContent").style.maxWidth = "none";
          }
        } 

        //console.log('window.location',window.location);
        /*
        sp.setup({
          spfxContext: this.context
        });
        */
       
      });
    }

    public getUrlVars(): {} {
      var vars = {};
      vars = location.search
      .slice(1)
      .split('&')
      .map(p => p.split('='))
      .reduce((obj, pair) => {
        const [key, value] = pair.map(decodeURIComponent);
        return ({ ...obj, [key]: value }) ;
      }, {});
      return vars;
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
// ^^^ 2021-01-05 Copied to this point

  public render(): void {
    if ( this.properties.fetchCount == null ) { this.properties.fetchCount = 1000 ;}

    if ( this.properties.parentListWeb && this.properties.parentListWeb.length > 0 ) {} else { this.properties.parentListWeb = this.context.pageContext.web.serverRelativeUrl ; }

    let showEarlyAccess : boolean = false;
    
    if ( window.location.origin.toLowerCase().indexOf('clickster.share') > -1 || window.location.origin.toLowerCase().indexOf('/autoliv/') > -1 ) {
      showEarlyAccess = true;
      this.properties.showEarlyAccess = true;
    } else {
      showEarlyAccess = this.properties.showEarlyAccess;
    }
    if ( this.properties.parentListWeb === '' ) {
      
    }
    let tenant = this.context.pageContext.web.absoluteUrl.replace(this.context.pageContext.web.serverRelativeUrl,"");
    let parentListWeb = this.properties.parentListWeb.indexOf('/sites/') === 0 ? tenant + this.properties.parentListWeb : this.properties.parentListWeb;

    const element: React.ReactElement<IGridchartsProps> = React.createElement(
      Gridcharts,
      {
        description: this.properties.description,

        gridData: null, //ICSSChartSeries,
        color: null, //'green' | 'red' | 'blue' | 'theme',

        // 0 - Context
        pageContext: this.context.pageContext,
        wpContext: this.context,
        tenant: tenant,
        urlVars: this.getUrlVars(),
        today: makeTheTimeObject(''),

        // 2 - Source and destination list information
        parentListWeb: parentListWeb,
        parentListTitle: this.properties.parentListTitle,
        parentListURL: null,
        listName: null,
        
        dateColumn: this.properties.dateColumn,
        monthGap: this.properties.monthGap === null || this.properties.monthGap === undefined || this.properties.monthGap === '' ? '1' : this.properties.monthGap ,
        valueColumn: this.properties.valueColumn,
        valueType: this.properties.valueType,
        valueOperator: this.properties.valueOperator,
        dropDownColumns: this.properties.dropDownColumns ? this.properties.dropDownColumns.split(',') : [],
        searchColumns: this.properties.searchColumns ? this.properties.searchColumns.split(',') : [], 
        metaColumns: this.properties.metaColumns ? this.properties.metaColumns.split(',') : [], 
        enableSearch: this.properties.enableSearch,

        scaleMethod: this.properties.scaleMethod ,

        gridStyles: {
          cellColor: this.properties.cellColor ? this.properties.cellColor : '',
          yearStyles: this.properties.yearStyles ? this.properties.yearStyles : '',
          monthStyles: this.properties.monthStyles ? this.properties.monthStyles : '',
          dayStyles: this.properties.dayStyles ? this.properties.dayStyles : '',
          cellStyles: this.properties.cellStyles ? this.properties.cellStyles : '',
          cellhoverInfoColor: this.properties.cellhoverInfoColor ? this.properties.cellhoverInfoColor : '',
          other: this.properties.otherStyles ? this.properties.otherStyles : '',

          squareColor: this.properties.cellColor === 'swatch' && this.properties.squareColor ? this.properties.squareColor : '',
          squareCustom: this.properties.cellColor === 'custom' && this.properties.squareCustom && this.properties.squareCustom.length > 0 ? this.properties.squareCustom : '',
          emptyColor: this.properties.cellColor === 'swatch' && this.properties.emptyColor ? this.properties.emptyColor : '',
          backGroundColor: this.properties.cellColor === 'swatch' && this.properties.backGroundColor ? this.properties.backGroundColor : '',

        },

        //Size courtesy of https://www.netwoven.com/2018/11/13/resizing-of-spfx-react-web-parts-in-different-scenarios/
        WebpartElement:this.domElement,
    
        // 9 - Other web part options
        WebpartHeight: this.domElement.getBoundingClientRect().height ,
        WebpartWidth:  this.domElement.getBoundingClientRect().width - 50 ,
    
        // 1 - Analytics options  
        useListAnalytics: this.properties.useListAnalytics,
        analyticsWeb: strings.analyticsWeb,
        analyticsList: strings.analyticsList,
        
        // 9 - Other web part options
        webPartScenario: this.properties.webPartScenario, //Choice used to create mutiple versions of the webpart.
        showEarlyAccess: showEarlyAccess,

        pivotSize: this.properties.pivotSize,
        pivotFormat: this.properties.pivotFormat,
        pivotOptions: this.properties.pivotOptions,
        pivotTab: 'Projects', //this.properties.pivotTab (was setTab in pivot-tiles)
      
        allLoaded: null,
    
        performance: {
          fetchCount: this.properties.fetchCount,
          fetchCountMobile: this.properties.fetchCountMobile,
          restFilter: !this.properties.restFilter ? '' : this.properties.restFilter,
          minDataDownload: this.properties.minDataDownload,
        },
    
        parentListFieldTitles: null,
  
        // 6 - User Feedback:
        //progress: IMyProgress,

        /**
         * 2020-09-08:  Add for dynamic data refiners.   onRefiner0Selected  -- callback to update main web part dynamic data props.
         */

        //For DD
        handleSwitch: null,
        handleListPost: null,

      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }


  private async UpdateTitles(): Promise<boolean> {

    let listName = this.properties.parentListTitle ? this.properties.parentListTitle : 'ParentListTitle';
    const list = sp.web.lists.getByTitle(listName);
    const r = await list.fields();

    //2020-05-13:  Remove Active since it's replaced with StatusTMT which is not applicable here
    let defFields = ["Title","Author","Editor","Created","Modified"];
    let filterFields=["SSChoice1","SSChoiceA","MSChoice2","MSChoiceB"];
    let allFields = defFields.concat(filterFields);

    let fieldTitles = r.filter(f => f.Hidden !== true && allFields.indexOf(f.StaticName) > -1).map( 
      f => {return [f.StaticName,f.Title,f.Description,f.Required,f.FieldTypeKind];});
    
    //Update properties here:
    this.properties.fetchListFieldTitles = JSON.stringify(fieldTitles);

    console.log('list fields: ', r);
    console.log('fieldTitles: ', fieldTitles);
    
    return true;

  } 

  /***
  *         d8888b. d8888b.  .d88b.  d8888b.      d8888b.  .d8b.  d8b   db d88888b 
  *         88  `8D 88  `8D .8P  Y8. 88  `8D      88  `8D d8' `8b 888o  88 88'     
  *         88oodD' 88oobY' 88    88 88oodD'      88oodD' 88ooo88 88V8o 88 88ooooo 
  *         88~~~   88`8b   88    88 88~~~        88~~~   88~~~88 88 V8o88 88~~~~~ 
  *         88      88 `88. `8b  d8' 88           88      88   88 88  V888 88.     
  *         88      88   YD  `Y88P'  88           88      YP   YP VP   V8P Y88888P 
  *                                                                                
  *                                                                                
  */



  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return propertyPaneBuilder.getPropertyPaneConfiguration(
      this.properties,
      this.context,
      this.onPropertyPaneFieldChanged.bind(this),
      //this.CreateTTIMTimeList.bind(this),
      //this.CreateTTIMProjectList.bind(this),
      //this.UpdateTitles.bind(this),

      );
  }

  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {

    /**
     * Use this section when there are multiple web part configurations
     */
      /*
          let newMap : any = {};
          if (this.properties.scenario === 'DEV' ) {
            //newMap = availableListMapping.getListColumns(newValue);
          } else if (this.properties.scenario === 'TEAM') {
            //newMap = availableListMapping.getListColumns(newValue);  
          } else if (this.properties.scenario === 'CORP') {
            //newMap = availableListMapping.getListColumns(newValue); 
          }

          const hasValues = Object.keys(newMap).length;

          if (hasValues !== 0) {
            //this.properties.listTitle = newMap.listDisplay;
          } else {
            console.log('Did NOT List Defintion... updating column name props');
          }
          this.context.propertyPane.refresh();

      /**
     * Use this section when there are multiple web part configurations
     */

    /**
     * This section is used to determine when to refresh the pane options
     */

    let updateOnThese = [
      'setSize','setTab','otherTab','setTab','otherTab','setTab','otherTab','setTab','otherTab', '',
      'stressMultiplierTime', 'webPartScenario', '', '', '',
      'parentListTitle', 'parentListName', 'parentListWeb', 'sites', 'lists',
      'dateColumn', 'valueColumn', 'valueType', 'valueOperator', 'minDataDownload','dropDownColumns','searchColumns', 'metaColumns',
      'pivotSize', 'pivotFormat', 'pivotOptions', 'pivotTab', 'advancedPivotStyles', 'scaleMethod',
      'fetchCount', 'fetchCountMobile', 'restFilter', '', '', '',
      'centerPaneFields','centerPaneStyles',
      'monthGap', 'squareColor', 'emptyColor', 'backGroundColor', 'squareCustom', 
    ];

    //alert('props updated');
    if (updateOnThese.indexOf(propertyPath) > -1 ) {
      this.properties[propertyPath] = newValue;   
      this.context.propertyPane.refresh();

    } else { //This can be removed if it works

    }
    this.render();
  }

  // ^^^ 2021-01-05 Copied to this point

}
