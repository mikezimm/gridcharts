import {  } from "@microsoft/sp-webpart-base";
import { IPropertyPaneConfiguration } from "@microsoft/sp-property-pane";

import {
  introPage,
  webPartSettingsPage,

} from './index';

/*
        IntroPage.getPropertyPanePage(),
        WebPartSettingsPage.getPropertyPanePage(),
        ListMappingPage.getPropertyPanePage(),
*/

export class PropertyPaneBuilder {
  public getPropertyPaneConfiguration( webPartProps ): IPropertyPaneConfiguration { //webPartProps, _onClickCreateTime, _onClickCreateProject, _onClickUpdateTitles
    return <IPropertyPaneConfiguration>{
      pages: [
        introPage.getPropertyPanePage( webPartProps ), //webPartProps, _onClickCreateTime, _onClickCreateProject, _onClickUpdateTitles
        webPartSettingsPage.getPropertyPanePage(webPartProps),

      ]
    };
  } // getPropertyPaneConfiguration()

}

export let propertyPaneBuilder = new PropertyPaneBuilder();