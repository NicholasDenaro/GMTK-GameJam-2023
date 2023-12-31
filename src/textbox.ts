import { ControllerState, Scene, Sound, SpriteEntity, SpritePainter } from "game-engine";
import { drawTile, screenWidth } from "./game";
import { Npc } from "./npc";
import { Player } from "./player";

export class TextboxEntity extends SpriteEntity {
  constructor(private dialog: (string | { options: string[] })[], private target?: Npc, private action?: () => void) {
    super(new SpritePainter(ctx => this.draw(ctx), {spriteWidth: screenWidth, spriteHeight: 48}));
    this.zIndex = -999;
  }
  private dialogIndex = 0;
  private cursor = 0;
  tick(scene: Scene): void | Promise<void> {
    if (scene.isControl('action2', ControllerState.Press)) {
      scene.removeEntity(this);
      return;
    }

    if (scene.isControl('action1', ControllerState.Press)) {
      if ((<any>this.dialog[this.dialogIndex]).options) {
        if (this.cursor == 1) {
          if (this.target) {
            this.target.giveItem(scene.entitiesByType(Player)[0]);
            Sound.Sounds['pause'].play();
          }
          if (this.action) {
            this.action();
          }
        }
      }
      this.dialogIndex++;
      if (this.dialogIndex >= this.dialog.length) {
        scene.removeEntity(this);
        return;
      }

      Sound.Sounds['talk'].play();
      return;
    }

    if ((<any>this.dialog[this.dialogIndex]).options) {
      if (scene.isControl('down', ControllerState.Press)) {
        this.cursor++;
        this.cursor %= (<any>this.dialog[this.dialogIndex]).options.length;
      }
      if (scene.isControl('up', ControllerState.Press)) {
        this.cursor--;
        this.cursor += (<any>this.dialog[this.dialogIndex]).options.length;
        this.cursor %= (<any>this.dialog[this.dialogIndex]).options.length;
      } 
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.dialogIndex >= this.dialog.length) {
      return;
    }
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, screenWidth, 48);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '16px game';
    if (!(<any>this.dialog[this.dialogIndex]).options) {
      let i = 0;
      for (let line of (<string>this.dialog[this.dialogIndex]).split('\n')) {
        ctx.fillText(line, 2, 12 + i * 16, screenWidth - 4);
        i++;
      }
    } else {
      const options = (<{options: string[]}>this.dialog[this.dialogIndex]).options;
      let i = 0;
      for (let option of options) {
        // ▶
        ctx.fillText(option, 2, 12 + i * 16, screenWidth - 4);
        i++;
      }
      drawTile(ctx, screenWidth - 16, this.cursor * 16, 3047);
    }
  }
}