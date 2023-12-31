import { Sound, Sprite, SpritePainter } from "game-engine";
import { Interactable } from "./interactable";

export class Stairs extends Interactable {
  private activated = false;
  constructor(x: number, y: number, private disabledIndex: number, private index: number, public activationId: number) {
    super(new SpritePainter(Sprite.Sprites['tiles'], {spriteWidth: 16, spriteHeight: 16, spriteOffsetX: 0, spriteOffsetY: 0}), x, y);
    this.imageIndex = disabledIndex;
  }

  activate() {
    this.activated = true;
    this.imageIndex = this.index;
    Sound.Sounds['start'].play();
  }

  deactivate() {
    this.activated = false;
    this.imageIndex = this.disabledIndex;
  }

  isActivated() {
    return this.activated;
  }
}