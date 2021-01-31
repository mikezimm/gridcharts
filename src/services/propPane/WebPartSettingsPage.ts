import {
    IPropertyPanePage,
    PropertyPaneLabel,
    IPropertyPaneLabelProps,
    PropertyPaneHorizontalRule,
    PropertyPaneTextField, IPropertyPaneTextFieldProps,
    PropertyPaneLink, IPropertyPaneLinkProps,
    PropertyPaneDropdown, IPropertyPaneDropdownProps,
    IPropertyPaneDropdownOption,
    PropertyPaneSlider,
    PropertyPaneToggle
  } from '@microsoft/sp-property-pane';
//  import { PropertyFieldMultiSelect } from '@pnp/spfx-property-controls/lib/PropertyFieldMultiSelect';
  
  import * as strings from 'GridchartsWebPartStrings';
  import { pivotOptionsGroup, trackTimeOptionsGroup } from './index';
  
  export class WebPartSettingsPage {

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
  FieldLabel_LocationChoices: string;  // Office, Customer, Traveling, Home
  FieldLabel_DefaultLocation: string; // 

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


    public getPropertyPanePage(webPartProps): IPropertyPanePage {
      return <IPropertyPanePage>        { // <page2>
        header: {

          description: strings.PropertyPaneDescription,
        },
        displayGroupsAsAccordion: true,
        groups: [

          /** 3 - General how accurate do you want this to be
            roundTime: string; //Up 5 minutes, Down 5 minutes, No Rounding;
            forceCurrentUser: boolean; //false allows you to put in data for someone else
            confirmPrompt: boolean;  //Make user press confirm
          */
          { groupName: strings.PropPaneGroupLabel_Accuracy,
            isCollapsed: true ,
          groupFields: [
            
            PropertyPaneSlider('stressMultiplierTime', {
              label: 'TESTING ONLY - Compound Time Entry count',
              min: 1,
              max: 10,
              value: 1,
              step: 1,
            }),

            PropertyPaneSlider('stressMultiplierProject', {
              label: 'TESTING ONLY - Compound Project Entry count',
              min: 1,
              max: 30,
              value: 1,
              step: 1,
            }),

          ]}, // this group
       
          /** 4 -Project options
            allowUserProjects: boolean; //Will build list of ProjectsUser based on existing data from TrackMyTime list
            projectMasterPriority: string; //Use to determine what projects float to top.... your most recent?  last day?
            projectUserPriority: string; //Use to determine what projects float to top.... your most recent?  last day?
          */

         { groupName: strings.PropPaneGroupLabel_SliderOptions,
          isCollapsed: true ,
         groupFields: [

          PropertyPaneToggle('showTimeSlider', {
            label: strings.FieldLabel_ShowTimeSlider,
            offText: 'Locked',
            onText: 'Unlock',
          }),

          PropertyPaneDropdown('timeSliderInc', <IPropertyPaneDropdownProps>{
            disabled: webPartProps.showTimeSlider === true ? false : true,
            label: strings.FieldLabel_TimeSliderInc,
            options: trackTimeOptionsGroup.timeSliderIncChoices,
          }),    
/*
          PropertyPaneSlider('timeSliderInc', {
            disabled: webPartProps.showTimeSlider === true ? false : true,
            label: strings.FieldLabel_TimeSliderInc,
            min: 5,
            max: 60,
            step: 5,
          }),
*/
          PropertyPaneSlider('timeSliderMax', {
            disabled: webPartProps.showTimeSlider === true ? false : true,
            label: strings.FieldLabel_TimeSliderMax,
            min: 1,
            max: 10,
            value: 5,
            step: 1,
          }),
            
         ]}, // this group

      ]}; // Groups 
    } // getPropertyPanePage()

  } // WebPartSettingsPage
  
  export let webPartSettingsPage = new WebPartSettingsPage();