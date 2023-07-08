import { Scene, SpriteEntity, SpritePainter } from "game-engine";

export class Door extends SpriteEntity {
  constructor(x: number, y: number, private destination: string, private destinationX: number, private destionationY: number, private worldX: number, private worldY: number) {
    super(new SpritePainter(ctx => {}, {spriteWidth: 12, spriteHeight: 12, spriteOffsetX: -2, spriteOffsetY: -2}), x, y);
  }

  tick(scene: Scene): void | Promise<void> {
  }

  travelInfo() {
    return {
      destination: this.destination,
      x: this.destinationX,
      y: this.destionationY,
      worldX: this.worldX,
      worldY: this.worldY,
    }
  }
}