import { ControllerState, Scene, SpriteEntity, SpritePainter } from "game-engine";
import { engine, screenHeight, screenWidth } from "./game";

export class Credits extends SpriteEntity {
  private text: string[] = [
    '----ART----',
    'Sunnyside World sprite pack - @DanielDiggle',
    '(tiles, characters, inventory background)',
    'Items - CanariPack 8BIT TopDown',
    'Font - BetterPixels',
    'bombs & explosion - nDev',
    'holes - remixed from Sunnyside World - nDev',
    '',
    '---MUSIC---',
    'Daytime loop - T K I M U S E',
    'Harp - T K I M U S E',
    '',
    '--SOUNDS--',
    'General Effects - CanariPack 8BIT TopDown',
    'Bow firing - nDev',
    '',
    '---TOOLS---',
    'Visual Studio Code',
    'Aseprite',
    'Tiled',
    'My custom game engine',
    '(Available on GitHub @NicholasDenaro)',
    '',
    '---CODE---',
    'Nicholas (nDev) Denaro',
    '(Available on GitHub @NicholasDenaro)',
    '',
    '',
    '',
    '',
    'Thank you for playing!',
    '(Press Enter to go back to the main menu)',
  ];
  constructor() {
    super(new SpritePainter(ctx => this.draw(ctx), {spriteWidth: screenWidth, spriteHeight: screenHeight}));
  }

  private scroll = -screenHeight / 2 - 32;
  tick(scene: Scene): void | Promise<void> {
    this.scroll += 0.25;
    if (scene.isControl('action1', ControllerState.Held) || scene.isControl('action2', ControllerState.Held)) {
      this.scroll += 0.25;
    }
    if (scene.isControl('sprint', ControllerState.Held)) {
      this.scroll += 2;
    }
    if (this.scroll >= screenHeight * 2.5 + 16) {
      this.scroll = screenHeight * 2.5 + 16;
      if (scene.isControl('pause', ControllerState.Press)) {
        engine.switchToScene('main_menu');
        this.scroll = -screenHeight / 2;
      }
    }
  }
  
  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#000000';
    ctx.font = '16px game';
    let i = 0;
    for (let line of this.text) {
      ctx.fillText(line, 2, 12 + i * 16 - this.scroll, screenWidth - 4);
      i++;
    }
  }
}