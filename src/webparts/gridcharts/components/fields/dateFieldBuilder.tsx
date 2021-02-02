

import * as React from 'react';

import { DateTimePicker, DateConvention, TimeConvention, TimeDisplayControlType } from '@pnp/spfx-controls-react/lib/dateTimePicker';

import { IGridchartsState,} from '../GridCharts/IGridchartsState';

import { IUser, ILink, IChartSeries, ICharNote,  } from '../../../../services/IReUsableInterfaces';

import { IGridchartsProps } from '../GridCharts/IGridchartsProps';
import * as strings from 'GridchartsWebPartStrings';

import styles from '../GridCharts/Gridcharts.module.scss';

import { IFieldDef } from './fieldDefinitions';

export const dateConvention = DateConvention.DateTime;
export const showMonthPickerAsOverlay = true;
export const showWeekNumbers = true;
export const timeConvention = TimeConvention.Hours12;
export const showGoToToday = true;
export const timeDisplayControlType = TimeDisplayControlType.Dropdown;

export function creatDateTimeUnControled(parentProps:IGridchartsProps , parentState: IGridchartsState, field: IFieldDef, isSaveDisabled:boolean = false){

    //Got example from:  https://sharepoint.github.io/sp-dev-fx-controls-react/controls/DateTimePicker/
  return (
    // Uncontrolled
    <DateTimePicker label={field.title}
        dateConvention={dateConvention}
        showMonthPickerAsOverlay={showMonthPickerAsOverlay}
        showWeekNumbers={showWeekNumbers}
        timeConvention={timeConvention}
        showGoToToday={showGoToToday}

        timeDisplayControlType={timeDisplayControlType}

    />
  );
}

export function creatDateTimeControled(parentProps:IGridchartsProps , currentValue, field: IFieldDef, isSaveDisabled:boolean = false ,_onChange){
    console.log('field', field);
    console.log('currentValue', currentValue);    
    //Got example from:  https://sharepoint.github.io/sp-dev-fx-controls-react/controls/DateTimePicker/

    let now = new Date();
    let form = new Date();
    let timeStamp = currentValue.length === 0 ? new Date() : new Date(currentValue);

    console.log('now', now);
    console.log('form', form);
    console.log('timeStamp', timeStamp);
    return (
        // Uncontrolled
        <DateTimePicker label={field.title}
            dateConvention={dateConvention}
            showMonthPickerAsOverlay={showMonthPickerAsOverlay}
            showWeekNumbers={showWeekNumbers}
            timeConvention={timeConvention}
            showGoToToday={showGoToToday}

            timeDisplayControlType={timeDisplayControlType}

            value={timeStamp}
            onChange={_onChange}

        />
    );
}

/*
function _onChange(ev: React.FormEvent<HTMLInputElement>, option: IChoiceGroupOption): void {
  console.dir(option);
}
*/