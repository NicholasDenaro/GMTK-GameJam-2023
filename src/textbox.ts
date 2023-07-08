import { ControllerState, Scene, Sound, SpriteEntity, SpritePainter } from "game-engine";
import { screenWidth } from "./game";
import { Npc } from "./npc";
import { Player } from "./player";

const rfont = require.context('../assets/premade', false, /\.ttf$/);
const sfont = rfont('./BetterPixels.ttf');
console.log(sfont);
const font = new FontFace('game', `url(${sfont})`);
font.load().then(() => {
  console.log('loaded font');
  document.fonts.add(font);
},
(err) => {
  console.error(err);
});

export class TextboxEntity extends SpriteEntity {
  constructor(private dialog: (string | { options: string[] })[], private target: Npc) {
    super(new SpritePainter(ctx => this.draw(ctx), {spriteWidth: screenWidth, spriteHeight: 48}));
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
          this.target.giveItem(scene.entitiesByType(Player)[0]);
          Sound.Sounds['pause'].play();
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
      ctx.fillText('◀', screenWidth - 16, 12 + this.cursor * 16);
    }
  }
}