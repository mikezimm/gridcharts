import * as React from 'react';

//import { IHelpTableRow, IHelpTable, IPageContent, ISinglePageProps } from '../Component/ISinglePageProps';
import { IHelpTableRow, IHelpTable, IPageContent, ISinglePageProps } from '@mikezimm/npmfunctions/dist/HelpInfo/Component/ISinglePageProps';

export function aboutTable() {

    let table : IHelpTable  = {
        heading: 'Version History',
        headers: ['Date','Version','Focus','Notes'],
        rows: [],
    };

    table.rows.push( ['2021-03-28', '1.0.2.3',   <span>Year and Months slide now.  npmFunctions v1.0.26</span> ] );
    table.rows.push( ['2021-03-23', '1.0.2.2',   <span>update to npmFunctions v1.0.16, add InfoPages</span> ] );
    table.rows.push( ['2021-02-14', '1.0.1.3',   <span>Add pre-config for Turnover</span> ] );
    table.rows.push( ['2021-02-14', '1.0.1.2',   <span>Add custom colors</span> ] );
    table.rows.push( ['2021-02-09', '1.0.1.1',   <span>Fix default WebURL. Correctly picks current site.  Allows /sites/ or entire Url</span> ] );
    table.rows.push( ['2021-02-09', '1.0.1.0',   <span>Dropdowns, slider work. Month scale does not slide though</span> ] );
    table.rows.push( ['2021-02-03', '1.0.0.0/1',   <span>Initial release for testing</span> ] );

    /*
    table.rows.push( ['2021-00-00', '1.0.0.0',    <span>Add support to view <b>List attachments, List link, Stat chart updates</b></span>,    ''] );
    */
    
    return { table: table };

}