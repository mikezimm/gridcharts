

import * as React from 'react';

import {IGridchartsState, } from '../GridCharts/IGridchartsState';

import { IUser, ILink, IChartSeries, ICharNote,  } from '../../../../services/IReUsableInterfaces';

import { IGridchartsProps } from '../GridCharts/IGridchartsProps';
import * as strings from 'GridchartsWebPartStrings';

import { Slider, ISliderProps } from 'office-ui-fabric-react/lib/Slider';

import styles from '../GridCharts/Gridcharts.module.scss';


export function createSlider(timeSliderValue , timeSliderMax, timeSliderInc, _onChange){

  return (
    <div style={{minWidth: 400, }}>
      <Slider 
      label={ ((timeSliderValue < 0)  ? "Start time is in the past" : "End time is Back to the future" ) }
      min={ -1 * timeSliderMax } 
      max={ timeSliderMax } 
      step={ timeSliderInc } 
      defaultValue={ 0 } 
      valueFormat={value => `${value} mins`}
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