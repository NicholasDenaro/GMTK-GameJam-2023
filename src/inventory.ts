import { ControllerState, Scene, Sprite, SpriteEntity, SpritePainter } from "game-engine";
import { screenHeight, screenWidth } from "./game";
import { Player } from "./player";

export const itemMap = [
  'shovel', // done
  'sword', // done
  'lamp', // done
  'bow',
  'feather', // done
  'compass',
  'glove', // done - does need to maybe break/damage still
  'mirror',
  'harp',
  'bomb',
];

export class Inventory extends SpriteEntity {
  private grid: number[][] = [[],[],[],[]];

  constructor(private player: Player) {
    super(new SpritePainter(ctx => this.draw(ctx), {spriteWidth: screenWidth, spriteHeight: screenHeight}));
    for (let j = 0; j < 4; j++) {
      for (let i = 0; i < 4; i++) {
        this.grid[i][j] = -1;
      }
    }

    this.grid[0][0] = 2;
    this.grid[1][1] = 3;
    this.grid[0][2] = 4;
    this.grid[0][3] = 5;

    this.grid[2][1] = 6;
    this.grid[3][0] = 7;

    this.grid[2][2] = 8;
    this.grid[3][1] = 9;
  }

  private cursorX = 0;
  private cursorY = 0;
  tick(scene: Scene): void | Promise<void> {
    if (scene.isControl('left', ControllerState.Press)) {
      this.cursorX--;
      if (this.cursorX < 0) {
        this.cursorX = 0;
      }
    }
    if (scene.isControl('right', ControllerState.Press)) {
      this.cursorX++;
      if (this.cursorX > 3) {
        this.cursorX = 3;
      }
    }
    if (scene.isControl('up', ControllerState.Press)) {
      this.cursorY--;
      if (this.cursorY < 0) {
        this.cursorY = 0;
      }
    }
    if (scene.isControl('down', ControllerState.Press)) {
      this.cursorY++;
      if (this.cursorY > 3) {
        this.cursorY = 3;
      }
    }
    if (scene.isControl('action1', ControllerState.Press)) {
      const temp = this.grid[this.cursorX][this.cursorY];
      this.grid[this.cursorX][this.cursorY] = this.player.getItem1();
      this.player.setItem1(temp);
    }
    if (scene.isControl('action2', ControllerState.Press)) {
      const temp = this.grid[this.cursorX][this.cursorY];
      this.grid[this.cursorX][this.cursorY] = this.player.getItem2();
      this.player.setItem2(temp);
    }
  }

  removeItem(item: number) {
    for (let j = 0; j < 4; j++) {
      for (let i = 0; i < 4; i++) {
        if (this.grid[i][j] == item) {
          this.grid[i][j] = -1;
        }
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (let j = 0; j < 4; j++) {
      for (let i = 0; i < 4; i++) {
        let x = 20 + i * 32;
        let y = 32 + j * 20;
        if (this.grid[i][j] != -1) {
          ctx.drawImage(Sprite.Sprites[itemMap[this.grid[i][j]]].getImage(), x, y);
        }
        if (this.cursorX == i && this.cursorY == j) {
          ctx.fillRect(x - 1, y + 1, 1, 14);
          ctx.fillRect(x + 17, y + 1, 1, 14);
        }
      }
    }
  }
}