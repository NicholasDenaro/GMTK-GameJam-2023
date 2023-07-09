import { Sprite, SpritePainter } from "game-engine";
import { Interactable } from "./interactable";

export class Pot extends Interactable {

  constructor(private initialX: number, private initialY: number) {
    super(new SpritePainter(Sprite.Sprites['tiles'], { spriteWidth: 16, spriteHeight: 16, spriteOffsetX: 0, spriteOffsetY: 0 }), initialX, initialY);
    this.imageIndex = 1265;
  }

  reset() {
    this.x = this.initialX;
    this.y = this.initialY;
    super.reset();
  }
}