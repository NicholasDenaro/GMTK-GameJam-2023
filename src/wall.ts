import { Scene, SpriteEntity, SpritePainter } from "game-engine";

export class Wall extends SpriteEntity {
  constructor(x: number, y: number, width: number, height: number) {
    super(new SpritePainter(() => { }, { spriteWidth: width, spriteHeight: height }), x, y);
  }
  tick(scene: Scene): void | Promise<void> {
  }
  
}