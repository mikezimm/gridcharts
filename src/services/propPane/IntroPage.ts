import { BaseClientSideWebPart,  } from "@microsoft/sp-webpart-base";
import { IPropertyPanePage, PropertyPaneLabel, IPropertyPaneLabelProps, 
  PropertyPaneHorizontalRule, PropertyPaneTextField, IPropertyPaneTextFieldProps, 
  PropertyPaneLink, IPropertyPaneLinkProps, PropertyPaneDropdown, 
  IPropertyPaneDropdownProps, IPropertyPaneDropdownOption, PropertyPaneToggle, 
  IPropertyPaneConfiguration, PropertyPaneButton, PropertyPaneButtonType, PropertyPaneSlider
} from "@microsoft/sp-property-pane";

import * as strings from 'GridchartsWebPartStrings';
import { pivotOptionsGroup} from './index';
import { gridChartsOptionsGroup } from './index';

import * as links from '../../webparts/gridcharts/components/HelpInfo/AllLinks';   //              { links.gitRepoTrackMyTime.issues }

import { IGridchartsWebPartProps } from '../../webparts/gridcharts/GridchartsWebPart';

/*

  // 1 - Analytics options
  useListAnalytics: boolean;
  analyticsWeb?: string;
  analyticsList?: string;

  // 2 - Source and destination list information
  projectListTitle: string;
  projectListWeb: string;

  timeTrackListTitle: string;
  timeTrackListWeb: string;

  // 3 - General how accurate do you want this to be
  roundTime: string; //Up 5 minutes, Down 5 minutes, No Rounding;
  forceCurrentUser: boolean; //false allows you to put in data for someone else
  confirmPrompt: boolean;  //Make user press confirm

  // 4 -Project options
  allowUserProjects: boolean; //Will build list of ProjectsUser based on existing data from TrackMyTime list
  projectMasterPriority: string; //Use to determine what projects float to top.... your most recent?  last day?
  projectUserPriority: string; //Use to determine what projects float to top.... your most recent?  last day?

  // 5 - UI Defaults
  defaultProjectPicker: string; //Recent, Your Projects, All Projects etc...
  defaultTimePicker: string; //SinceLast, Slider, Manual???

  // 6 - User Feedback:
  showElapsedTimeSinceLast: boolean;  // Idea is that it can be like a clock showing how long it's been since your last entry.

  // Target will be used to provide user feedback on how much/well they are tracking time
  showTargetBar: boolean; //Eventually have some kind of way to tell user that x% of hours have been entered for day/week
  showTargetToggle: boolean; //Maybe give user option to toggle between day/week
  targetType:  string; //Day, Week, Both?
  targetValue: number; //Hours for typical day/week

  // 7 - Slider Options
  showTimeSlider: boolean; //true allows you to define end time and slider for how long you spent
  timeSliderInc: number; //incriment of time slider
  timeSliderMax: number; //max of time slider

  // 9 - Other web part options
  webPartScenario: string; //Choice used to create mutiple versions of the webpart.

  pivotSize: string;
  pivotFormat: string;
  pivotOptions: string;

    */

