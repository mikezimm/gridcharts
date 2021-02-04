

import * as React from 'react';

import {IGridchartsState, } from '../GridCharts/IGridchartsState';

import { IUser, ILink, IChartSeries, ICharNote,  } from '../../../../services/IReUsableInterfaces';

import { IGridchartsProps } from '../GridCharts/IGridchartsProps';
import * as strings from 'GridchartsWebPartStrings';

import { Slider, ISliderProps } from 'office-ui-fabric-react/lib/Slider';

import styles from '../GridCharts/Gridcharts.module.scss';


export function createSlider( timeSliderValue , timeSliderMax, timeSliderInc, _onChange){

  return (
    <div style={{minWidth: 250, }}>
      <Slider 
  //      label={ ((timeSliderValue < 0)  ? "Start time is in the past" : "End time is Back to the future" ) }  //This is the label to left of slider
        label = { 'Slide to adjust date range' }
        min={ 0 } 
        max={ timeSliderMax } 
        step={ timeSliderInc } 
        defaultValue={ 0 } 
        valueFormat={ value => `Offset ${value} px?`}  //This is the label on right of slider showing current value
  //      valueFormat = { null }
        showValue 
        originFromZero
        onChange={_onChange}
     />

    </div>

  );

}

/*
function _onChange(ev: React.FormEvent<HTMLInputElement>, option: IChoiceGroupOption): void {
  console.dir(option);
}
*/