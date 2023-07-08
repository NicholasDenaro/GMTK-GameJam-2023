import { Sprite, SpritePainter } from "game-engine";
import { Interactable } from "./interactable";

export class Switch extends Interactable {
  constructor(x: number, y: number, private action: () => void) {
    super(new SpritePainter(Sprite.Sprites['tiles'], {spriteWidth: 16, spriteHeight: 16, spriteOffsetX: 0, spriteOffsetY: 0}), x, y);
  }

  doAction() {
    this.action();
  }
}