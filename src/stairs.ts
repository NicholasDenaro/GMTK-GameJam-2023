import { Sprite, SpritePainter } from "game-engine";
import { Interactable } from "./interactable";

export class Stairs extends Interactable {
  private activated = false;
  constructor(x: number, y: number, private disabledIndex: number, private index: number) {
    super(new SpritePainter(Sprite.Sprites['tiles'], {spriteWidth: 16, spriteHeight: 16, spriteOffsetX: 0, spriteOffsetY: 0}), x, y);
    this.imageIndex = disabledIndex;
  }

  activate() {
    this.activated = true;
    this.imageIndex = this.index;
  }

  deactivate() {
    this.activated = true;
    this.imageIndex = this.disabledIndex;
  }

  isActivated() {
    return this.activated;
  }
}