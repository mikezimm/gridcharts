
export interface IGridchartsData {
    date: any;
    label: any;
    dataLevel: number;
}

export interface IGridchartsState {

    gridData: IGridchartsData[];
    monthLables: string[];
    monthScales: number[];
    WebpartHeight?:  number;    //Size courtesy of https://www.netwoven.com/2018/11/13/resizing-of-spfx-react-web-parts-in-different-scenarios/
    WebpartWidth?:   number;    //Size courtesy of https://www.netwoven.com/2018/11/13/resizing-of-spfx-react-web-parts-in-different-scenarios/

  }