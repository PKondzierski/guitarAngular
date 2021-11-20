import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FretboardService {
  constructor() {}

  getString(event: Event, document: Document, chordList: string[]): void {
    if (event.target != null) {
      const hasNumber = /\d/;
      const targetRect: HTMLElement = <HTMLElement>event.target;
      const fretBoard: HTMLElement | null =
        document.getElementById('fret-board');
      const id: string = targetRect.classList[1];
      const foundCircle = document.getElementById('X' + id);
      const target: HTMLElement | null = document.getElementById(id);
      if (foundCircle != null) {
        foundCircle.remove();
        let index: number = chordList.findIndex((chord) => chord === id);
        chordList.splice(index, 1);
      } else {
        if (
          id != null &&
          hasNumber.test(id) &&
          target != null &&
          target.tagName === 'line'
        ) {
          const x1: string | null = target.getAttribute('x1');
          const x2: string | null = target.getAttribute('x2');
          const y: string | null = target.getAttribute('y1');
          const middle = Number(x1) + (Number(x2) - Number(x1)) / 2;
          // const positionX: number = target.getBoundingClientRect().x;
          // const positionY: number = target.getBoundingClientRect().y;
          const circle: Element = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'circle'
          );
          circle.setAttributeNS(null, 'cx', String(middle));
          circle.setAttributeNS(null, 'cy', String(y));
          circle.setAttributeNS(null, 'r', '2');
          circle.setAttribute('class', 'filled');
          circle.setAttribute('id', 'X' + id);

          // const circles = fretBoard?.getElementsByTagName('circle');
          if (fretBoard != null) {
            fretBoard.appendChild(circle);
            chordList.push(id);
          }
        }
      }
    }
  }

  setStringWithId(id: string, document: Document) {
    const target: HTMLElement | null = document.getElementById(id);
    if (id != null && target != null && target.tagName === 'line') {
      const x1: string | null = target.getAttribute('x1');
      const x2: string | null = target.getAttribute('x2');
      const y: string | null = target.getAttribute('y1');
      const middle = Number(x1) + (Number(x2) - Number(x1)) / 2;
      const fretBoard: HTMLElement | null =
        document.getElementById('fret-board');
      const circle: Element = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'circle'
      );
      circle.setAttributeNS(null, 'cx', String(middle));
      circle.setAttributeNS(null, 'cy', String(y));
      circle.setAttributeNS(null, 'r', '2');
      circle.setAttribute('class', 'filled');
      circle.setAttribute('id', 'X' + id);
      if (fretBoard != null) {
        fretBoard.appendChild(circle);
      }
    }
  }

  resetFretboard(document: Document): void {
    let circles = document.getElementsByTagName('circle');
    for (let index: number = circles.length - 1; index >= 0; index--) {
      circles[index].parentNode!.removeChild(circles[index]);
    }
  }
}
