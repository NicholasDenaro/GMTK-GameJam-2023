import { ControllerState, Painter2D, Scene, Sound, Sprite, SpriteEntity, SpritePainter } from "game-engine";
import { FPS, engine, statefulMode, loopTrack, scenes, screenHeight, screenWidth, stopwatch, changeLoop, stopLoop, restartLoop, screenTransition, transitionSlide, playTrackForScene, transitionFade, win, buildMap } from "./game";
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
import { Pot } from "./pot";
import { Door } from "./door";
import { Stairs } from "./stairs";
import { HeavyRock } from "./heavy-rocky";
import { Portal } from "./portal";
import { Grave, Skeleton } from "./grave";
import { PermaFire } from "./perma-fire";
import { GameEntity } from "./game-entity";
import { TiledBackground } from "./tiled-background";
import { cutscene } from "./cutscene";

export class PlayerImage extends SpriteEntity {
  constructor(private player: Player, private sprite: string, private animation: string) {
    super(new SpritePainter(Sprite.Sprites[`${sprite}_${animation}`]));
    this.zIndex = -2;
  }

  tick(scene: Scene): void | Promise<void> {
    this.x = this.player.getPos().x + 2;
    this.y = this.player.getPos().y - 5;
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


export class PlayerShadow extends SpriteEntity {
  constructor(private player: Player) {
    super(new SpritePainter(Sprite.Sprites[`shadow`]));
    this.zIndex = -1;
  }

  tick(scene: Scene): void | Promise<void> {
    this.x = this.player.getPos().x + 2;
    this.y = this.player.getPos().y - 5;
  }
}

export class Cursor extends SpriteEntity {
  constructor(private player: Player) {
    super(new SpritePainter(Sprite.Sprites['crosshair'], { spriteWidth: 8, spriteHeight: 8, spriteOffsetX: -4, spriteOffsetY: -4 }));
    this.zIndex = -900;
  }

  tick(scene: Scene): void | Promise<void> {
    this.x = this.player.getPos().x + 4 + 16 * Math.cos(this.player.lookDirection);
    this.y = this.player.getPos().y + 4 + 12 * Math.sin(this.player.lookDirection);
    if (this.player.lookDirection == 0 || this.player.lookDirection == Math.PI) {
      this.y += 2;
    }
  }
}

export class Player extends GameEntity {
  public showTalkIcon = false;
  private pause: boolean;
  public lastScene = '';
  private worldCoordsX = 0;
  private worldCoordsY = 0;
  private spawnX = 0;
  private spawnY = 0;

  private shadow: PlayerShadow;
  private baseImage: PlayerImage;
  private hairImage: PlayerImage;
  private toolImage: PlayerImage;
  private crosshair: Cursor;
  private statusBar: StatusBar;
  private inventory: Inventory;
  static xOffset = -4;
  static yOffset = -7;

  public lookDirection: number = 3 * Math.PI / 2;
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
    scene.addEntity(this.shadow = new PlayerShadow(this));
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
    this.zIndex = -1;
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

  respawn() {
    this.x = this.spawnX;
    this.y = this.spawnY;
    this.transitionTimer = 0;
  }

  private transitionTimer = 0;
  private imageTimer = 0;
  private shownEndingText = false;
  private ticks = 0;
  tick(scene: Scene): Promise<void> | void {
    if (screenTransition.active || cutscene.active) {
      return;
    }

    this.ticks++;
    if (scene.isControl('restart', ControllerState.Press) && engine.sceneKey(scene) != 'pause') {
      scene.addEntity(new TextboxEntity(['Go back to main menu?', {options: ['No', 'Yes']}], undefined, () => {
        engine.switchToScene('main_menu');
        playTrackForScene('0,0');
      }));
    }
    if (this.pause) {
      return;
    }

    if (engine.sceneKey(scene) == 'pause') {
      this.showTalkIcon = false;
      return;
    }

    if (scene.entitiesByType(PlayerShadow).length == 0) {
      const sceneKey = engine.sceneKey(scene);
      engine.addEntity(sceneKey, this.shadow);
      engine.addEntity(sceneKey, this.baseImage);
      engine.addEntity(sceneKey, this.hairImage);
      engine.addEntity(sceneKey, this.toolImage);
      engine.addEntity(sceneKey, this.crosshair);
      engine.addEntity(sceneKey, this.statusBar);
    }

    const canMove = scene.entitiesByType(TextboxEntity).length == 0;

    if (!canMove) {
      this.baseImage.setAnimation('idle_strip9');
      this.hairImage.setAnimation('idle_strip9');
      this.toolImage.setAnimation('idle_strip9');
    }

    if (canMove && this.getItem1() == -1 && this.getItem2() == -1 && this.inventory.isEmpty()) {
      if (!this.shownEndingText) {
        win.active = true;
        stopwatch.end = Date.now();
        const milis = (stopwatch.end - stopwatch.start) % 1000;
        const seconds = Math.floor((stopwatch.end - stopwatch.start) / 1000) % 60;
        const minutes = Math.floor((stopwatch.end - stopwatch.start) / 1000 / 60) % 60;
        const hours = Math.floor((stopwatch.end - stopwatch.start) / 1000 / 60 / 60);

        const tmilis = Math.floor(((this.ticks % FPS) / FPS) * 1000);
        const tseconds = Math.floor(this.ticks / FPS) % 60;
        const tminutes = Math.floor(this.ticks / FPS / 60) % 60;
        const thours = Math.floor(this.ticks / FPS / 60 / 60);
        scene.addEntity(new TextboxEntity([
          `Congratulations on giving\naway all your items!`,
          `Your time was:${statefulMode.enabled ? '\neasy' : ''}\n${hours > 0 ? hours : '00'}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}.${milis < 100 ? '0' : ''}${milis < 10 ? '0' : ''}${milis}`,
          `Your time in ticks was:\n${statefulMode.enabled ? 'easy ' : ''}${this.ticks}\n${thours > 0 ? thours : '00'}:${tminutes < 10 ? '0' : ''}${tminutes}:${tseconds < 10 ? '0' : ''}${tseconds}.${tmilis < 100 ? '0' : ''}${tmilis < 10 ? '0' : ''}${tmilis}`
        ]));
        this.shownEndingText = true;
      } else {
        this.x = -100;
        this.y = -100;
        engine.switchToScene('credits');
        playTrackForScene('0,0');
      }
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
    let usedMirror = false;
    if (canMove) {
      const collisionEntities = [...scene.entitiesByType(Wall), ...scene.entitiesByType(Npc), ...scene.entitiesByType(Interactable)]
        .filter(entity => {
          if (entity instanceof Portal) {
            return false;
          }
          if (entity instanceof Bomb) {
            return false;
          }
          if (entity instanceof Stairs) {
            return !entity.isActivated();
          }
          return true;
        }
      );

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
      const actionNpcs = [...scene.entitiesByType(Npc), ...scene.entitiesByType(Sign), ...scene.entitiesByType(Skeleton)].filter(npc => npc.collision(this.crosshair));
      const actionNpc = actionNpcs[0];
      if (actionNpcs.length > 0) {
        this.showTalkIcon = true;
      } else {
        this.showTalkIcon = false;
      }
      if (scene.isControl('action1', ControllerState.Press) && actionNpc && !this.jumping && !this.falling) {
        actionNpc.showDialog(scene);
        dialog = true;
      }

      if (!dialog) {
        const actionInterractables = scene.entitiesByType(Interactable).filter(interractable => interractable.collision(this.crosshair));
        const actionInterractable = actionInterractables[0];
        let useItem = -1;
        if (scene.isControl('action1', ControllerState.Press)) {
          useItem = this.getItem1();
        }
        if (scene.isControl('action2', ControllerState.Press)) {
          useItem = this.getItem2();
        }

        if (!this.carry && useItem == 0) { // shovel
          const shovelable = actionInterractables.filter(ais => ais instanceof Rock || ais instanceof Grass || ais instanceof Grave)[0]
          this.actionFunc = () => {
            if (shovelable instanceof Rock || shovelable instanceof Grass) {
              scene.removeEntity(shovelable);
            }
            if (shovelable instanceof Grave) {
              shovelable.dig(scene);
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
            actionInterractables.forEach(interactable => {
              if (interactable instanceof Grass || interactable instanceof Pot) {
                scene.removeEntity(interactable);
                if (interactable instanceof Pot) {
                  Sound.Sounds['smash_pot'].play();
                }
                if (interactable instanceof Grass) {
                  Sound.Sounds['cut_grass'].play();
                }
              }
            })
            
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
            Sound.Sounds['fire'].play();
          }
          if (actionInterractable instanceof PermaFire) {
            actionInterractable.light(scene);
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
          scene.addEntity(new Arrow(scene, this.crosshair.getPos().x - Math.cos(this.lookDirection) * 3, this.crosshair.getPos().y + 1 - Math.sin(this.lookDirection) * 3, this.lookDirection));
        }

        if (!this.carry && useItem == 4 && !this.jumping && !this.falling) { // feather
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
            const pickupable = actionInterractables.filter(ais => ais instanceof Grass || ais instanceof Pot || ais instanceof HeavyRock)[0]
            if (pickupable instanceof Grass || pickupable instanceof Pot || pickupable instanceof HeavyRock) {
              this.actionFunc = () => {
                if (pickupable) {
                  this.carry = true;
                  this.carryEntity = pickupable;
                  pickupable.setCarriedBy(this);
                  scene.removeEntity(pickupable);
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
          } else if (moving) { // throw
            this.carry = false;
            this.carryEntity.throw(this.lookDirection);
            this.carryEntity = undefined;
          } else { // drop
            this.carry = false;
            this.carryEntity.drop(this.crosshair.getPos().x - 3, this.crosshair.getPos().y - 2);
            this.carryEntity = undefined;
          }
        }

        if (!this.carry && useItem == 7) { // mirror
          usedMirror = true;
          const wasInOrigin = this.worldCoordsX ==0 && this.worldCoordsY == 0;
          this.worldCoordsX = 0;
          this.worldCoordsY = 0;
          this.x = 64;
          this.y = 64;
          this.spawnX = this.x;
          this.spawnY = this.y;
          const nextScene = scenes.getScene(this.worldCoordsX, this.worldCoordsY);
          if (!wasInOrigin && nextScene) {
            engine.switchToScene(nextScene.sceneKey);
            nextScene.resetter.reset();
            engine.addEntity(nextScene.sceneKey, this);
            engine.removeEntity(nextScene.sceneKey, this.shadow);
            engine.removeEntity(nextScene.sceneKey, this.baseImage);
            engine.removeEntity(nextScene.sceneKey, this.hairImage);
            engine.removeEntity(nextScene.sceneKey, this.toolImage);
            engine.removeEntity(nextScene.sceneKey, this.crosshair);
            engine.removeEntity(nextScene.sceneKey, this.statusBar);
            engine.addEntity(nextScene.sceneKey, this.shadow);
            engine.addEntity(nextScene.sceneKey, this.baseImage);
            engine.addEntity(nextScene.sceneKey, this.hairImage);
            engine.addEntity(nextScene.sceneKey, this.toolImage);
            engine.addEntity(nextScene.sceneKey, this.crosshair);
            engine.addEntity(nextScene.sceneKey, this.statusBar);
            nextScene.scene.entitiesByType(TiledBackground).forEach(bg => bg.resetPosition(this.worldCoordsX, this.worldCoordsY));

            playTrackForScene(nextScene.sceneKey);
          }
          transitionFade(scene, nextScene.scene);
        }

        if (!this.carry && useItem == 8) { // harp
          Sound.setVolume(0.2);
          Sound.Sounds['harp'].play();
          Sound.setVolume(0.1);
          stopLoop();
          this.action = true;
          this.actionFunc = () => {
            const portals = scene.entitiesByType(Portal);
            portals.forEach(portal => portal.activate());
          }
          this.harp = true;
          this.imageIndex = 0;
          this.imageTimer = 0;
          this.baseImage.setAnimation('doing_strip8');
          this.hairImage.setAnimation('doing_strip8');
          this.toolImage.setAnimation('doing_strip8');
        }

        if (useItem == 9) { // bomb
          if (!this.carry && scene.entitiesByType(Bomb).length == 0) {
            const bomb = new Bomb(this.crosshair.getPos().x - 4, this.crosshair.getPos().y - 4);
            scene.addEntity(bomb);
            this.carry = true;
            this.carryEntity = bomb;
            bomb.setCarriedBy(this);
          } else if (this.carry && this.carryEntity instanceof Bomb) {
            if (moving) {
              this.carryEntity.throw(this.lookDirection);
            } else {
              this.carryEntity.drop(this.crosshair.getPos().x - 3, this.crosshair.getPos().y - 2);
            }
            this.carry = false;
          }
        }
      }
      
      // Stop animations
      if (this.jumping && this.imageIndex == this.baseImage.spriteFrames()) {
        this.jumping = false;
      }

      if (this.action && this.imageIndex == this.baseImage.spriteFrames()) {
        this.action = false;
        if (this.harp) {
          restartLoop();
          const portals = scene.entitiesByType(Portal);
          if (portals.length == 0) {
            scene.addEntity(new TextboxEntity(['Your tune echos in vain.']));
          }
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
    if (!transition && this.x + this.painter.rectangle().width - Player.xOffset > screenWidth) {
      this.transitionTimer++;
      this.x = screenWidth - this.painter.rectangle().width + Player.xOffset;
      if (this.transitionTimer >= 10 && scenes.getScene(this.worldCoordsX + 1, this.worldCoordsY) && !this.carry) {
        transition = true;
        this.worldCoordsX++;
        this.spawnX = 0;
        this.spawnY = this.y;
        this.transitionTimer = 0;
        transitionSlide(scene, scenes.getScene(this.worldCoordsX, this.worldCoordsY).scene, Math.PI, this.worldCoordsX - 1, this.worldCoordsY);
      }
    }

    if (!transition && this.x - Player.xOffset < 0) {
      this.transitionTimer++;
      this.x = Player.xOffset;
      if (this.transitionTimer >= 10 && scenes.getScene(this.worldCoordsX - 1, this.worldCoordsY) && !this.carry) {
        transition = true;
        this.worldCoordsX--;
        this.spawnX = screenWidth - this.painter.rectangle().width + Player.xOffset;
        this.spawnY = this.y;
        this.transitionTimer = 0;
        transitionSlide(scene, scenes.getScene(this.worldCoordsX, this.worldCoordsY).scene, 0, this.worldCoordsX + 1, this.worldCoordsY);
      }
    }

    if (!transition && this.y + this.painter.rectangle().height - Player.yOffset > screenHeight) {
      this.transitionTimer++;
      this.y = screenHeight - this.painter.rectangle().height + Player.yOffset;
      if (this.transitionTimer >= 10 && scenes.getScene(this.worldCoordsX, this.worldCoordsY + 1) && !this.carry) {
        this.worldCoordsY++;
        transition = true;
        this.spawnX = this.x;
        this.spawnY = 16;
        this.transitionTimer = 0;
        transitionSlide(scene, scenes.getScene(this.worldCoordsX, this.worldCoordsY).scene, 3 * Math.PI / 2, this.worldCoordsX, this.worldCoordsY - 1);
      }
    }

    if (!transition && this.y < 16) {
      this.transitionTimer++;
      this.y = 16;
      if (this.transitionTimer >= 10 && scenes.getScene(this.worldCoordsX, this.worldCoordsY - 1) && !this.carry) {
        this.worldCoordsY--;
        transition = true;
        this.spawnX = this.x;
        this.spawnY = screenHeight - this.painter.rectangle().height + Player.yOffset;
        this.transitionTimer = 0;
        transitionSlide(scene, scenes.getScene(this.worldCoordsX, this.worldCoordsY).scene, Math.PI / 2, this.worldCoordsX, this.worldCoordsY + 1);
      }
    }

    if (transition) {
      const nextScene = scenes.getScene(this.worldCoordsX, this.worldCoordsY);
      nextScene.resetter.reset();
      engine.addEntity(nextScene.sceneKey, this);
      engine.removeEntity(nextScene.sceneKey, this.shadow);
      engine.removeEntity(nextScene.sceneKey, this.baseImage);
      engine.removeEntity(nextScene.sceneKey, this.hairImage);
      engine.removeEntity(nextScene.sceneKey, this.toolImage);
      engine.removeEntity(nextScene.sceneKey, this.crosshair);
      engine.removeEntity(nextScene.sceneKey, this.statusBar);
      engine.addEntity(nextScene.sceneKey, this.shadow);
      engine.addEntity(nextScene.sceneKey, this.baseImage);
      engine.addEntity(nextScene.sceneKey, this.hairImage);
      engine.addEntity(nextScene.sceneKey, this.toolImage);
      engine.addEntity(nextScene.sceneKey, this.crosshair);
      engine.addEntity(nextScene.sceneKey, this.statusBar);
      return;
    }

    if (canMove && engine.sceneKey(scene) != 'pause' && scene.isControl('pause', ControllerState.Press)) {
      engine.addEntity('pause', this);
      engine.addEntity('pause', this.statusBar);
      engine.addEntity('pause', this.inventory);
      this.lastScene = engine.sceneKey(scene);
      engine.switchToScene('pause');
      Sound.Sounds['pause'].play();
    }

    // falling
    if (!this.jumping && !this.falling && !usedMirror) {
      const holes = scene.entitiesByType(Hole);
      for (let hole of holes) {
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
          break;
        }
      }

      // Door transition
      if (!this.jumping) {
        const doors = scene.entitiesByType(Door);
        doors.forEach(door => {
          if (door.collision(this)) {
            const travelInfo = door.travelInfo();

            transitionFade(scene, engine.getScene(travelInfo.destination));
            this.worldCoordsX = travelInfo.worldX;
            this.worldCoordsY = travelInfo.worldY;
            this.x = travelInfo.x;
            this.y = travelInfo.y;
            this.spawnX = this.x;
            this.spawnY = this.y;
            const nextScene = travelInfo.destination;
            if (nextScene) {
              engine.switchToScene(nextScene);
              scenes.getSceneByKey(nextScene).resetter.reset();
              engine.addEntity(nextScene, this);
              engine.removeEntity(nextScene, this.shadow);
              engine.removeEntity(nextScene, this.baseImage);
              engine.removeEntity(nextScene, this.hairImage);
              engine.removeEntity(nextScene, this.toolImage);
              engine.removeEntity(nextScene, this.crosshair);
              engine.removeEntity(nextScene, this.statusBar);
              engine.addEntity(nextScene, this.shadow);
              engine.addEntity(nextScene, this.baseImage);
              engine.addEntity(nextScene, this.hairImage);
              engine.addEntity(nextScene, this.toolImage);
              engine.addEntity(nextScene, this.crosshair);
              engine.addEntity(nextScene, this.statusBar);

              playTrackForScene(nextScene);
            }
          }
        });
      }

      if (!this.jumping) {
        const portals = scene.entitiesByType(Portal);
        portals.forEach(portal => {
          if (portal.collision(this) && portal.isActivated()) {
            this.x = portal.getDestPos().x;
            this.y = portal.getDestPos().y;
          }
        });
      }

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


  clearCarry() {
    this.carry = false;
    this.carryEntity = undefined;
  }

  removeItem(item: number) {
    if (this.item1 == item) {
      this.item1 = -1;
    }
    if (this.item2 == item) {
      this.item2 = -1;
    }
    this.inventory.removeItem(item);
    this.spawnX = Math.round(this.x / 16) * 16;
    this.spawnY = Math.round(this.y / 16) * 16;
  }

  remove(scene: Scene) {
    scene.removeEntity(this);
    scene.removeEntity(this.baseImage);
    scene.removeEntity(this.hairImage);
    scene.removeEntity(this.toolImage);
    scene.removeEntity(this.crosshair);
  }
}