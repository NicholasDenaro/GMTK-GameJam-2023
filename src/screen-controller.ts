import { Controller, ControllerBinding, ControllerState } from "game-engine";

export type ScreenBinding = ControllerBinding<undefined>;

export type ScreenButtonBinding = { binding: ScreenBinding, keys: string[] };

export class ScreenController implements Controller {

  private controls: { [binding: string]: ScreenButtonBinding } = {};
  private inputs: { [key: string]: ScreenButtonBinding } = {};

  private pointers: {[key: number]: {x: number, y: number}} = {};

  private controlElements?: NodeListOf<HTMLDivElement>;
  constructor(keyMap: ScreenButtonBinding[]) {
    for (let i = 0; i < keyMap.length; i++) {
      this.controls[keyMap[i].binding.name()] = keyMap[i];
      keyMap[i].keys.forEach(key => {
        this.inputs[key] = keyMap[i];
      })
    }
    addEventListener('touchstart', (event: TouchEvent) => this.onPointerDown(event));
    addEventListener('touchmove', (event: TouchEvent) => this.onPointerMove(event));
    addEventListener('touchend', (event: TouchEvent) => this.onPointerUp(event));
  }

  isControl(binding: string, state: ControllerState): boolean {
    switch (state) {
      case ControllerState.Down:
        return this.binding(binding)?.isDown();
      case ControllerState.Up:
        return this.binding(binding)?.isUp();
    }

    return this.binding(binding)?.is(state);
  }

  getDetails(binding: string): {} | null {
    return this.binding(binding)?.getDetails();
  }

  binding(binding: string): ScreenBinding | null {
    return this.controls[binding]?.binding;
  }

  input(key: string): ScreenBinding | null {
    return this.inputs[key]?.binding;
  }

  tick(): void | Promise<void> {
    if (!this.controlElements) {
      return;
    }

    const pressedIds: string[] = [];

    for (let pointer of Object.values(this.pointers)) {
      for (let div of this.controlElements) {
        const rect = div.getClientRects()[0];
        if (pointer.x < rect.left || pointer.x > rect.right || pointer.y < rect.top || pointer.y > rect.bottom) {
          // release
        } else {
          if (div.hasAttribute('actions')) {
            const ids = JSON.parse(div.getAttribute('actions').replaceAll('\'', '"')) as string[];
            pressedIds.push(...ids);
          }
        }
      }
    }

    for (let inputKey of Object.keys(this.inputs)) {
      if (pressedIds.indexOf(inputKey) >= 0) {
        this.input(inputKey)?.update(ControllerState.Press);
      } else {

        this.input(inputKey)?.update(ControllerState.Release);
      }
    }

    const keys = Object.keys(this.controls);
    for (let i = 0; i < keys.length; i++) {
      this.controls[keys[i]]?.binding.tick();
    }
  }

  private onPointerDown(event: TouchEvent) {

    document.getElementById('controls').style.display = 'block';
    if (!this.controlElements) {
      this.controlElements = document.getElementById('controls').querySelectorAll('div');
    }
    this.pointers[event.changedTouches[0].identifier] = { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY };
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  }

  private onPointerMove(event: TouchEvent) {
    this.pointers[event.changedTouches[0].identifier] = { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY };
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  }

  private onPointerUp(event: TouchEvent) {
    delete this.pointers[event.changedTouches[0].identifier];
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  }
}