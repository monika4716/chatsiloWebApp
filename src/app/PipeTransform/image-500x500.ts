import { Component, Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'image500x500' })
export class Image500x500 implements PipeTransform {
  transform(str: string): any {
    if (str) {
      if (str.length > 0) {
        return str.replace('full_image', '500x500');
      }
    }
  }
}