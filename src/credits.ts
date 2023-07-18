import { ControllerState, Scene, SpriteEntity, SpritePainter } from "game-engine";
import { changeLoop, engine, screenHeight, screenWidth } from "./game";

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
    'Music Loops - T K I M U S E',
    'Harp - T K I M U S E',
    '',
    '--SOUNDS--',
    'General Effects - CanariPack 8BIT TopDown',
    'grass cut - Epic Stock Media',
    'pot shatter - Epic Stock Media',
    'fire - Epic Stock Media',
    'explosion - Mega-SFX-Pack',
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
    if (scene.isControl('sprint', ControllerState.Held)) {
      this.scroll += 2;
    }
    if (scene.isControl('restart', ControllerState.Press)
      || scene.isControl('pause', ControllerState.Press)
      || scene.isControl('action1', ControllerState.Press)
      || scene.isControl('action2', ControllerState.Press)) {
      engine.switchToScene('main_menu');
      changeLoop('overworld');
      this.scroll = -screenHeight / 2;
    }
    if (this.scroll >= screenHeight * 2.5 + 64 + 16) {
      this.scroll = screenHeight * 2.5 + 64 + 16;
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