import { ControllerState, Scene, Sound, Sprite, SpriteEntity, SpritePainter } from "game-engine";
import { drawTile, engine, loopTrack, screenHeight, screenWidth, statefulMode, volume } from "./game";

export class OptionsEntity extends SpriteEntity {
  private cursor = 0;
  private options = 4;
  constructor() {
    super(new SpritePainter(ctx => this.draw(ctx), {spriteWidth: screenWidth, spriteHeight: screenHeight}));
  }

  tick(scene: Scene): void | Promise<void> {

    if (scene.isControl('pause', ControllerState.Press)
      || scene.isControl('restart', ControllerState.Press)
      || scene.isControl('action2', ControllerState.Press)) {
      engine.switchToScene('main_menu');
      Sound.Sounds['pause'].play();
    }

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

    if (scene.isControl('action1', ControllerState.Press)) {
      switch (this.cursor) {
        case 0:
          statefulMode.enabled = !statefulMode.enabled;
          Sound.Sounds['pause'].play();
          break;
        case 1:
          break;
      }
    }

    if (scene.isControl('left', ControllerState.Press)) {
      switch (this.cursor) {
        case 0:
          statefulMode.enabled = !statefulMode.enabled;
          break;
        case 1:
          volume.main = Math.max(volume.main - 0.1, 0);
          document.cookie = `volume.main=${volume.main}`;
          break;
        case 2:
          volume.music = Math.max(volume.music - 0.1, 0);
          document.cookie = `volume.music=${volume.music}`;
          break;
        case 3:
          volume.sounds = Math.max(volume.sounds - 0.1, 0);
          document.cookie = `volume.sounds=${volume.sounds}`;
          break;
      }

      Sound.setVolume(volume.main * volume.sounds);
      Sound.Sounds['pause'].play();
      loopTrack.track.volume(volume.main * volume.music);
    }

    if (scene.isControl('right', ControllerState.Press)) {
      switch (this.cursor) {
        case 0:
          statefulMode.enabled = !statefulMode.enabled;
          break;
        case 1:
          volume.main = Math.min(volume.main + 0.1, 1);
          document.cookie = `volume.main=${volume.main}`;
          break;
        case 2:
          volume.music = Math.min(volume.music + 0.1, 1);
          document.cookie = `volume.music=${volume.music}`;
          break;
        case 3:
          volume.sounds = Math.min(volume.sounds + 0.1, 1);
          document.cookie = `volume.sounds=${volume.sounds}`;
          break;
      }

      Sound.setVolume(volume.main * volume.sounds);
      Sound.Sounds['pause'].play();
      loopTrack.track.volume(volume.main * volume.music);
    }
  }
  
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.font = '16px game';
    ctx.strokeStyle = '#000000';
    ctx.fillStyle = '#FFFFFF';

    let buffer = 4;
    let i = 0;

    ctx.strokeText(`Easy Mode:`, 17, 16 + buffer + i * 16);
    ctx.fillText(`Easy Mode:`, 17, 16 + buffer + i * 16);

    drawTile(ctx, screenWidth / 2, buffer + 4 + i * 16, 3115 + (statefulMode.enabled ? 1 : 0));

    i++;

    ctx.strokeText(`Volume:`, 17, 16 + buffer + i * 16);
    ctx.fillText(`Volume:`, 17, 16 + buffer + i * 16);

    this.drawVolume(ctx, 56 + 16, 16 + buffer + i * 16 - 12, volume.main);

    if (this.cursor == 1) {
      drawTile(ctx, 56, buffer + 4 + this.cursor * 16, 3109);
      drawTile(ctx, screenWidth - 48 - 8, buffer + 4 + this.cursor * 16, 3045);
    }
    i++;

    ctx.strokeText(`Music:`, 17, 16 + buffer + i * 16);
    ctx.fillText(`Music:`, 17, 16 + buffer + i * 16);

    this.drawVolume(ctx, 56 + 16, 16 + buffer + i * 16 - 12, volume.music);

    if (this.cursor == 2) {
      drawTile(ctx, 56, buffer + 4 + this.cursor * 16, 3109);
      drawTile(ctx, screenWidth - 48 - 8, buffer + 4 + this.cursor * 16, 3045);
    }
    i++;

    ctx.strokeText(`Sounds:`, 17, 16 + buffer + i * 16);
    ctx.fillText(`Sounds:`, 17, 16 + buffer + i * 16);

    this.drawVolume(ctx, 56 + 16, 16 + buffer + i * 16 - 12, volume.sounds);

    if (this.cursor == 3) {
      drawTile(ctx, 56, buffer + 4 + this.cursor * 16, 3109);
      drawTile(ctx, screenWidth - 48 - 8, buffer + 4 + this.cursor * 16, 3045);
    }

    i++;

    ctx.strokeText(`Controls:`, 17, 16 + buffer + i * 16);
    ctx.fillText(`Controls:`, 17, 16 + buffer + i * 16);

    i++;

    ctx.strokeText(`Enter: Inventory`, 17, 16 + buffer + i * 16);
    ctx.fillText(`Enter: Inventory`, 17, 16 + buffer + i * 16);

    i++;

    ctx.strokeText(`Esc: Reset`, 17, 16 + buffer + i * 16);
    ctx.fillText(`Esc: Reset`, 17, 16 + buffer + i * 16);

    i++;

    ctx.strokeText(`X: Select/Talk`, 17, 16 + buffer + i * 16);
    ctx.fillText(`X: Select/Talk`, 17, 16 + buffer + i * 16);

    i++;

    ctx.strokeText(`Z: Cancel`, 17, 16 + buffer + i * 16);
    ctx.fillText(`Z: Cancel`, 17, 16 + buffer + i * 16);

    i++;

    drawTile(ctx, screenWidth - 32, buffer + 4 + this.cursor * 16, 3047);
  }

  drawVolume(ctx: CanvasRenderingContext2D, x: number, y: number, volume: number) {

    ctx.drawImage(Sprite.Sprites['volume'].getImage(), 0, 0, 1 + volume * 10 * 3, 16, x, y, 1 + volume * 10 * 3, 16);
  }
}