import { Sprite, SpritePainter } from "game-engine";
import { Interactable } from "./interactable";

export class Pot extends Interactable {

  constructor(x: number, y: number) {
    super(new SpritePainter(Sprite.Sprites['tiles'], { spriteWidth: 16, spriteHeight: 16 }), x, y);
    this.imageIndex = 1265;
  }

}