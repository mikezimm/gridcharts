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

//    const squares = document.querySelector(styles.squares);
    const squares : any[] = [];

    for (var i = 1; i < 365; i++) {
      const level = Math.floor(Math.random() * 3);  
      squares.push( <li title="hello" data-level={ level }></li> ) ;
    }

    return (
      <div className={ styles.gridcharts }>
        <div className={ styles.container }>

          <div className={styles.graph} style={{ width: '1000px' }}>
            <ul className={styles.months} style={{ listStyleType: 'none' }}>
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
            <ul className={styles.squares} style={{ listStyleType: 'none' }}>
              { squares }
            </ul>
          </div>

        </div>
      </div>
    );
  }
}
