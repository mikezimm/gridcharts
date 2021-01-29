
import { PageContext } from '@microsoft/sp-page-context';
import { WebPartContext } from '@microsoft/sp-webpart-base';

import { getAge, getDayTimeToMinutes, getBestTimeDelta, getLocalMonths, getTimeSpan, getGreeting,
  getNicks, makeTheTimeObject, getTimeDelta, monthStr3, monthStr, weekday3, ITheTime} from '@mikezimm/npmfunctions/dist/dateServices';

import { ICSSChartSeries,  } from '@mikezimm/npmfunctions/dist/IReUsableInterfaces';

export interface IGridchartsProps {

      // 0 - Context
      description: string;

      WebpartElement?: HTMLElement;   //Size courtesy of https://www.netwoven.com/2018/11/13/resizing-of-spfx-react-web-parts-in-different-scenarios/
      gridData?: ICSSChartSeries;
      color?: 'green' | 'red' | 'blue' | 'theme';

      pageContext: PageContext;
      wpContext: WebPartContext;
  
      allowOtherSites?: boolean; //default is local only.  Set to false to allow provisioning parts on other sites.
  
      allowRailsOff?: boolean;
      allowSettings?: boolean;
  
      tenant: string;
      urlVars: {};
      today: ITheTime;
  
      webURL?: string;
      parentListURL?: string;
  
      listName : string;
      
      allLoaded: boolean;
  
      toggles: {
          togRefinerCounts: boolean;
          togCountChart: boolean;
          togStats: boolean;
          togOtherListview:  boolean;
          togOtherChartpart:  boolean;
      };
  
      performance: {
          fetchCount: number;
          fetchCountMobile: number;
          restFilter: string;
      };
  
      parentListFieldTitles: string;
  
      // 1 - Analytics options
      useListAnalytics: boolean;
      analyticsWeb?: string;
      analyticsList?: string;
  
      // 2 - Source and destination list information
  
      refiners: string[]; //String of Keys representing the static name of the column used for drill downs
      showDisabled?: boolean;  //This will show disabled refiners for DaysOfWeek/Months when the day or month has no data
      updateRefinersOnTextSearch?: boolean;
  
      showRefinerCounts?: boolean;
      showCountChart?: boolean;
  
      /**    
       * 'parseBySemiColons' |
       * 'groupBy10s' |  'groupBy100s' |  'groupBy1000s' |  'groupByMillions' |
       * 'groupByDays' |  'groupByMonths' |  'groupByYears' |
       * 'groupByUsers' | 
       * 
       * rules string formatted as JSON : [ string[] ]  =  [['parseBySemiColons''groupByMonths'],['groupByMonths'],['groupByUsers']]
       * [ ['parseBySemiColons''groupByMonths'],
       * ['groupByMonths'],
       * ['groupByUsers'] ]
       * 
      */
  
      // 6 - User Feedback:
      //progress: IMyProgress;
  
      rules: string;
      stats: string;
  
      WebpartHeight?:  number;    //Size courtesy of https://www.netwoven.com/2018/11/13/resizing-of-spfx-react-web-parts-in-different-scenarios/
      WebpartWidth?:   number;    //Size courtesy of https://www.netwoven.com/2018/11/13/resizing-of-spfx-react-web-parts-in-different-scenarios/
  
      pivotSize: string;
      pivotFormat: string;
      pivotOptions: string;
      pivotTab: string;  //May not be needed because we have projectMasterPriority
  
      /**
       * 2020-09-08:  Add for dynamic data refiners.   onRefiner0Selected  -- callback to update main web part dynamic data props.
       */
      onRefiner0Selected?: any;
  
      style: any; //RefinerStyle
  
      //For DD
      handleSwitch: any;
      handleListPost: any;


}
