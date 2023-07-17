import { Scene, SpriteEntity, SpritePainter } from "game-engine";
import { GameEntity } from "./game-entity";

export class Wall extends GameEntity {
  constructor(x: number, y: number, width: number, height: number) {
    super(new SpritePainter(() => { }, { spriteWidth: width, spriteHeight: height }), x, y);
  }
  tick(scene: Scene): void | Promise<void> {
  }
  
}