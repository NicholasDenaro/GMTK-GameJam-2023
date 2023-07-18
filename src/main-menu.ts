import { ControllerState, Scene, Sound, Sprite, SpriteEntity, SpritePainter } from "game-engine";
import { buildMap, engine, statefulMode, keyController, screenHeight, screenWidth, stopwatch, FPS, changeLoop, drawTile } from "./game";

export class MainMenu extends SpriteEntity {
  constructor() {
    super(new SpritePainter(ctx => this.draw(ctx), {spriteWidth: screenWidth, spriteHeight: screenHeight}));
  }
  private timer = FPS * 2;
  private showMenu = false;
  private cursor = 0;
  private options = 3;
  tick(scene: Scene): void | Promise<void> {
    if (this.timer > 0) {
      this.timer--;
    }
    if (this.timer == 0) {
      this.timer--;
      this.showMenu = true;
      changeLoop('overworld');
    }
    if (this.showMenu) {

      if (scene.isControl('up', ControllerState.Press)) {
        this.cursor--;
        this.cursor = (this.cursor + this.options) % this.options;
        Sound.Sounds['talk'].play();
      }

      if (scene.isControl('down', ControllerState.Press)) {
        this.cursor++;
        this.cursor = (this.cursor + this.options) % this.options;
        Sound.Sounds['talk'].play();
      }

      if (scene.isControl('action1', ControllerState.Press) || scene.isControl('pause', ControllerState.Press)) {
        Sound.Sounds['pause'].play();
        switch (this.cursor) {
          case 0:
            buildMap(scene.getView(), keyController);
            engine.switchToScene('0,0');
            stopwatch.start = Date.now();
            console.log(`ez mode: ${statefulMode.enabled}`);
            break;
          case 1:
            engine.switchToScene('settings_menu');
            break;
          case 2:
            engine.switchToScene('credits');
            break;
        }
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#000000';
    ctx.font = '40px game';
    ctx.strokeText('Postgame', 14, 40);
    ctx.fillText('Postgame', 14, 40);
    ctx.strokeText('Giveaway', 14, 64);
    ctx.fillText('Giveaway', 14, 64);

    ctx.font = '12px game';
    ctx.strokeText('Theme: Roles Reversed', 32, screenHeight * 1 / 2 - 8);
    ctx.fillText('Theme: Roles Reversed', 32, screenHeight * 1 / 2 - 8);


    ctx.fillStyle = '#FFFFFF';
    ctx.font = '10px game';
    ctx.strokeText('Post-Jam', 17, 14);
    ctx.fillText('Post-Jam', 17, 14);

    if (this.showMenu) {
      const buffer = 0;
      const spacing = -3;
      ctx.font = '32px game';

      let i = 0;
      this.drawButton(ctx, 32, 64 + i * (32 + spacing) + buffer, 5, 3);
      ctx.strokeText('Start', 50, 64 + i * (32 + spacing) + 33 + buffer);
      ctx.fillText('Start', 50, 64 + i * (32 + spacing) + 33 + buffer);

      i++;

      this.drawButton(ctx, 16, 64 + i * (32 + spacing) + buffer, 7, 3);
      ctx.strokeText('Options', 39, 64 + i * (32 + spacing) + 33 + buffer);
      ctx.fillText('Options', 39, 64 + i * (32 + spacing) + 33 + buffer);

      i++;

      this.drawButton(ctx, 16, 64 + i * (32 + spacing) + buffer, 7, 3);
      ctx.strokeText('Credits', 39, 64 + i * (32 + spacing) + 33 + buffer);
      ctx.fillText('Credits', 39, 64 + i * (32 + spacing) + 33 + buffer);

      let cursorX = this.cursor == 0 ? 16 + 8 : 8;
      let cursorY = 64 + buffer + 16 + this.cursor * (32 + spacing);

      drawTile(ctx, cursorX, cursorY, 2983);
      drawTile(ctx, screenWidth - 16 - cursorX, cursorY, 3047);

    } else {
      const bump = 4;

      ctx.fillStyle = '#000000CC';
      ctx.fillRect(32 - 1, screenHeight / 2 - 10 + bump, 105, 8);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '10px game';
      ctx.strokeText('Originally developed for the', 32, screenHeight / 2 - 3 + bump);
      ctx.fillText('Originally developed for the', 32, screenHeight / 2 - 3 + bump);

      ctx.fillStyle = '#00000055';
      //ctx.fillRect(16, 78 + bump, screenWidth - 32, 80);
      this.drawButton(ctx, 0, 64, 9, 7);
      ctx.drawImage(Sprite.Sprites['logo'].getImage(), 0, 72 + bump);
    }
  }

  drawButton(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
    for (let j = 0; j < height; j++) {
      let i = 0;
      let row = j;
      if (row > 1) {
        if (row == height - 1) {
          row = 3;
        } else {
          row = 2;
        }
      }
      ctx.drawImage(Sprite.Sprites['button'].getImage(), 0, row * 16, 32, 16, x + i * 16, y + j * 16, 32, 16);
      i += 2;
      for (; i < width - 1; i++) {
        ctx.drawImage(Sprite.Sprites['button'].getImage(), 32, row * 16, 16, 16, x + i * 16, y + j * 16, 16, 16);
      }
      ctx.drawImage(Sprite.Sprites['button'].getImage(), 48, row * 16, 32, 16, x + i * 16, y + j * 16, 32, 16);
      i += 2;
    }
  }
}