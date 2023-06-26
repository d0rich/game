export class Controller extends EventTarget {
  private readonly keysPressed: Set<string> = new Set();

  constructor() {
    super();
    window.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft' && !this.isLeftPressed) {
        this.leftStart();
      } else if (event.key === 'ArrowRight' && !this.isRightPressed) {
        this.rightStart();
      }
      this.keysPressed.add(event.key);
    });
    window.addEventListener('keyup', (event) => {
      this.keysPressed.delete(event.key);
      if (event.key === 'ArrowLeft') {
        this.leftStop();
      } else if (event.key === 'ArrowRight') {
        this.rightStop();
      }
    });
  }

  get isLeftPressed() {
    return this.keysPressed.has('ArrowLeft');
  }

  get isRightPressed() {
    return this.keysPressed.has('ArrowRight');
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
}