import { Scene, SpriteEntity, SpritePainter } from "game-engine";

export class Hole extends SpriteEntity {
  constructor(x: number, y: number) {
    super(new SpritePainter(ctx => {}, {spriteWidth: 8, spriteHeight: 8, spriteOffsetX: -4, spriteOffsetY: -4}), x, y);
  }

  tick(scene: Scene): void | Promise<void> {
  }
}