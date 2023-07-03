import { Controller } from './Controller';

export class LocalController extends Controller {
  protected readonly keysPressed: Set<string> = new Set();

  constructor() {
    super();
    window.addEventListener('keydown', (event) => {
      if (event.code === 'ArrowLeft' && !this.isLeftPressed) {
        this.leftStart();
      } else if (event.code === 'ArrowRight' && !this.isRightPressed) {
        this.rightStart();
      } else if (event.code === 'ArrowUp' && !this.isUpPressed) {
        this.upStart();
      } else if (event.code === 'KeyA') {
        this.attack1();
      } else if (event.code === 'KeyS') {
        this.attack2();
      } else if (event.code === 'KeyD') {
        this.attack3();
      } else if (event.code === 'KeyF') {
        this.punch();
      }
      this.keysPressed.add(event.code);
    });
    window.addEventListener('keyup', (event) => {
      this.keysPressed.delete(event.code);
      if (event.code === 'ArrowLeft') {
        this.leftStop();
      } else if (event.code === 'ArrowRight') {
        this.rightStop();
      } else if (event.code === 'ArrowUp') {
        this.upStop();
      }
    });
  }

  get isLeftPressed() {
    return this.keysPressed.has('ArrowLeft');
  }

  get isRightPressed() {
    return this.keysPressed.has('ArrowRight');
  }

  get isUpPressed() {
    return this.keysPressed.has('ArrowUp');
  }
}
