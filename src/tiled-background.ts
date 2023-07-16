import { Scene, Sprite, SpriteEntity, SpritePainter } from "game-engine";
import { screenHeight, screenWidth } from "./game";

export class TiledBackground extends SpriteEntity {
  constructor(private tiles: number[], zIndex: number, private tileWidth = 16, private tileHeight = 16) {
    super(new SpritePainter(ctx => this.draw(ctx), {spriteWidth: screenWidth, spriteHeight: screenHeight}), 0, 16)
    this.zIndex = zIndex;
  }

  tick(scene: Scene): void | Promise<void> {
  }

  draw(ctx: CanvasRenderingContext2D) {
    const sprite = Sprite.Sprites['tiles'];
    const scol = sprite.getImage().width / this.tileWidth;
    const srow = sprite.getImage().height / this.tileHeight;
    const dcol = screenWidth / this.tileWidth;
    const drow = (screenWidth / this.tileWidth);
    //console.log(`grid columns: ${sprite.getGrid().columns}, rows: ${sprite.getGrid().rows}`);
    for (let i = 0; i < this.tiles.length; i++) {
      const dx = (i % dcol) * this.tileWidth;
      const dy = Math.floor(i / dcol) * this.tileHeight;

      const tile = (this.tiles[i] - 1);
      const tileIndex = (this.tiles[i] - 1) & (0x0FFFFFFF);
      const sx = (tileIndex % scol) * this.tileWidth;
      const sy = Math.floor(tileIndex / scol) * this.tileHeight;

      const flipH = (tile & 0x80000000) == 0 ? 1 : -1;
      const flipV = (tile & 0x40000000) == 0 ? 1 : -1;
      const flipD = (tile & 0x20000000) != 0;

      //console.log(`c: ${col} r: ${col} sx: ${sx} sy: ${sy}`);
      ctx.save();
      if (flipD) {
        ctx.transform(0, 1 * this.tileHeight * flipV, 1 * this.tileWidth * flipH, 0, dx + this.x + (flipH < 0 ? 16 : 0), dy + this.y + (flipV < 0 ? 16 : 0));
      } else {
        ctx.transform(1 * this.tileWidth * flipH, 0, 0, 1 * this.tileHeight * flipV, dx + this.x + (flipH < 0 ? 16 : 0), dy + this.y + (flipV < 0 ? 16 : 0));
      }
      // ctx.drawImage(sprite.getImage(), sx, sy, this.tileWidth, this.tileHeight, (dx + this.x) * (flipH ? -1 : 1) + (flipH ? -16 : 0), (dy + this.y) * (flipV ? -1 : 1) + (flipV ? -16 : 0), this.tileWidth, this.tileHeight);
      ctx.drawImage(sprite.getImage(), sx, sy, this.tileWidth, this.tileHeight, 0, 0, 1, 1);
      ctx.restore();
    }
  }
}