import { Scene, Sprite, SpriteEntity, SpritePainter } from "game-engine";
import { Interactable } from "./interactable";

export class Rock extends Interactable {
  constructor(x: number, y: number) {
    super(new SpritePainter(Sprite.Sprites['tiles'], {spriteWidth: 16, spriteHeight: 16}), x, y);
    this.imageIndex = 289;
  }

  tick(scene: Scene): void | Promise<void> {
  }
}