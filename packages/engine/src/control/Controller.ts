export abstract class Controller extends EventTarget {
  protected leftStart() {
    this.dispatchEvent(new Event('left:start'));
  }

  protected leftStop() {
    this.dispatchEvent(new Event('left:stop'));
  }

  protected rightStart() {
    this.dispatchEvent(new Event('right:start'));
  }

  protected rightStop() {
    this.dispatchEvent(new Event('right:stop'));
  }

  protected upStart() {
    this.dispatchEvent(new Event('up:start'));
  }

  protected upStop() {
    this.dispatchEvent(new Event('up:stop'));
  }

  protected attack1() {
    this.dispatchEvent(new Event('attack1'));
  }

  protected attack2() {
    this.dispatchEvent(new Event('attack2'));
  }

  protected attack3() {
    this.dispatchEvent(new Event('attack3'));
  }

  protected punch() {
    this.dispatchEvent(new Event('punch'));
  }
}
