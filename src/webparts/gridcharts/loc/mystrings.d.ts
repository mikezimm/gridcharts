declare interface IGridchartsWebPartStrings {
  PropertyPaneAbout: string;
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;

  // 1 - Analytics options
  analyticsWeb: string;
  analyticsList: string;

  // 3 - General how accurate do you want this to be
  PropPaneGroupLabel_Accuracy: string;
  
  // 7 - Slider Options
  PropPaneGroupLabel_SliderOptions: string; 
  FieldLabel_ShowTimeSlider: string; // "Show Time Slider",
  FieldLabel_TimeSliderInc: string; // "Incriment of time slider",
  FieldLabel_TimeSliderMax: string; // "Max of time slider",

  // 9 - Other web part options
  webPartScenario: string; //Choice used to create mutiple versions of the webpart.
  FieldLabel_ToggleTextOff: string;
  FieldLabel_ToggleTextOn: string;
  
  FieldLabel_PivSize: string;
  FieldLabel_PivFormat: string;
  FieldLabel_PivOptions: string;


}

declare module 'GridchartsWebPartStrings' {
  const strings: IGridchartsWebPartStrings;
  export = strings;
}
