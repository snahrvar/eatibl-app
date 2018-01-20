import { Injectable } from '@angular/core';

@Injectable()
export class SampleService {

  constructor() { }

  numbers = [1,2,3,4,5];

  sayHello(){
    console.log('hello');
  }

  addNumber(value){
    this.numbers.push(value);
  }
}
