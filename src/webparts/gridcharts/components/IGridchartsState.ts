
export interface IGridchartsData {
    date: any;
    label: any;
    dataLevel: number;
}

export interface IGridchartsState {

    selectedYear: number; //Used to determine selected Year Pivot
    selectedUser: any; //Used to determine filter of items ( current user or everyone )

    gridData: IGridchartsData[]; //One IGridchartsData per date between lowest and highest date range for input data

    monthLables: string[];  //Used to build the month labels on top of the gridChart
    monthScales: number[];  //Used to space the month labels on top of the gridChart

    entireDateArray: any[];  //Used as easy date index of entire range of data... to easily find correct item in gridData

    WebpartHeight?:  number;    //Size courtesy of https://www.netwoven.com/2018/11/13/resizing-of-spfx-react-web-parts-in-different-scenarios/
    WebpartWidth?:   number;    //Size courtesy of https://www.netwoven.com/2018/11/13/resizing-of-spfx-react-web-parts-in-different-scenarios/

  }