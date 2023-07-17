import { Scene, Sound, Sprite, SpriteEntity, SpritePainter } from "game-engine";
import { TextboxEntity } from "./textbox";
import { Cursor, Player } from "./player";
import { GameEntity } from "./game-entity";
import { Pot } from "./pot";
import { compassManAlternateDialog } from "./game";

export class NpcImage extends SpriteEntity {
  constructor(private npc: Npc, private sprite: string, private animation: string) {
    super(new SpritePainter(Sprite.Sprites[`${sprite}_${animation}`]));
    this.zIndex = -1;
  }

  tick(scene: Scene): void | Promise<void> {
    this.x = this.npc.getPos().x;
    this.y = this.npc.getPos().y;
    this.imageIndex = this.npc.imageIndex;
    this.flipHorizontal = this.npc.flipHorizontal;
  }

  setAnimation(animation: string) {
    this.animation = animation;
    (this.painter as SpritePainter).setSprite(Sprite.Sprites[`${this.sprite}_${this.animation}`]);
  }

  spriteFrames() {
    return Sprite.Sprites[`${this.sprite}_${this.animation}`].getGrid().columns;
  }
}

export class NpcDialog extends SpriteEntity {

  constructor(private npc: SpriteEntity) {
    super(new SpritePainter(Sprite.Sprites[`tiles`]));
    this.zIndex = -100;
  }

  quest() {
    this.imageIndex = 2925;
  }

  show() {
    this.imageIndex = 3053;
  }

  hide() {
    this.imageIndex = 0;
  }

  tick(scene: Scene): void | Promise<void> {
    this.x = this.npc.getPos().x + (this.imageIndex === 3053 ? 2 : 0); // only move the dialog bubble, not the quest/other
    this.y = this.npc.getPos().y - 12;
  }
}

export class Npc extends GameEntity {
  private baseImage: NpcImage;
  private hairImage: NpcImage;
  private toolImage: NpcImage;
  private dialogImage: NpcDialog;
  private obtainedItem: boolean = false;
  constructor(scene: Scene, x: number, y: number, private dialog: (string|{options:string[]})[], private postDialog: string[], private requestedItem: number, hair?: string, flip?: boolean) {
    super(new SpritePainter(() => { }, {spriteWidth: 16, spriteHeight: 16}), x, y);
    scene.addEntity(this.baseImage = new NpcImage(this, 'base', 'idle_strip9'));
    scene.addEntity(this.hairImage = new NpcImage(this, hair || 'longhair', 'idle_strip9'));
    scene.addEntity(this.toolImage = new NpcImage(this, 'tools', 'idle_strip9'));
    scene.addEntity(this.dialogImage = new NpcDialog(this));
    this.flipHorizontal = flip || true;
  }

  private imageTimer = 0;
  tick(scene: Scene): void | Promise<void> {

    this.imageTimer++;
    if (this.imageTimer > 10) {
      this.imageIndex++;
      this.imageTimer = 0;
    }

    this.imageIndex %= this.baseImage.spriteFrames();

    this.dialogImage.hide();
    if (this.requestedItem != -1 && !this.obtainedItem) {
      this.dialogImage.quest();
    }
    if (scene.entitiesByType(Cursor)[0].collision(this)) {
      this.dialogImage.show();
    }
  }

  showDialog(scene: Scene) {
    const dialog = this.requestedItem == 5 && scene.entitiesByType(Pot).length === 24 ? compassManAlternateDialog.dialog : this.dialog;
    const postDialog = this.requestedItem == 5 && scene.entitiesByType(Pot).length === 24 ? compassManAlternateDialog.postDialog : this.postDialog;

    if (this.obtainedItem) {
      scene.addEntity(new TextboxEntity(postDialog, this));
    } else {
      scene.addEntity(new TextboxEntity(dialog, this));
    }
    Sound.Sounds['talk'].play();
  }

  giveItem(player: Player) {
    this.obtainedItem = true;
    player.removeItem(this.requestedItem);
  }
}