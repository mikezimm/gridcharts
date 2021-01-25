import * as React from 'react';
import styles from './Gridcharts.module.scss';
import { IGridchartsProps } from './IGridchartsProps';
import { escape } from '@microsoft/sp-lodash-subset';

/**
 * Based upon example from
 * https://codepen.io/ire/pen/Legmwo
 */


export default class Gridcharts extends React.Component<IGridchartsProps, {}> {
  public render(): React.ReactElement<IGridchartsProps> {
    return (
      <div className={ styles.gridcharts }>
        <div className={ styles.container }>

          <div className={styles.graph}>
            <ul className={styles.months}>
              <li>Jan</li>
              <li>Feb</li>
              <li>Mar</li>
              <li>Apr</li>
              <li>May</li>
              <li>Jun</li>
              <li>Jul</li>
              <li>Aug</li>
              <li>Sep</li>
              <li>Oct</li>
              <li>Nov</li>
              <li>Dec</li>
            </ul>
            <ul className={styles.days}>
              <li>Sun</li>
              <li>Mon</li>
              <li>Tue</li>
              <li>Wed</li>
              <li>Thu</li>
              <li>Fri</li>
              <li>Sat</li>
            </ul>
            <ul className={styles.squares}>
              
            </ul>
          </div>

        </div>
      </div>
    );
  }
}
