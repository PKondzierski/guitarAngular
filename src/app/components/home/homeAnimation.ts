import {
  trigger, state, style, transition,
  animate, group, query, stagger, keyframes
} from '@angular/animations';

export const RegisterAnimation = [
  trigger('registerAnimation', [
    state('out', style({
      left: '120%'
    })),
    state('in', style({})),
    transition('out => in', [
      animate('600ms ease-in')
    ]),
  ]),
  trigger('penAnimation', [
    state('out', style({
      opacity: '0'
    })),
    state('in', style({
      opacity: '1'
    })),
    transition('out => in', [
      animate('600ms ease-in')
    ]),
  ]),

]
