import { Scene, SpriteEntity, SpritePainter } from "game-engine";
import { screenHeight, screenWidth } from "./game";

export class Credits extends SpriteEntity {
  private text: string[] = [
    '----ART----',
    'Sunnyside World - @DanielDiggle',
    'General Items - CanariPack 8BIT TopDown',
    '---MUSIC---',
    'Daytime loop - T K I M U S E',
    '--SOUNDS--',
    'General Effects - CanariPack 8BIT TopDown',
    '---CODE---',
    'Nicholas (nDev) Denaro'
  ];
  constructor() {
    super(new SpritePainter(ctx => this.draw(ctx), {spriteWidth: screenWidth, spriteHeight: screenHeight}));

  }

  private scroll: number;
  tick(scene: Scene): void | Promise<void> {
    this.scroll += 0.5;
  }
  
  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, screenWidth, 48);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '16px game';
    let i = 0;
    for (let line of this.text) {
      ctx.fillText(line, 2, 12 + i * 16 - this.scroll, screenWidth - 4);
      i++;
    }
  }
}