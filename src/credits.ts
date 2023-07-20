import { ControllerState, Scene, SpriteEntity, SpritePainter } from "game-engine";
import { FPS, buildMap, changeLoop, cutscenes, engine, keyController, screenHeight, screenTransition, screenWidth, win } from "./game";

export class Credits extends SpriteEntity {
  private text: string[][] = [
    [
      '----ART----',
      'Sunnyside World sprite pack - @DanielDiggle',
      '(tiles, characters, inventory background)',
      'Items - CanariPack 8BIT TopDown',
      'Font - BetterPixels',
      'bombs & explosion - nDev',
      'holes - remixed from Sunnyside World - nDev',
    ],
    [
      '---MUSIC---',
      'Music Loops - T K I M U S E',
      'Harp - T K I M U S E',
    ],
    [
      '--SOUNDS--',
      'General Effects - CanariPack 8BIT TopDown',
      'grass cut - Epic Stock Media',
      'pot shatter - Epic Stock Media',
      'fire - Epic Stock Media',
      'explosion - Mega-SFX-Pack',
      'start jingle - interfacesfx_windows',
      'Bow firing - nDev',
    ],
    [
      '---TOOLS---',
      'Visual Studio Code',
      'Aseprite',
      'Tiled',
      'My custom game engine',
      '(Available on GitHub @NicholasDenaro)',
    ],
    [
      '---CODE---',
      'Nicholas (nDev) Denaro',
      '(Available on GitHub @NicholasDenaro)',
    ],
    [
      'Thank you for playing!',
    ]
  ];
  private index = 0;
  constructor() {
    super(new SpritePainter(ctx => this.draw(ctx), {spriteWidth: screenWidth, spriteHeight: screenHeight}));
  }

  private creditsTimer = 0;
  tick(scene: Scene): void | Promise<void> {
    if (win.active) {
      changeLoop('town');
    }
    if (screenTransition.active && screenTransition.timer != screenTransition.totalTime) {
      return;
    }

    if (this.creditsTimer === FPS * 2) {
      if (win.active) cutscenes['scene1'].start(scene);
    }
    if (this.creditsTimer === FPS * 2 + 1) {
      if (win.active) cutscenes['scene2'].start(scene);
      this.index++;
    }
    if (this.creditsTimer === FPS * 4) {
      if (win.active) cutscenes['scene3'].start(scene);
    }
    if (this.creditsTimer === FPS * 4 + 1) {
      if (win.active) cutscenes['scene4'].start(scene);
      this.index++;
    }
    if (this.creditsTimer === FPS * 6) {
      if (win.active) cutscenes['scene5'].start(scene);
    }
    if (this.creditsTimer === FPS * 6 + 1) {
      if (win.active) cutscenes['scene6'].start(scene);
      this.index++;
    }
    if (this.creditsTimer === FPS * 8) {
      if (win.active) cutscenes['scene7'].start(scene);
    }
    if (this.creditsTimer === FPS * 8 + 1) {
      if (win.active) cutscenes['scene8'].start(scene);
      this.index++;
    }
    if (this.creditsTimer === FPS * 10) {
      if (win.active) cutscenes['scene9'].start(scene);
      this.index++;
    }
    this.creditsTimer++;
    if (!win.active) {
      if (scene.isControl('restart', ControllerState.Press)
        || scene.isControl('pause', ControllerState.Press)
        || scene.isControl('action1', ControllerState.Press)
        || scene.isControl('action2', ControllerState.Press)) {
        engine.switchToScene('main_menu');
        changeLoop('overworld');
        this.creditsTimer = 0;
        this.index = 0;
        win.active = false;
      }
    }
    if (this.index >= this.text.length - 1) {
      if (scene.isControl('restart', ControllerState.Press)
        || scene.isControl('pause', ControllerState.Press)
        || scene.isControl('action1', ControllerState.Press)
        || scene.isControl('action2', ControllerState.Press)) {
        engine.switchToScene('main_menu');
        changeLoop('overworld');
        this.creditsTimer = 0;
        this.index = 0;
        win.active = false;
      }
    }
  }
  
  draw(ctx: CanvasRenderingContext2D) {
    // ctx.strokeStyle = '#000000';
    // ctx.fillStyle = '#FFFFFF';
    ctx.fillStyle = '#000000';
    ctx.font = '16px game';
    let i = 0;
    for (let line of this.text[this.index]) {
      //ctx.strokeText(line, 2, 12 + i * 16 + 16, screenWidth - 4);
      ctx.fillText(line, 2, 12 + i * 16 + screenHeight / 2 - this.text[this.index].length * 16 / 2, screenWidth - 4);
      i++;
    }
  }
}