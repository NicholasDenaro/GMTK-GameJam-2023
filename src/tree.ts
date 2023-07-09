import { Sprite, SpritePainter } from "game-engine";
import { Interactable } from "./interactable";

export class Tree extends Interactable {
  constructor(x: number, y: number) {
    super(new SpritePainter(Sprite.Sprites['tree'], {spriteWidth: 16, spriteHeight: 16, spriteOffsetX: 0, spriteOffsetY: 0}), x, y);
  }
}