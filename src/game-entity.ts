import { Scene, SpriteEntity, SpritePainter } from "game-engine";

export class GameEntity extends SpriteEntity {
  constructor(painter: SpritePainter, x?: number, y?: number) {
    super(painter, x, y);
  }

  tick(scene: Scene): void | Promise<void> {
  }

  move(dx: number, dy: number) {
    this.x += dx;
    this.y += dy;
  }

  moveTo(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}