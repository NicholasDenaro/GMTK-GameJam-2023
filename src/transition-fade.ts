import { Scene, Sprite, SpriteEntity, SpritePainter } from "game-engine";
import { FPS, screenHeight, screenWidth } from "./game";

const totalTime = 10;

export class TransitionFadeEntity extends SpriteEntity {
  
  private timer = totalTime;
  constructor() {
    super(new SpritePainter(ctx => this.draw(ctx), {spriteWidth: screenWidth, spriteHeight: screenHeight}), 0, 16);
    this.zIndex = -999
  }

  tick(scene: Scene): void | Promise<void> {
    this.timer--;
  }

  reset() {
    this.timer = totalTime;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 16, screenWidth / 2 + this.timer * 16, screenHeight);
    ctx.fillRect(screenWidth, 16, - (screenWidth / 2 + this.timer * 16), screenHeight);
  }
}