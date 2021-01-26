
import { PageContext } from '@microsoft/sp-page-context';
import { WebPartContext } from '@microsoft/sp-webpart-base';

import { ICSSChartSeries } from '@mikezimm/npmfunctions/dist/IReUsableInterfaces';

export interface IGridchartsProps {
  description: string;
  WebpartElement?: HTMLElement;   //Size courtesy of https://www.netwoven.com/2018/11/13/resizing-of-spfx-react-web-parts-in-different-scenarios/
  gridData?: ICSSChartSeries;
  color?: 'green' | 'red' | 'blue' | 'theme';

}
