import { ControllerState, Scene, Sound, Sprite, SpriteEntity, SpritePainter } from "game-engine";
import { buildMap, engine, statefulMode, keyController, screenHeight, screenWidth, stopwatch, FPS, changeLoop } from "./game";

export class Title extends SpriteEntity {
  constructor() {
    super(new SpritePainter(ctx => this.draw(ctx), {spriteWidth: screenWidth, spriteHeight: screenHeight}));
  }

  tick(scene: Scene): void | Promise<void> {
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const bump = 32;
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#000000';
    ctx.font = '40px game';
    ctx.strokeText('Postgame', 14, 40 + bump);
    ctx.fillText('Postgame', 14, 40 + bump);
    ctx.strokeText('Giveaway', 14, 64 + bump);
    ctx.fillText('Giveaway', 14, 64 + bump);

    ctx.font = '12px game';
    ctx.strokeText('Theme: Roles Reversed', 32, screenHeight * 1 / 2 - 8 + bump);
    ctx.fillText('Theme: Roles Reversed', 32, screenHeight * 1 / 2 - 8 + bump);
  }
}