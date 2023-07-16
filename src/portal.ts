import { Sprite, SpritePainter } from "game-engine";
import { Interactable } from "./interactable";

export class Portal extends Interactable {
  private activated = false;
  constructor(x: number, y: number, private destX: number, private destY: number) {
    super(new SpritePainter(Sprite.Sprites['tiles'], {spriteWidth: 8, spriteHeight: 8, spriteOffsetX: -4, spriteOffsetY: -4}), x, y);
    this.imageIndex = 2351;
  }
  
  getDestPos() {
    return {x: this.destX, y: this.destY};
  }

  activate() {
    this.activated = true;
    this.imageIndex = 2416;
  }

  deactivate() {
    this.activated = false;
    this.imageIndex = 0;
  }

  isActivated() {
    return this.activated;
  }
}