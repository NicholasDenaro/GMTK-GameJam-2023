import { SpritePainter } from "game-engine";
import { Interactable } from "./interactable";

export class HalfWall extends Interactable {
  constructor(x: number, y: number, width: number, height: number) {
    super(new SpritePainter(ctx => {}, {spriteWidth: width, spriteHeight: height, spriteOffsetX: 0, spriteOffsetY: 0}), x, y);
  }
}