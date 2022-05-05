import { Component, Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'image100x100' })
export class Image100x100 implements PipeTransform {
  transform(str: string): any {
    if (str) {
      if (str.length > 0) {
        return str.replace('full_image', '100x100');
      }
    }
  }
}