import { ControllerState, Painter2D, Scene, Sound, Sprite, SpriteEntity, SpritePainter } from "game-engine";
import { engine, loopTrack, scenes, screenHeight, screenWidth } from "./game";
import { Wall } from "./wall";
import { TextboxEntity } from "./textbox";
import { Npc } from "./npc";
import { Interactable } from "./interactable";
import { StatusBar } from "./status-bar";
import { Rock } from "./rock";
import { Inventory } from "./inventory";
import { Grass } from "./grass";
import { Hole } from "./hole";
import { Fire } from "./fire";
import { Bomb } from "./bomb";
import { Explosion } from "./explosion";
import { Arrow } from "./arrow";
import { Sign } from "./sign";

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
  private spawnX = 0;
  private spawnY = 0;

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
  private falling = false;
  private action = false;
  private harp = false;
  private damage = false;
  private actionFunc: () => void;
  private carry = false;
  private carryEntity: Interactable;
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
    this.spawnX = x;
    this.spawnY = y;
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

    if (!canMove) {
      this.baseImage.setAnimation('idle_strip9');
      this.hairImage.setAnimation('idle_strip9');
      this.toolImage.setAnimation('idle_strip9');
    }

    let moving = false;
    this.imageTimer++;
    if (this.falling) {
      this.imageTimer += 4;
    }
    if (this.jumping || this.action) {
      if (this.harp) {
        this.imageTimer -= 0.5;
      } else {
        if (this.imageIndex < 3 || this.imageIndex > 7) {
          this.imageTimer += 4;
        } else {
          this.imageTimer += 2;
        }
      }

      if (this.action && this.imageIndex == 5) {
        if (this.actionFunc) {
          this.actionFunc();
        }
        this.actionFunc = undefined;
      }

    }
    if (this.imageTimer > 10) {
      this.imageIndex++;
      this.imageTimer = 0;
    }
    if (canMove) {
      const collisionEntities = [...scene.entitiesByType(Wall), ...scene.entitiesByType(Npc), ...scene.entitiesByType(Interactable)];

      //for (let i = 0; i < (scene.isControl('sprint', ControllerState.Held) ? 2 : 1); i++) {
      if (scene.isControl('left', ControllerState.Held) && !this.action && !this.falling) {
          this.x--;
          this.flipHorizontal = true;
          moving = true;
          if (collisionEntities.some(wall => wall.collision(this))) {
            this.x++;
          }
          this.lookDirection = Math.PI;
      }
      if (scene.isControl('right', ControllerState.Held) && !this.action && !this.falling) {
        this.x++;
        this.flipHorizontal = false;
        moving = true;
        if (collisionEntities.some(wall => wall.collision(this))) {
          this.x--;
        }
        this.lookDirection = 0;
      }
      if (scene.isControl('up', ControllerState.Held) && !this.action && !this.falling) {
        this.y--;
        moving = true;
        if (collisionEntities.some(wall => wall.collision(this))) {
          this.y++;
        }
        this.lookDirection = 3 * Math.PI / 2;
      }
      if (scene.isControl('down', ControllerState.Held) && !this.action && !this.falling) {
        this.y++;
        moving = true;
        if (collisionEntities.some(wall => wall.collision(this))) {
          this.y--;
        }
        this.lookDirection = Math.PI / 2;
      }
      //}

      // Do actions
      let dialog = false;
      const actionNpc = [...scene.entitiesByType(Npc), ...scene.entitiesByType(Sign)].filter(npc => npc.collision(this.crosshair))[0];
      if (scene.isControl('action1', ControllerState.Press) && actionNpc) {
        actionNpc.showDialog(scene);
        dialog = true;
      }

      if (!dialog) {
        const actionInterractable = scene.entitiesByType(Interactable).filter(interractable => interractable.collision(this.crosshair))[0];
        let useItem = -1;
        if (scene.isControl('action1', ControllerState.Press)) {
          useItem = this.getItem1();
        }
        if (scene.isControl('action2', ControllerState.Press)) {
          useItem = this.getItem2();
        }

        if (!this.carry && useItem == 0) { // shovel
          this.actionFunc = () => {
            if (actionInterractable instanceof Rock) {
              scene.removeEntity(actionInterractable);
            }

            Sound.Sounds['dig'].play();
          }
          this.action = true;
          this.imageIndex = 0;
          this.imageTimer = 0;
          this.baseImage.setAnimation('dig_strip13');
          this.hairImage.setAnimation('dig_strip13');
          this.toolImage.setAnimation('dig_strip13');
        }

        if (!this.carry && useItem == 1) { // sword
          this.actionFunc = () => {
            if (actionInterractable instanceof Grass) {
              scene.removeEntity(actionInterractable);
            }
            Sound.Sounds['slash'].play();
          }
          this.action = true;
          this.imageIndex = 0;
          this.imageTimer = 0;
          this.baseImage.setAnimation('attack_strip10');
          this.hairImage.setAnimation('attack_strip10');
          this.toolImage.setAnimation('attack_strip10');
        }

        if (!this.carry && useItem == 2) { // lamp
          this.actionFunc = () => {
            scene.addEntity(new Fire(this.crosshair.getPos().x, this.crosshair.getPos().y));
            Sound.Sounds['dig'].play();
          }
          this.action = true;
          this.imageIndex = 0;
          this.imageTimer = 0;
          this.baseImage.setAnimation('doing_strip8');
          this.hairImage.setAnimation('doing_strip8');
          this.toolImage.setAnimation('doing_strip8');
        }

        if (!this.carry && useItem == 3 && scene.entitiesByType(Arrow).length == 0) { // bow
          Sound.setVolume(0.4);
          Sound.Sounds['bow'].play();
          Sound.setVolume(0.1);
          scene.addEntity(new Arrow(this.crosshair.getPos().x - 4, this.crosshair.getPos().y - 4, this.lookDirection));
        }

        if (!this.carry && useItem == 4 && !this.jumping) { // feather
          Sound.Sounds['jump'].play();
          this.jumping = true;
          this.imageIndex = 0;
          this.imageTimer = 0;
          this.baseImage.setAnimation('jump_strip9');
          this.hairImage.setAnimation('jump_strip9');
          this.toolImage.setAnimation('jump_strip9');
        }

        if (!this.carry && useItem == 5) { // compass
          scene.addEntity(new TextboxEntity([`Current Coordinates\n${Math.abs(this.worldCoordsX)}º ${this.worldCoordsX >= 0 ? 'East' : 'West'}, ${Math.abs(this.worldCoordsY)}º ${this.worldCoordsY >= 0 ? 'North': 'South'}`]));
        }

        if (useItem == 6) { // glove
          if (!this.carry) { // pickup
            if (actionInterractable instanceof Grass) {
              this.actionFunc = () => {
                if (actionInterractable) {
                  this.carry = true;
                  this.carryEntity = actionInterractable;
                  actionInterractable.setCarriedBy(this);
                  scene.removeEntity(actionInterractable);
                }
                Sound.Sounds['slash'].play();
              }
              this.action = true;
              this.imageIndex = 0;
              this.imageTimer = 0;
              this.baseImage.setAnimation('doing_strip8');
              this.hairImage.setAnimation('doing_strip8');
              this.toolImage.setAnimation('doing_strip8');
            }
          } else { // throw
            this.carry = false;
            this.carryEntity.throw(this.lookDirection);
            this.carryEntity = undefined;
          }
          
        }

        if (!this.carry && useItem == 7) { // mirror
          this.worldCoordsX = 0;
          this.worldCoordsY = 0;
          this.x = 32;
          this.y = 48;
          this.spawnX = this.x;
          this.spawnY = this.y;
          const nextScene = scenes.getScene(this.worldCoordsX, this.worldCoordsY);
          if (nextScene) {
            engine.switchToScene(nextScene.scene);
            engine.addEntity(nextScene.scene, this);
            engine.addEntity(nextScene.scene, this.baseImage);
            engine.addEntity(nextScene.scene, this.hairImage);
            engine.addEntity(nextScene.scene, this.toolImage);
            engine.addEntity(nextScene.scene, this.crosshair);
            engine.addEntity(nextScene.scene, this.statusBar);
          }
        }

        if (!this.carry && useItem == 8) { // harp
          Sound.setVolume(0.2);
          Sound.Sounds['harp'].play();
          Sound.setVolume(0.1);
          loopTrack.track.stop();
          loopTrack.track = {stop: () => {}};
          this.action = true;
          this.harp = true;
          this.imageIndex = 0;
          this.imageTimer = 0;
          this.baseImage.setAnimation('doing_strip8');
          this.hairImage.setAnimation('doing_strip8');
          this.toolImage.setAnimation('doing_strip8');
        }

        if (!this.carry && useItem == 9 && scene.entitiesByType(Bomb).length == 0) { // bomb
          Sound.Sounds['dig'].play();
          scene.addEntity(new Bomb(this.crosshair.getPos().x - 4, this.crosshair.getPos().y - 4));
        }
      }
      
      // Stop animations
      if (this.jumping && this.imageIndex == this.baseImage.spriteFrames()) {
        this.jumping = false;
      }

      if (this.action && this.imageIndex == this.baseImage.spriteFrames()) {
        this.action = false;
        if (this.harp) {
          // restart the loop
          loopTrack.track = Sound.Sounds['dayloop'].play();
        }
        this.harp = false;
      }

      if (this.damage && this.imageIndex == this.baseImage.spriteFrames()) {
        this.damage = false;
      }

      if (this.falling) {
        this.scaleX -= 0.1;
        this.scaleY -= 0.1;
      }
      if (this.falling && this.imageIndex == this.baseImage.spriteFrames()) {
        this.falling = false;
        this.x = this.spawnX;
        this.y = this.spawnY;
        this.scaleX = 1;
        this.scaleY = 1;
        Sound.Sounds['hurt'].play();
        this.action = true;
        this.baseImage.setAnimation('hurt_strip8');
        this.hairImage.setAnimation('hurt_strip8');
        this.toolImage.setAnimation('hurt_strip8');
      }
    }

    if (!moving && !this.jumping && !this.action && !this.falling && !this.carry) {
      this.transitionTimer = 0;
      this.baseImage.setAnimation('idle_strip9');
      this.hairImage.setAnimation('idle_strip9');
      this.toolImage.setAnimation('idle_strip9');
    }

    if (moving && !this.jumping && !this.action && !this.falling && !this.carry) {
      this.baseImage.setAnimation('walk_strip8');
      this.hairImage.setAnimation('walk_strip8');
      this.toolImage.setAnimation('walk_strip8');
    }

    if (this.carry) {
      this.baseImage.setAnimation('carry_strip8');
      this.hairImage.setAnimation('carry_strip8');
      this.toolImage.setAnimation('carry_strip8');
      if (this.carryEntity) {
        scene.addEntity(this.carryEntity);
      }
    }

    // scene transition
    let transition = false;
    if (this.x + this.painter.rectangle().width - Player.xOffset > screenWidth) {
      this.transitionTimer++;
      this.x = screenWidth - this.painter.rectangle().width + Player.xOffset;
      if (this.transitionTimer >= 10 && scenes.getScene(this.worldCoordsX + 1, this.worldCoordsY)) {
        this.worldCoordsX++;
        transition = true;
        this.x = 0;
        this.transitionTimer = 0;
        this.spawnX = this.x;
        this.spawnY = this.y;
      }
    }

    if (this.x - Player.xOffset < 0) {
      this.transitionTimer++;
      this.x = Player.xOffset;
      if (this.transitionTimer >= 10 && scenes.getScene(this.worldCoordsX - 1, this.worldCoordsY)) {
        this.worldCoordsX--;
        transition = true;
        this.x = screenWidth - this.painter.rectangle().width + Player.xOffset;
        this.transitionTimer = 0;
        this.spawnX = this.x;
        this.spawnY = this.y;
      }
    }

    if (this.y + this.painter.rectangle().height - Player.yOffset > screenHeight) {
      this.transitionTimer++;
      this.y = screenHeight - this.painter.rectangle().height + Player.yOffset;
      if (this.transitionTimer >= 10 && scenes.getScene(this.worldCoordsX, this.worldCoordsY + 1)) {
        this.worldCoordsY++;
        transition = true;
        this.y = 16;
        this.transitionTimer = 0;
        this.spawnX = this.x;
        this.spawnY = this.y;
      }
    }

    if (this.y < 16) {
      this.transitionTimer++;
      this.y = 16;
      if (this.transitionTimer >= 10 && scenes.getScene(this.worldCoordsX, this.worldCoordsY - 1)) {
        this.worldCoordsY--;
        transition = true;
        this.y = screenHeight - this.painter.rectangle().height + Player.yOffset;
        this.transitionTimer = 0;
        this.spawnX = this.x;
        this.spawnY = this.y;
      }
    }

    if (transition) {
      const nextScene = scenes.getScene(this.worldCoordsX, this.worldCoordsY);
      if (nextScene) {
        engine.switchToScene(nextScene.scene);
        engine.addEntity(nextScene.scene, this);
        engine.addEntity(nextScene.scene, this.baseImage);
        engine.addEntity(nextScene.scene, this.hairImage);
        engine.addEntity(nextScene.scene, this.toolImage);
        engine.addEntity(nextScene.scene, this.crosshair);
        engine.addEntity(nextScene.scene, this.statusBar);
      }
    }

    if (engine.sceneKey(scene) != 'pause' && scene.isControl('pause', ControllerState.Press)) {
      engine.addEntity('pause', this);
      engine.addEntity('pause', this.statusBar);
      engine.addEntity('pause', this.inventory);
      engine.switchToScene('pause');
      Sound.Sounds['pause'].play();
    }

    if (!this.jumping && ! this.falling) {
      const holes = scene.entitiesByType(Hole);
      holes.forEach(hole => {
        if (hole.collision(this)) {
          const direction = this.direction(hole);
          this.x += Math.cos(direction) * 2;
          this.y += Math.sin(direction) * 2;

          this.x = Math.round(this.x);
          this.y = Math.round(this.y);
          const difX = this.x - hole.getPos().x;
          const difY = this.y - hole.getPos().y;

          if (Math.sqrt(difX * difX + difY * difY) < 3) {
            this.falling = true;
            Sound.Sounds['fall'].play();
            this.imageIndex = 0;
            this.imageTimer = 0;
            this.baseImage.setAnimation('roll_strip10');
            this.hairImage.setAnimation('roll_strip10');
            this.toolImage.setAnimation('roll_strip10');
            this.x = hole.getPos().x;
            this.y = hole.getPos().y;
          }
        }
      });

      if (!this.jumping && !this.damage) {
        const explosions = scene.entitiesByType(Explosion);
        explosions.forEach(explosion => {
          if (explosion.collision(this)) {
            Sound.Sounds['hurt'].play();
            this.action = true;
            this.damage = true;
            this.baseImage.setAnimation('hurt_strip8');
            this.hairImage.setAnimation('hurt_strip8');
            this.toolImage.setAnimation('hurt_strip8');
            const dir = explosion.direction(this);
            const collisionEntities = [...scene.entitiesByType(Wall), ...scene.entitiesByType(Npc), ...scene.entitiesByType(Interactable)];
            for (let i = 0; i < 8; i++) {
              this.x += Math.cos(dir);
              if (collisionEntities.some(entity => entity.collision(this))) {
                this.x -= Math.cos(dir);
              }
              this.y += Math.sin(dir);
              if (collisionEntities.some(entity => entity.collision(this))) {
                this.y -= Math.sin(dir);
              }
            }
          }
        })
      }
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