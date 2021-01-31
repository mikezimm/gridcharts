import { IPropertyPanePage, PropertyPaneLabel, IPropertyPaneLabelProps, 
    PropertyPaneHorizontalRule, PropertyPaneTextField, IPropertyPaneTextFieldProps, 
    PropertyPaneLink, IPropertyPaneLinkProps, PropertyPaneDropdown, 
    IPropertyPaneDropdownProps, IPropertyPaneDropdownOption, PropertyPaneToggle, 
    IPropertyPaneConfiguration, PropertyPaneButton, PropertyPaneButtonType,
  } from "@microsoft/sp-property-pane";

  import { Pivot, IPivotStyles, PivotLinkSize, PivotLinkFormat } from 'office-ui-fabric-react/lib/Pivot';
  import { Image, ImageFit, ImageCoverStyle,IImageProps,IImageState } from 'office-ui-fabric-react/lib/Image';

  import * as strings from 'GridchartsWebPartStrings';

  export class TrackTimeOptionsGroup {
    
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

  }

  export let trackTimeOptionsGroup = new TrackTimeOptionsGroup();