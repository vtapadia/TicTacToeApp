
export function sleep(millis: number):Promise<any> {
  return new Promise(resolve => setTimeout(resolve, millis));
}

export function random(length:number):number {
  return Math.floor(Math.random()*Math.pow(10, length));
}