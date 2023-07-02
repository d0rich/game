export class Controller extends EventTarget {
  private readonly keysPressed: Set<string> = new Set();

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

  private leftStart() {
    this.dispatchEvent(new Event('left:start'));
  }

  private leftStop() {
    this.dispatchEvent(new Event('left:stop'));
  }

  private rightStart() {
    this.dispatchEvent(new Event('right:start'));
  }

  private rightStop() {
    this.dispatchEvent(new Event('right:stop'));
  }

  private upStart() {
    this.dispatchEvent(new Event('up:start'));
  }

  private upStop() {
    this.dispatchEvent(new Event('up:stop'));
  }

  private attack1() {
    this.dispatchEvent(new Event('attack1'));
  }

  private attack2() {
    this.dispatchEvent(new Event('attack2'));
  }

  private attack3() {
    this.dispatchEvent(new Event('attack3'));
  }

  private punch() {
    this.dispatchEvent(new Event('punch'));
  }
}
