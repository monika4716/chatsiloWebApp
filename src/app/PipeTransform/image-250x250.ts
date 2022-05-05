import { Component, Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'image250x250' })
export class Image250x250 implements PipeTransform {
  transform(str: string): any {
    if (str) {
      if (str.length > 0) {
        return str.replace('full_image', '250x250');
      }
    }
  }
}