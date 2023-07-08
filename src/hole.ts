import { Scene, SpriteEntity, SpritePainter } from "game-engine";

export class Hole extends SpriteEntity {
  constructor(x: number, y: number) {
    super(new SpritePainter(ctx => {}, {spriteWidth: 10, spriteHeight: 10, spriteOffsetX: -3, spriteOffsetY: -3}), x, y);
  }

  tick(scene: Scene): void | Promise<void> {
  }
}