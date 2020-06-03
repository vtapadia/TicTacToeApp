import React from 'react';

export class GameState {
  values: string[][];
  constructor() {
    this.values = Array(3).fill(Array(3).fill(null));
  }

  setValue(row:number, col: number, value:string) {
    this.values[row][col] = value;
  }

  getValue(row:number, col: number):string {
    return this.values[row][col];
  }
}