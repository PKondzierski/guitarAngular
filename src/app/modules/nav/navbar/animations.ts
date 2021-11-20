import {
  trigger, state, style, transition,
  animate, group, query, stagger, keyframes
} from '@angular/animations';

export const SlideInOutAnimation = [
  trigger('openClose', [
    // ...
    state('open', style({
      transform: 'translateY(0)',
      opacity: 1,
    })),
    state('closed', style({
      transform: 'translateY(-100%)',
      height: '0',
      opacity: 0.0,
    })),
    transition('open => closed', [
      animate('0.05s ease-out')
    ]),
    transition('closed => open', [
      animate('0.3s ease-in')
    ]),
  ])
]
