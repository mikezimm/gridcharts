import { IPropertyPanePage, PropertyPaneLabel, IPropertyPaneLabelProps, 
    PropertyPaneHorizontalRule, PropertyPaneTextField, IPropertyPaneTextFieldProps, 
    PropertyPaneLink, IPropertyPaneLinkProps, PropertyPaneDropdown, 
    IPropertyPaneDropdownProps, IPropertyPaneDropdownOption, PropertyPaneToggle, 
    IPropertyPaneConfiguration, PropertyPaneButton, PropertyPaneButtonType,
  } from "@microsoft/sp-property-pane";

  import { Pivot, IPivotStyles, PivotLinkSize, PivotLinkFormat } from 'office-ui-fabric-react/lib/Pivot';
  import { Image, ImageFit, ImageCoverStyle,IImageProps,IImageState } from 'office-ui-fabric-react/lib/Image';

  import * as strings from 'GridchartsWebPartStrings';

  export class GridChartsOptionsGroup {
    
    public timeSliderIncChoices: IPropertyPaneDropdownOption[] = <IPropertyPaneDropdownOption[]>[
        {   index: 0,   key: 5, text: "5 minutes"  },
        {   index: 1,   key: 10, text: "10 minutes"  },
        {   index: 2,   key: 15, text: "15 minutes"  },
        {   index: 2,   key: 30, text: "30 minutes"  },
    ];
    
    //Currently may not be neccessary
    public getTimeSliderIncChoices (findMe) {
        return findMe;
    }
    
    //Currently may not be neccessary
    public getTargetItemsChoices (findMe) {

        if (findMe === 'your') {
            return findMe;
        } else if (findMe === 'team') {
            return findMe;
        } else if (findMe === 'others') {
            return findMe;
        }

        return 'notSure';
        
    }

    public valueTypeChoices: IPropertyPaneDropdownOption[] = <IPropertyPaneDropdownOption[]>[
        {   index: 0,   key: "Any", text: "Any"  },
        {   index: 1,   key: "Number", text: "Number"  },
        {   index: 2,   key: "Date", text: "Date"  },
    ];

    public valueOperatorChoices: IPropertyPaneDropdownOption[] = <IPropertyPaneDropdownOption[]>[
        {   index: 0,   key: "count", text: "Count"  },
        {   index: 1,   key: "sum", text: "Sum"  },
        {   index: 2,   key: "min", text: "Min"  },
        {   index: 3,   key: "max", text: "Max"  },
    ];

    public cellColorChoices: IPropertyPaneDropdownOption[] = <IPropertyPaneDropdownOption[]>[
        {   index: 0,   key: "dark", text: "Dark Theme"  },
        {   index: 1,   key: "blue", text: "Blue"  },
        {   index: 2,   key: "green", text: "Green"  },
        {   index: 3,   key: "red", text: "Red"  },
    ];

    public scaleMethodChoices: IPropertyPaneDropdownOption[] = <IPropertyPaneDropdownOption[]>[
        {   index: 0,   key: "slider", text: "Slider"  },
        {   index: 0,   key: "blink", text: "Blink"  },
        {   index: 1,   key: "tbd", text: "TBD"  },
    ];

  }

  export let gridChartsOptionsGroup = new GridChartsOptionsGroup();