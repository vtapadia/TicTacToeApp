import React from 'react';

export class GameState {
  values: string[][];
  myTurn: boolean;
  winner: string;
  myPiece: string;
  mode: string;
  constructor(mode = "network", myPiece = "X") {
    // this.values = Array(3).fill(Array(3).fill(undefined));
    this.values = [...Array(3)].map(x=>Array(3).fill(undefined));
    this.myTurn = true;
    this.myPiece = myPiece;
    this.mode = mode;
    this.winner = "";
  }

  playComputer() {
    //Find a random number between 0 and 8
    let random = Math.floor(Math.random() * 9);
    let row:number = Math.floor(random/3);
    let col:number = random%3;
    if (!this.values[row][col]) {
      this.values[row][col] = (this.myPiece==="X") ? "O" : "X";
      console.log("Setting %s for %d, %d", this.values[row][col], row, col);
    } else {
      //try again to find another box
      console.log("Randomizer skipped %d, %d with value %s filled", row, col, this.values[row][col]);
      // alert("Box already filled");
      this.playComputer();
    }
  }

  hasFinished():boolean {
    for (let i=0; i < 3; i++) {
      if (this.values[i][0] == this.values[i][1] && 
        this.values[i][1] == this.values[i][2] &&
        this.values[i][0] != "") {
          this.winner = this.values[i][0];
          break;
        }
        if (this.values[0][i] == this.values[1][i] && 
          this.values[1][i] == this.values[2][i] &&
          this.values[0][i] != "") {
            this.winner = this.values[0][i];
            break;
        }
    }
    if (this.values[0][0] == this.values[1][1] && 
      this.values[1][1] == this.values[2][2] &&
      this.values[0][0] != "") {
        this.winner = this.values[0][0];
    }
    if (this.values[2][0] == this.values[1][1] && 
      this.values[1][1] == this.values[0][2] &&
      this.values[2][0] != "") {
        this.winner = this.values[2][0];
    }
    return this.winner!="";
  }

  toggleTurn() {
    this.myTurn = !this.myTurn;
  }

  setValue(row:number, col: number, value:string = this.myPiece) {
    console.log("Setting myValue for %d, %d", row, col);
    this.values[row][col] = value;
    this.toggleTurn();
    if (this.mode == "offline") {
      console.log("Playing computer turn");
      this.playComputer();
      this.toggleTurn();
    }
  }

  getValue(row:number, col: number):string {
    return this.values[row][col];
  }
}