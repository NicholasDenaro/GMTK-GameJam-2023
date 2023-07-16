import { Sprite, SpritePainter } from "game-engine";
import { Interactable } from "./interactable";

export class HeavyRock extends Interactable {
  constructor(private initialX: number, private initialY: number) {
    super(new SpritePainter(Sprite.Sprites['tiles'], { spriteWidth: 16, spriteHeight: 16, spriteOffsetX: 0, spriteOffsetY: 0 }), initialX, initialY);
    this.imageIndex = 1591;
  }

  reset() {
    this.x = this.initialX;
    this.y = this.initialY;
    super.reset();
  }

  breakWhenThrown() {
    return false;
  }
}