export class IntroPage {
  public getPropertyPanePage(webPartProps: IGridchartsWebPartProps,  ): IPropertyPanePage { //_onClickCreateTime, _onClickCreateProject, _onClickUpdateTitles
    return <IPropertyPanePage>
    { // <page1>
      header: {
        description: strings.PropertyPaneAbout
      },
      displayGroupsAsAccordion: true,
      groups: [
        { groupName: 'Web Part Info',
          isCollapsed: true ,
          groupFields: [
            PropertyPaneLabel('About Text', {
              text: 'This webpart displays summary of list/library items in date grid format.'
            }),

            PropertyPaneLink('About Link' , {
              text: 'Github Repo:  ' + links.gitRepoGridCharts.desc ,
              href: links.gitRepoGridCharts.href,
              target: links.gitRepoGridCharts.target,
            }),

            PropertyPaneLink('Issues Link' , {
              text: 'Report Issues:  ' + links.gitRepoGridCharts.desc ,
              href: links.gitRepoGridCharts.href  + '/issues',
              target: links.gitRepoGridCharts.target,
            }),

          ]
        },

        // 2 - Source and destination list information    
        { groupName: 'Your list info',
        isCollapsed: true ,
        groupFields: [
          PropertyPaneTextField('parentListWeb', {
              label: 'Your List Web url'
          }),
          PropertyPaneTextField('parentListTitle', {
            label: 'Your List Title'
          }),

          PropertyPaneTextField('dateColumn', {
            label: 'Date Column'
          }),

          PropertyPaneTextField('valueColumn', {
            label: 'Value Column'
          }),

          PropertyPaneDropdown('valueType', <IPropertyPaneDropdownProps>{
            label: 'Value type',
            options: gridChartsOptionsGroup.valueTypeChoices,
          }),

          PropertyPaneDropdown('valueOperator', <IPropertyPaneDropdownProps>{
            label: 'Value operator',
            options: gridChartsOptionsGroup.valueOperatorChoices,
          }),

        ]}, // this group
/* */

        // 2 - Source and destination list information    
        { groupName: 'Search settings',
        isCollapsed: true ,
        groupFields: [
 
          PropertyPaneTextField('dropDownColumns', {
            label: 'Dropdown Columns',
            description: 'comma separated column names'
          }),

          PropertyPaneTextField('searchColumns', {
            label: 'Search Columns',
            description: 'comma separated column names'
          }),         
          
          PropertyPaneTextField('metaColumns', {
            label: 'Meta Columns',
            description: 'comma separated column names'
          }),

          PropertyPaneToggle('enableSearch', {
            label: 'Allow for text searching',
            offText: 'Off',
            onText: 'On',
          }),


        ]}, // this group
/* */

        { groupName: 'Performance Properties',
        isCollapsed: true ,
        groupFields: [

          //minDataDownload

          PropertyPaneToggle('minDataDownload', {
            label: 'Download only required item data',
            offText: 'Everything',
            onText: 'Minimual',
          }),

          PropertyPaneSlider('fetchCount', {
            label: 'Load this many items from PC',
            min: 100,
            max: 2000,
            step: 100,
            value: webPartProps.fetchCount,
          }),

          PropertyPaneSlider('fetchCountMobile', {
            label: 'Load this many items',
            min: 100,
            max: 2000,
            step: 100,
            value: webPartProps.fetchCountMobile,
            disabled: true,
          }),

          PropertyPaneTextField('restFilter', {
            label: 'Rest filter to load only specific items.',
            description: 'See Github Wiki for examples',
            multiline: true,
            value: webPartProps.restFilter,
          }),

        ]}, // this group

        // 2 - Source and destination list information    
        { groupName: 'Styling and colors',
        isCollapsed: true ,
        groupFields: [

          PropertyPaneDropdown('cellColor', <IPropertyPaneDropdownProps>{
            label: 'Cell color',
            options: gridChartsOptionsGroup.cellColorChoices,
          }),

          PropertyPaneTextField('yearStyles', {
            label: 'css for Year headings'
          }),

          PropertyPaneTextField('monthStyles', {
            label: 'css for Month headings'
          }),

          PropertyPaneTextField('dayStyles', {
            label: 'css for Day headings'
          }),
          
          PropertyPaneTextField('cellStyles', {
            label: 'css for Cell headings'
          }),
                      
          PropertyPaneTextField('otherStyles', {
            label: 'Other styles',
            disabled: true,
          }),

          PropertyPaneTextField('hoverInfo', {
            label: 'Hover settings',
            disabled: true,
          }),

        ]}, // this group
          /* */

        // 9 - Other web part options
        { groupName: 'Pivot Styles (headings) - future use',
          isCollapsed: true ,
          groupFields: [
            PropertyPaneDropdown('pivotSize', <IPropertyPaneDropdownProps>{
              label: strings.FieldLabel_PivSize,
              options: pivotOptionsGroup.pivSizeChoices,
              disabled: true,
            }),
            PropertyPaneDropdown('pivotFormat', <IPropertyPaneDropdownProps>{
              label: strings.FieldLabel_PivFormat,
              options: pivotOptionsGroup.pivFormatChoices,
              disabled: true,
            }),
            PropertyPaneDropdown('pivotOptions', <IPropertyPaneDropdownProps>{
              label: strings.FieldLabel_PivOptions,
              options: pivotOptionsGroup.pivOptionsChoices,
              disabled: true,
            }),
          ]}, // this group


        ]}; // Groups
  } // getPropertyPanePage()
}

export let introPage = new IntroPage();