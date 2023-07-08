import { ControllerState, Painter2D, Scene, Sound, Sprite, SpriteEntity, SpritePainter } from "game-engine";
import { engine, scenes, screenHeight, screenWidth } from "./game";
import { Wall } from "./wall";
import { TextboxEntity } from "./textbox";
import { Npc } from "./npc";
import { Interactable } from "./interactable";
import { StatusBar } from "./status-bar";
import { Rock } from "./rock";
import { Inventory } from "./inventory";
import { Grass } from "./grass";

export class PlayerImage extends SpriteEntity {
  constructor(private player: Player, private sprite: string, private animation: string) {
    super(new SpritePainter(Sprite.Sprites[`${sprite}_${animation}`]));
  }

  tick(scene: Scene): void | Promise<void> {
    this.x = this.player.getPos().x;
    this.y = this.player.getPos().y - 1;
    this.imageIndex = this.player.imageIndex;
    this.y -= this.player.isJumping() ? (5 - Math.abs(5 - this.imageIndex)) * 2 : 0;
    this.flipHorizontal = this.player.flipHorizontal;
  }

  setAnimation(animation: string) {
    this.animation = animation;
    (this.painter as SpritePainter).setSprite(Sprite.Sprites[`${this.sprite}_${this.animation}`]);
  }

  spriteFrames() {
    return Sprite.Sprites[`${this.sprite}_${this.animation}`].getGrid().columns;
  }
}

export class Cursor extends SpriteEntity {
  constructor(private player: Player) {
    super(new SpritePainter(Sprite.Sprites['crosshair'], {spriteWidth: 8, spriteHeight: 8, spriteOffsetX: 4, spriteOffsetY: 4}));
  }

  tick(scene: Scene): void | Promise<void> {
    this.x = this.player.getPos().x + 3 + 16 * Math.cos(this.player.lookDirection);
    this.y = this.player.getPos().y + 3 + 16 * Math.sin(this.player.lookDirection);
  }
}

export class Player extends SpriteEntity {
  private pause: boolean;
  private worldCoordsX = 0;
  private worldCoordsY = 0;

  private baseImage: PlayerImage;
  private hairImage: PlayerImage;
  private toolImage: PlayerImage;
  private crosshair: Cursor;
  private statusBar: StatusBar;
  private inventory: Inventory;
  static xOffset = -4;
  static yOffset = -7;

  public lookDirection: number = 0;
  private item1: number = -1;
  private item2: number = -1;
  private jumping = false;
  constructor(scene: Scene, x: number, y: number) {
    super(new SpritePainter(() => { }, { spriteWidth: 10, spriteHeight: 6, spriteOffsetX: Player.xOffset, spriteOffsetY: Player.yOffset }), x, y);
    scene.addEntity(this.baseImage = new PlayerImage(this, 'base', 'idle_strip9'));
    scene.addEntity(this.hairImage = new PlayerImage(this, 'bowlhair', 'idle_strip9'));
    scene.addEntity(this.toolImage = new PlayerImage(this, 'tools', 'idle_strip9'));
    scene.addEntity(this.crosshair = new Cursor(this));
    scene.addEntity(this.statusBar = new StatusBar(this));
    this.inventory = new Inventory(this);
    this.item1 = 0;
    this.item2 = 1;
  }

  getItem1() {
    return this.item1;
  }

  getItem2() {
    return this.item2;
  }

  setItem1(item: number) {
    this.item1 = item;
  }

  setItem2(item: number) {
    this.item2 = item;
  }

  getWorldCoords(): {x: number, y: number} {
    return {x: this.worldCoordsX, y: this.worldCoordsY};
  }

  isJumping() {
    return this.jumping;
  }

