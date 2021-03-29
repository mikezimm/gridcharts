import * as React from 'react';

import styles from '../Component/InfoPane.module.scss';

//import { IHelpTableRow, IHelpTable, IPageContent, ISinglePageProps } from '../Component/ISinglePageProps';
import { IHelpTableRow, IHelpTable, IPageContent, ISinglePageProps } from '@mikezimm/npmfunctions/dist/HelpInfo/Component/ISinglePageProps';

export function gettingStartedContent() {

    let html1 = <div>

        <h2>Setup webpart to show some data</h2>
        <ol>
            <li>Go to <b>WebPart Properties</b> - Edit Page, Edit Webpart.</li>
            <li>Define your list in <b>Get pre-configured setup</b> or <b>Your list info</b> sections</li>
            <li><b>Your list info</b> properties define the list and required properties</li>
            <li><b>Search </b> properties define Dropdown boxes and searchable fields</li>
            <li><b>Performance</b> properties impact how fast the webpart loads and how much data to pull</li>
            <li><b>Squares styling</b> properties let you customize the look of the grid squares</li>
            <li><b>Other Styling</b> properties let you customize other style properties</li>
        </ol>
        <h2>Quick setup tip</h2>
        <ol>
            <li><b>Get pre-configured setup</b> properties let you pick settings for common lists and libraries :)</li>
        </ol>
    </div>;

    return { html1: html1 };

}
  

