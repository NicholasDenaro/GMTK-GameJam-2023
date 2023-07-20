import { Scene, Sprite, SpriteEntity, SpritePainter } from "game-engine";
import { drawTile, screenWidth, win } from "./game";
import { itemMap } from "./inventory";
import { Cursor, Player } from "./player";

export class StatusBar extends SpriteEntity {
  constructor(private player: Player) {
    super(new SpritePainter(ctx => this.draw(ctx), {spriteWidth: screenWidth, spriteHeight: 16}));
    this.zIndex = -998;
  }

  tick(scene: Scene): void | Promise<void> {
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (win.active || !this.player) {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, screenWidth, 16);
      return;
    }

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, screenWidth, 16);
    ctx.drawImage(Sprite.Sprites['coin'].getImage(), -4, -4);
    ctx.fillStyle = '#000000';
    ctx.font = '12px game';
    ctx.fillText('999', 0, 16);

    ctx.fillText('Z', 15, 8);
    ctx.fillRect(16 + 4, 1, 1, 14);
    ctx.fillRect(32 + 4, 1, 1, 14);
    if (this.player.getItem2() != -1) {
      ctx.drawImage(Sprite.Sprites[itemMap[this.player.getItem2()]].getImage(), 20, 0);
    }

    ctx.fillText('X', 40, 8);
    ctx.fillRect(41 + 4, 1, 1, 14);
    ctx.fillRect(57 + 4, 1, 1, 14);

    if (this.player.showTalkIcon) {
      drawTile(ctx, 47, 0, 3054);
    } else if (this.player.getItem1() != -1) {
      ctx.drawImage(Sprite.Sprites[itemMap[this.player.getItem1()]].getImage(), 45, 0);
    }

    for (let i = 0; i < 6; i++) {
      ctx.drawImage(Sprite.Sprites['heart'].getImage(), 64 + i * 16, 0);
    }
  }
}