  private transitionTimer = 0;
  private imageTimer = 0;
  tick(scene: Scene): Promise<void> | void {
    if (this.pause) {
      return;
    }

    if (engine.sceneKey(scene) == 'pause') {
      return;
    }

    const canMove = scene.entitiesByType(TextboxEntity).length == 0;

    let moving = false;
    this.imageTimer++;
    if (this.jumping) {
      if (this.imageIndex < 3 || this.imageIndex > 7) {
        this.imageTimer += 4;
      } else {
        this.imageTimer += 2;
      }
    }
    if (this.imageTimer > 10) {
      this.imageIndex++;
      this.imageTimer = 0;
    }
    if (canMove) {
      const collisionEntities = [...scene.entitiesByType(Wall), ...scene.entitiesByType(Npc), ...scene.entitiesByType(Interactable)];
      if (scene.isControl('left', ControllerState.Held)) {
        this.x--;
        this.flipHorizontal = true;
        moving = true;
        if (collisionEntities.some(wall => wall.collision(this))) {
          this.x++;
        }
        this.lookDirection = Math.PI;
      }
      if (scene.isControl('right', ControllerState.Held)) {
        this.x++;
        this.flipHorizontal = false;
        moving = true;
        if (collisionEntities.some(wall => wall.collision(this))) {
          this.x--;
        }
        this.lookDirection = 0;
      }
      if (scene.isControl('up', ControllerState.Held)) {
        this.y--;
        moving = true;
        if (collisionEntities.some(wall => wall.collision(this))) {
          this.y++;
        }
        this.lookDirection = 3 * Math.PI / 2;
      }
      if (scene.isControl('down', ControllerState.Held)) {
        this.y++;
        moving = true;
        if (collisionEntities.some(wall => wall.collision(this))) {
          this.y--;
        }
        this.lookDirection = Math.PI / 2;
      }

      const actionNpc = scene.entitiesByType(Npc).filter(npc => npc.collision(this.crosshair))[0];
      if (scene.isControl('action1', ControllerState.Press) && actionNpc) {
        actionNpc.showDialog(scene);
      }

      const actionInterractable = scene.entitiesByType(Interactable).filter(interractable => interractable.collision(this.crosshair))[0];
      let useItem = -1;
      if (scene.isControl('action1', ControllerState.Press)) {
        useItem = this.getItem1();
      }
      if (scene.isControl('action2', ControllerState.Press)) {
        useItem = this.getItem2();
      }

      if (actionInterractable instanceof Rock && useItem == 0) {
        scene.removeEntity(actionInterractable);
        Sound.Sounds['dig'].play();
      }
      if (actionInterractable instanceof Grass && useItem == 1) {
        scene.removeEntity(actionInterractable);
        Sound.Sounds['slash'].play();
      }

      if (this.jumping && this.imageIndex == this.baseImage.spriteFrames()) {
        this.jumping = false;
      }

      if (useItem == 4 && !this.jumping) {
        Sound.Sounds['jump'].play();
        this.baseImage.setAnimation('jump_strip9');
        this.hairImage.setAnimation('jump_strip9');
        this.toolImage.setAnimation('jump_strip9');
        this.jumping = true;
        this.imageIndex = 0;
        this.imageTimer = 0;
      }
    }

    if (!moving && !this.jumping) {
      this.transitionTimer = 0;
      this.baseImage.setAnimation('idle_strip9');
      this.hairImage.setAnimation('idle_strip9');
      this.toolImage.setAnimation('idle_strip9');
    } else if (!this.jumping) {
      this.baseImage.setAnimation('walk_strip8');
      this.hairImage.setAnimation('walk_strip8');
      this.toolImage.setAnimation('walk_strip8');
    }

    let transition = false;
    if (this.x + this.painter.rectangle().width - Player.xOffset > screenWidth) {
      this.transitionTimer++;
      this.x = screenWidth - this.painter.rectangle().width + Player.xOffset;
      if (this.transitionTimer >= 10) {
        this.worldCoordsX++;
        transition = true;
        this.x = 0;
        this.transitionTimer = 0;
      }
    }

    if (this.x - Player.xOffset < 0) {
      this.transitionTimer++;
      this.x = Player.xOffset;
      if (this.transitionTimer >= 10) {
        this.worldCoordsX--;
        transition = true;
        this.x = screenWidth - this.painter.rectangle().width + Player.xOffset;
        this.transitionTimer = 0;
      }
    }

    if (this.y + this.painter.rectangle().height - Player.yOffset > screenHeight) {
      this.transitionTimer++;
      this.y = screenHeight - this.painter.rectangle().height + Player.yOffset;
      if (this.transitionTimer >= 10) {
        this.worldCoordsY++;
        transition = true;
        this.y = 16;
        this.transitionTimer = 0;
      }
    }

    if (this.y < 16) {
      this.transitionTimer++;
      this.y = 16;
      if (this.transitionTimer >= 10) {
        this.worldCoordsY--;
        transition = true;
        this.y = screenHeight - this.painter.rectangle().height + Player.yOffset;
        this.transitionTimer = 0;
      }
    }

    if (transition) {
      const nextScene = scenes.getScene(this.worldCoordsX, this.worldCoordsY);
      engine.switchToScene(nextScene.scene);
      engine.addEntity(nextScene.scene, this);
      engine.addEntity(nextScene.scene, this.baseImage);
      engine.addEntity(nextScene.scene, this.hairImage);
      engine.addEntity(nextScene.scene, this.toolImage);
      engine.addEntity(nextScene.scene, this.crosshair);
      engine.addEntity(nextScene.scene, this.statusBar);
    }

    if (engine.sceneKey(scene) != 'pause' && scene.isControl('pause', ControllerState.Press)) {
      engine.addEntity('pause', this);
      engine.addEntity('pause', this.statusBar);
      engine.addEntity('pause', this.inventory);
      engine.switchToScene('pause');
      Sound.Sounds['pause'].play();
    }

    this.imageIndex %= this.baseImage.spriteFrames();
  }

  removeItem(item: number) {
    if (this.item1 == item) {
      this.item1 = -1;
    }
    if (this.item2 == item) {
      this.item2 = -1;
    }
    this.inventory.removeItem(item);
  }
}