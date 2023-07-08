import { Canvas2DView, ControllerBinding, Engine, FixedTickEngine, KeyboardController, Scene, MouseController, Sprite, Sound, GamepadController, View } from 'game-engine';
import { Player } from './player';
import { PauseMenu } from './pause-menu';
import { Wall } from './wall';
import { BackgroundEntity } from './background';
import { SceneMap } from './scene-map';
import { Npc } from './npc';
import { Rock } from './rock';
import { Grass } from './grass';
import { Hole } from './hole';
import { Sign } from './sign';
import { Pot } from './pot';
import { Door } from './door';
import { Tree } from './tree';
import { Barrel } from './barrel';
import { Stairs } from './stairs';
import { HalfWall } from './half-wall';
import { Switch } from './switch';


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
  }
);


export const screenWidth = 160;
export const screenHeight = 160;
const scale = 3;

export const FPS = 60;

export const engine: Engine = new FixedTickEngine(FPS);

const spriteAssets = require.context('../assets/', false, /\.png$/);
const spriteAssetsPremade = require.context('../assets/premade', false, /\.png$/);
new Sprite('buddy', spriteAssets('./buddy.png'), { spriteWidth: 16, spriteHeight: 16 });
//idle
new Sprite('base_idle_strip9', spriteAssetsPremade('./base_idle_strip9.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
new Sprite('bowlhair_idle_strip9', spriteAssetsPremade('./bowlhair_idle_strip9.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
new Sprite('longhair_idle_strip9', spriteAssetsPremade('./longhair_idle_strip9.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
new Sprite('curlyhair_idle_strip9', spriteAssetsPremade('./curlyhair_idle_strip9.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
new Sprite('spikeyhair_idle_strip9', spriteAssetsPremade('./spikeyhair_idle_strip9.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
new Sprite('mophair_idle_strip9', spriteAssetsPremade('./mophair_idle_strip9.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
new Sprite('shorthair_idle_strip9', spriteAssetsPremade('./shorthair_idle_strip9.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
new Sprite('tools_idle_strip9', spriteAssetsPremade('./tools_idle_strip9.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
//walk
new Sprite('base_walk_strip8', spriteAssetsPremade('./base_walk_strip8.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
new Sprite('bowlhair_walk_strip8', spriteAssetsPremade('./bowlhair_walk_strip8.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
new Sprite('tools_walk_strip8', spriteAssetsPremade('./tools_walk_strip8.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
//jump
new Sprite('base_jump_strip9', spriteAssetsPremade('./base_jump_strip9.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
new Sprite('bowlhair_jump_strip9', spriteAssetsPremade('./bowlhair_jump_strip9.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
new Sprite('tools_jump_strip9', spriteAssetsPremade('./tools_jump_strip9.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
//dig
new Sprite('base_dig_strip13', spriteAssetsPremade('./base_dig_strip13.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
new Sprite('bowlhair_dig_strip13', spriteAssetsPremade('./bowlhair_dig_strip13.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
new Sprite('tools_dig_strip13', spriteAssetsPremade('./tools_dig_strip13.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
//attack
new Sprite('base_attack_strip10', spriteAssetsPremade('./base_attack_strip10.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
new Sprite('bowlhair_attack_strip10', spriteAssetsPremade('./bowlhair_attack_strip10.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
new Sprite('tools_attack_strip10', spriteAssetsPremade('./tools_attack_strip10.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
//roll - used for fall
new Sprite('base_roll_strip10', spriteAssetsPremade('./base_roll_strip10.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
new Sprite('bowlhair_roll_strip10', spriteAssetsPremade('./bowlhair_roll_strip10.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
new Sprite('tools_roll_strip10', spriteAssetsPremade('./tools_roll_strip10.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
//waiting - used for fishing?
new Sprite('base_waiting_strip9', spriteAssetsPremade('./base_waiting_strip9.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
new Sprite('bowlhair_waiting_strip9', spriteAssetsPremade('./bowlhair_waiting_strip9.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
new Sprite('tools_waiting_strip9', spriteAssetsPremade('./tools_waiting_strip9.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
//doing - used for pickup/place
new Sprite('base_doing_strip8', spriteAssetsPremade('./base_doing_strip8.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
new Sprite('bowlhair_doing_strip8', spriteAssetsPremade('./bowlhair_doing_strip8.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
new Sprite('tools_doing_strip8', spriteAssetsPremade('./tools_doing_strip8.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
//hurt
new Sprite('base_hurt_strip8', spriteAssetsPremade('./base_hurt_strip8.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
new Sprite('bowlhair_hurt_strip8', spriteAssetsPremade('./bowlhair_hurt_strip8.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
new Sprite('tools_hurt_strip8', spriteAssetsPremade('./tools_hurt_strip8.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
//carry
new Sprite('base_carry_strip8', spriteAssetsPremade('./base_carry_strip8.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
new Sprite('bowlhair_carry_strip8', spriteAssetsPremade('./bowlhair_carry_strip8.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
new Sprite('tools_carry_strip8', spriteAssetsPremade('./tools_carry_strip8.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });

//backgrounds
new Sprite('main1', spriteAssetsPremade('./main1.png'), { spriteWidth: screenWidth, spriteHeight: screenHeight });
new Sprite('main2', spriteAssetsPremade('./main2.png'), { spriteWidth: screenWidth, spriteHeight: screenHeight });
new Sprite('main3', spriteAssetsPremade('./main3.png'), { spriteWidth: screenWidth, spriteHeight: screenHeight });
new Sprite('main4', spriteAssetsPremade('./main4.png'), { spriteWidth: screenWidth, spriteHeight: screenHeight });
new Sprite('main5', spriteAssetsPremade('./main5.png'), { spriteWidth: screenWidth, spriteHeight: screenHeight });
new Sprite('main6', spriteAssetsPremade('./main6.png'), { spriteWidth: screenWidth, spriteHeight: screenHeight });
new Sprite('main7', spriteAssetsPremade('./main7.png'), { spriteWidth: screenWidth, spriteHeight: screenHeight });
new Sprite('main8', spriteAssetsPremade('./main8.png'), { spriteWidth: screenWidth, spriteHeight: screenHeight });
new Sprite('underground1', spriteAssetsPremade('./underground1.png'), { spriteWidth: screenWidth, spriteHeight: screenHeight });
new Sprite('house1', spriteAssetsPremade('./house1.png'), { spriteWidth: screenWidth, spriteHeight: screenHeight });
new Sprite('house2', spriteAssetsPremade('./house2.png'), { spriteWidth: screenWidth, spriteHeight: screenHeight });

new Sprite('inventory', spriteAssetsPremade('./inventory.png'), { spriteWidth: screenWidth, spriteHeight: screenHeight });
new Sprite('tiles', spriteAssetsPremade('./spr_tileset_sunnysideworld_16px.png'), { spriteWidth: 16, spriteHeight: 16 });
new Sprite('crosshair', spriteAssets('./crosshair.png'), { spriteWidth: 8, spriteHeight: 8 });
new Sprite('coin', spriteAssetsPremade('./item8BIT_coin.png'), { spriteWidth: 16, spriteHeight: 16 });
new Sprite('shovel', spriteAssetsPremade('./item8BIT_shovel.png'), { spriteWidth: 16, spriteHeight: 16 });
new Sprite('sword', spriteAssetsPremade('./item8BIT_sword.png'), { spriteWidth: 16, spriteHeight: 16 });
new Sprite('bombs', spriteAssetsPremade('./item8BIT_bomb.png'), { spriteWidth: 16, spriteHeight: 16 });
new Sprite('bow', spriteAssetsPremade('./item8BIT_bow.png'), { spriteWidth: 16, spriteHeight: 16 });
new Sprite('feather', spriteAssetsPremade('./item8BIT_feather.png'), { spriteWidth: 16, spriteHeight: 16 });
new Sprite('glove', spriteAssetsPremade('./item8BIT_glove.png'), { spriteWidth: 16, spriteHeight: 16 });
new Sprite('compass', spriteAssetsPremade('./item8BIT_compass.png'), { spriteWidth: 16, spriteHeight: 16 });
new Sprite('lamp', spriteAssetsPremade('./item8BIT_lamp.png'), { spriteWidth: 16, spriteHeight: 16 });
new Sprite('mirror', spriteAssetsPremade('./item8BIT_mirror.png'), { spriteWidth: 16, spriteHeight: 16 });
new Sprite('harp', spriteAssetsPremade('./item8BIT_harp.png'), { spriteWidth: 16, spriteHeight: 16 });
new Sprite('heart', spriteAssetsPremade('./item8BIT_heart.png'), { spriteWidth: 16, spriteHeight: 16 });

new Sprite('fire1', spriteAssetsPremade('./spr_deco_fire_01_strip4.png'), { spriteWidth: 5, spriteHeight: 10 });
new Sprite('fire2', spriteAssetsPremade('./spr_deco_fire_02_strip4.png'), { spriteWidth: 8, spriteHeight: 12 });

new Sprite('bomb', spriteAssets('./bomb.png'), { spriteWidth: 16, spriteHeight: 16 });
new Sprite('explosion', spriteAssets('./explosion.png'), { spriteWidth: 32, spriteHeight: 32 });
new Sprite('arrowV', spriteAssets('./arrowV.png'), { spriteWidth: 8, spriteHeight: 16 });
new Sprite('arrowH', spriteAssets('./arrowH.png'), { spriteWidth: 16, spriteHeight: 8 });


const wavAssets = require.context('../assets/', false, /\.wav$/);
const wavAssetsPremade = require.context('../assets/premade', false, /\.wav$/);
new Sound('start', wavAssetsPremade('./GAME_MENU_SCORE_SFX001416.wav'));
new Sound('dayloop', wavAssetsPremade('./Daytime1Loop.wav'), true);
new Sound('talk', wavAssetsPremade('./MenuCursor01.wav'));
new Sound('pause', wavAssetsPremade('./MenuValid01.wav'));
new Sound('slash', wavAssetsPremade('./Attack03.wav'));
new Sound('dig', wavAssetsPremade('./Attack02.wav'));
new Sound('jump', wavAssetsPremade('./Jump03.wav'));
new Sound('fall', wavAssetsPremade('./Fall01.wav'));
new Sound('hurt', wavAssetsPremade('./Hurt01.wav'));
new Sound('explosion', wavAssetsPremade('./Attack02.wav'));
new Sound('harp', wavAssetsPremade('./GuitarStinger4.wav'));
new Sound('bow', wavAssets('./bow3.wav'));

export const scenes = new SceneMap();

export const loopTrack = {
  track: {
    stop: () => {}
  }
}

async function init() {

  await Sprite.waitForLoad();

  const view = new Canvas2DView(screenWidth, screenHeight, { scale: scale, bgColor: '#BBBBBB' });

  buildMap(view);

  engine.switchToScene('0,0');

  Sound.setVolume(0.1);

  // Sound.Sounds['start'].play();
  loopTrack.track = Sound.Sounds['dayloop'].play();

  await engine.start();
}

const keyMap = [
  {
    binding: new ControllerBinding<undefined>('left'),
    keys: ['ArrowLeft'],
  },
  {
    binding: new ControllerBinding<undefined>('right'),
    keys: ['ArrowRight'],
  },
  {
    binding: new ControllerBinding<undefined>('up'),
    keys: ['ArrowUp'],
  },
  {
    binding: new ControllerBinding<undefined>('down'),
    keys: ['ArrowDown'],
  },
  {
    binding: new ControllerBinding<undefined>('sprint'),
    keys: ['Shift'],
  },
  {
    binding: new ControllerBinding<undefined>('action1'),
    keys: ['x'],
  },
  {
    binding: new ControllerBinding<undefined>('action2'),
    keys: ['z'],
  },
  {
    binding: new ControllerBinding<undefined>('pause'),
    keys: ['Enter'],
  },
];

const mouseMap = [
  {
    binding: new ControllerBinding<{ x: number, y: number, dx: number, dy: number }>('interact'),
    buttons: [0],
  }
];

const gamepadMap = [
  {
    binding: new ControllerBinding<{ value: number }>('button1'),
    buttons: [
      { type: 'buttons', index: 0 },
    ],
  },
  {
    binding: new ControllerBinding<{ value: number }>('button2'),
    buttons: [
      { type: 'buttons', index: 1 },
    ],
  },
  {
    binding: new ControllerBinding<{ value: number }>('axis1'),
    buttons: [
      { type: 'axes', index: 0 },
    ],
  },
  {
    binding: new ControllerBinding<{ value: number }>('axis2'),
    buttons: [
      { type: 'axes', index: 1 },
    ],
  }
];

function buildMap(view: View) {
  const keyController = new KeyboardController(keyMap);
  const scenePause = new Scene(view);
  scenePause.addController(keyController);
  // scene.addController(new MouseController(mouseMap));
  // scene.addController(new GamepadController(gamepadMap));

  build00(view, keyController);
  builde10(view, keyController);
  buildHousee10(view, keyController);
  buildw10(view, keyController);
  buildw20(view, keyController);
  buildw30(view, keyController);
  buildHousew30(view, keyController);
  builde1n1(view, keyController);
  builde1n2(view, keyController);
  builde1s1(view, keyController);
  buildUndergroundw10(view, keyController);

  // build layout
  scenes.setScene('0,0', 0, 0);
  scenes.setScene('1,0', 1, 0);
  scenes.setScene('-1,0', -1, 0);
  scenes.setScene('-2,0', -2, 0);
  scenes.setScene('-3,0', -3, 0);
  scenes.setScene('1,-1', 1, -1);
  scenes.setScene('1,-2', 1, -2);
  scenes.setScene('1,1', 1, 1);

  engine.addScene('pause', scenePause);

  scenePause.addEntity(new BackgroundEntity('inventory'));
  scenePause.addEntity(new PauseMenu());

  
}

function build00(view: View, keyController: KeyboardController) {
  const scene = new Scene(view);

  scene.addController(keyController);
  scene.addEntity(new BackgroundEntity('main1'));
  // top
  scene.addEntity(new Wall(0, 16, screenWidth, 16));
  // left
  scene.addEntity(new Wall(0, 16, 32, 3 * 16));
  scene.addEntity(new Grass(16, 4 * 16));
  scene.addEntity(new Grass(16, 5 * 16));
  scene.addEntity(new Grass(16, 6 * 16));
  scene.addEntity(new Wall(0, 7 * 16, 32, 3 * 16));
  // bottom
  scene.addEntity(new Wall(0, screenHeight - 16, screenWidth, 16));
  scene.addEntity(new Sign(32, 32, [
    'Congratulations on defeating\nthe evil Frogman. The\nKingdom is safe.',
    'But more people are in\nneed of help. Luckily you\nhave gathered many',
    'items across your journey.',
    'Find the right order\nto save everyone\'s day.',
    'PS Gaze into the mirror\nto return here instantly.'
  ]));
  scene.addEntity(new Player(scene, 32, 48));


  scene.addEntity(new Hole(4 * 16, 2 * 16));
  scene.addEntity(new Hole(5 * 16, 2 * 16));
  scene.addEntity(new Hole(6 * 16, 2 * 16));

  scene.addEntity(new Hole(5 * 16, 7 * 16));

  engine.addScene('0,0', scene);
}

function buildw10(view: View, keyController: KeyboardController) {
  const scene = new Scene(view);

  scene.addController(keyController);
  scene.addEntity(new BackgroundEntity('main3'));
  // top
  scene.addEntity(new Wall(0, 32, screenWidth, 16));
  // right
  scene.addEntity(new Wall(screenWidth - 16, 16, 32, 3 * 16));
  scene.addEntity(new Wall(screenWidth - 16, 7 * 16, 32, 3 * 16));
  // bottom
  scene.addEntity(new Wall(0, screenHeight - 32, screenWidth, 16));


  scene.addEntity(new Wall(2 * 16, 4 * 16, 5 * 16, 1 * 16));
  scene.addEntity(new Wall(2 * 16, 4 * 16, 1 * 16, 2 * 16));

  scene.addEntity(new Door(3 * 16, 5 * 16, 'u_-1,0', 1 * 16, 4 * 16, -1, 0));
  scene.addEntity(new Pot(5 * 16, 5 * 16));
  scene.addEntity(new Wall(2 * 16, 6 * 16, 5 * 16, 1 * 16));

  engine.addScene('-1,0', scene);
}

function buildUndergroundw10(view: View, keyController: KeyboardController) {
  const scene = new Scene(view);
  scene.addController(keyController);

  scene.addEntity(new BackgroundEntity('underground1'));
  scene.addEntity(new Wall(0, 32, screenWidth, 16));
  scene.addEntity(new Wall(0, screenHeight - 16, screenWidth, 16));

  scene.addEntity(new Wall(0, 16, 16, screenHeight));
  scene.addEntity(new Wall(screenWidth - 16, 16, 16, screenHeight));

  scene.addEntity(new Door( 1 * 16, 3 * 16, '-1,0', 4 * 16, 5 * 16, -1, 0));

  scene.addEntity(new Wall(4 * 16, 6 * 16, 16, 16));

  // row 1
  // skip
  scene.addEntity(new Hole(2 * 16, 3 * 16));
  scene.addEntity(new Hole(3 * 16, 3 * 16));
  scene.addEntity(new Hole(4 * 16, 3 * 16));
  scene.addEntity(new Hole(5 * 16, 3 * 16));
  scene.addEntity(new Hole(6 * 16, 3 * 16));
  scene.addEntity(new Hole(7 * 16, 3 * 16));
  scene.addEntity(new Hole(8 * 16, 3 * 16));

  // row 2
  // skip
  scene.addEntity(new Hole(2 * 16, 4 * 16));
  scene.addEntity(new Hole(3 * 16, 4 * 16));
  scene.addEntity(new Hole(4 * 16, 4 * 16));
  // skip
  scene.addEntity(new Hole(6 * 16, 4 * 16));
  // skip
  // skip

  // row 3
  scene.addEntity(new Hole(1 * 16, 5 * 16));
  scene.addEntity(new Hole(2 * 16, 5 * 16));
  scene.addEntity(new Hole(3 * 16, 5 * 16));
  scene.addEntity(new Hole(4 * 16, 5 * 16));
  scene.addEntity(new Hole(5 * 16, 5 * 16));
  scene.addEntity(new Hole(6 * 16, 5 * 16));
  scene.addEntity(new Hole(7 * 16, 5 * 16));
  scene.addEntity(new Hole(8 * 16, 5 * 16));

  // row 4
  // skip
  scene.addEntity(new Hole(2 * 16, 6 * 16));
  // skip
  // skip
  // skip
  scene.addEntity(new Hole(6 * 16, 6 * 16));
  scene.addEntity(new Hole(7 * 16, 6 * 16));
  // skip

  // row 5
  scene.addEntity(new Hole(1 * 16, 7 * 16));
  scene.addEntity(new Hole(2 * 16, 7 * 16));
  scene.addEntity(new Hole(3 * 16, 7 * 16));
  scene.addEntity(new Hole(4 * 16, 7 * 16));
  scene.addEntity(new Hole(5 * 16, 7 * 16));
  scene.addEntity(new Hole(6 * 16, 7 * 16));
  scene.addEntity(new Hole(7 * 16, 7 * 16));
  // skip

  // row 6
  scene.addEntity(new Hole(1 * 16, 8 * 16));
  scene.addEntity(new Hole(2 * 16, 8 * 16));
  // skip
  scene.addEntity(new Hole(4 * 16, 8 * 16));
  // skip
  scene.addEntity(new Hole(6 * 16, 8 * 16));
  scene.addEntity(new Hole(7 * 16, 8 * 16));
  // skip

  scene.addEntity(new Npc(scene, 8 * 16, 8 * 16,
    ['I don\'t know how I\nmanaged to get stuck here.', 'Hey! That feather looks\nlike could help!', {options: ['Keep feather', 'Give feather']}],
    ['Thank you! Now I can leave.', '...', '......', 'I hope you can too!'], 4, 'spikeyhair'));

  engine.addScene('u_-1,0', scene);
}

function builde10(view: View, keyController: KeyboardController) {
  const scene = new Scene(view);
  scene.addController(keyController);

  scene.addEntity(new BackgroundEntity('main2'));
  //top
  scene.addEntity(new Wall(0, 16, 2 * 16, 16));
  scene.addEntity(new Rock(32, 16));
  scene.addEntity(new Wall(3 * 16, 16, screenWidth, 16));
  //right
  scene.addEntity(new Wall(screenWidth - 16, 0, 16, screenHeight));
  //bottom
  scene.addEntity(new Wall(0, screenHeight - 16, 16, 16));

  // house
  scene.addEntity(new Wall(4 * 16 - 8, 64, 1.5 * 16, 3 * 16));
  scene.addEntity(new Wall(4 * 16 - 8, 64, 5 * 16, 2 * 16));
  scene.addEntity(new Wall(6.5 * 16 - 8, 64, 2.5 * 16, 3 * 16));

  scene.addEntity(new Door(5 * 16, 6 * 16, 'h_1,0', 3 * 16, 8 * 16, 1, 0));
  // crate1
  scene.addEntity(new Wall(screenWidth - 32, 3 * 16, 5 * 16, 3 * 16));
  // crate2
  scene.addEntity(new Wall(screenWidth - 32, 7 * 16, 16, 16));

  scene.addEntity(new Npc(scene, 7 * 16, 7 * 16,
    ['I need a shovel to dig my\ngarden. Could you give\nme yours?', { options: ['keep shovel', 'give shovel'] }],
    ['Thank you, now it\'s\ntime to get planting.'], 0));

  engine.addScene('1,0', scene);
}

function buildHousee10(view: View, keyController: KeyboardController) {
  const scene = new Scene(view);
  scene.addController(keyController);

  scene.addEntity(new BackgroundEntity('house1'));
  //top
  scene.addEntity(new Wall(0, 32, screenWidth, 16));
  //right
  scene.addEntity(new Wall(screenWidth - 16, 0, 16, screenHeight));
  //left
  scene.addEntity(new Wall(0, 0, 16, screenHeight));
  //bottom
  scene.addEntity(new Wall(0, screenHeight - 16, 3 * 16, 16));
  scene.addEntity(new Door(3 * 16, 9 * 16, '1,0', 5 * 16, 7 * 16, 1, 0));
  scene.addEntity(new Wall(4 * 16, screenHeight - 16, 6 * 16, 16));

  scene.addEntity(new Pot(2 * 16, 3 * 16));
  scene.addEntity(new Pot(3 * 16, 3 * 16));
  scene.addEntity(new Pot(4 * 16, 3 * 16));
  scene.addEntity(new Pot(5 * 16, 3 * 16));
  scene.addEntity(new Pot(6 * 16, 3 * 16));

  scene.addEntity(new Pot(2 * 16, 4 * 16));
  scene.addEntity(new Pot(3 * 16, 4 * 16));
  scene.addEntity(new Pot(4 * 16, 4 * 16));
  scene.addEntity(new Pot(5 * 16, 4 * 16));
  scene.addEntity(new Pot(6 * 16, 4 * 16));

  scene.addEntity(new Pot(2 * 16, 5 * 16));
  scene.addEntity(new Pot(3 * 16, 5 * 16));
  scene.addEntity(new Pot(4 * 16, 5 * 16));
  scene.addEntity(new Pot(5 * 16, 5 * 16));
  scene.addEntity(new Pot(6 * 16, 5 * 16));
  scene.addEntity(new Pot(7 * 16, 5 * 16));
  scene.addEntity(new Pot(8 * 16, 5 * 16));

  scene.addEntity(new Pot(2 * 16, 6 * 16));
  scene.addEntity(new Pot(3 * 16, 6 * 16));
  scene.addEntity(new Pot(4 * 16, 6 * 16));
  scene.addEntity(new Pot(5 * 16, 6 * 16));
  scene.addEntity(new Pot(6 * 16, 6 * 16));
  scene.addEntity(new Pot(7 * 16, 6 * 16));
  scene.addEntity(new Pot(8 * 16, 6 * 16));

  scene.addEntity(new Npc(scene, 7 * 16, 3 * 16,
    ['You destroyed my\npot collection.', 'Give me your compass, so\nI can go searching for more.', {options: ['Keep compass', 'Give compass']}], ['Alright, now scram!'], 5, 'mophair'));

  engine.addScene('h_1,0', scene);
}


function builde1n1(view: View, keyController: KeyboardController) {
  const scene = new Scene(view);
  scene.addController(keyController);

  scene.addEntity(new BackgroundEntity('main4'));
  //bottom
  scene.addEntity(new Wall(0, screenHeight - 16, 2 * 16, 16));
  scene.addEntity(new Wall(3 * 16, screenHeight - 16, screenWidth, 16));
  //right
  scene.addEntity(new Wall(screenWidth - 16, 0, 16, screenHeight));
  //left
  scene.addEntity(new Wall(0, 0, 16, screenHeight));
  //top
  scene.addEntity(new Wall(0, 16, screenWidth - 32, 16));

  //fence
  scene.addEntity(new Wall(16, 32, 7 * 16, 16));
  scene.addEntity(new Wall(16, 32, 16, 5 * 16));
  scene.addEntity(new Wall(2 * 16, 6 * 16, 32, 16));
  scene.addEntity(new Wall(5 * 16, 6 * 16, screenWidth - 32, 16));

  //graves
  scene.addEntity(new Wall(3 * 16, 3 * 16, 16, 16));
  scene.addEntity(new Wall(5 * 16, 3 * 16, 16, 16));
  scene.addEntity(new Wall(7 * 16, 3 * 16, 16, 16));

  scene.addEntity(new Tree(8 * 16, 1 * 16));

  // well
  scene.addEntity(new Wall(7 * 16, 7 * 16, 32, 32));

  engine.addScene('1,-1', scene);
}

function builde1n2(view: View, keyController: KeyboardController) {
  const scene = new Scene(view);
  scene.addController(keyController);

  scene.addEntity(new BackgroundEntity('main5'));
  //bottom
  scene.addEntity(new Wall(0, screenHeight - 32, 8 * 16, 32));
  //right
  scene.addEntity(new Wall(screenWidth - 16, 0, 16, screenHeight));
  //left
  scene.addEntity(new Wall(0, 0, 16, screenHeight));
  //top
  scene.addEntity(new Wall(0, 5 * 16, screenWidth, 16));

  scene.addEntity(new Npc(scene, 1 * 16, 6 * 16, [
    'The drawbridge is up,\nsomeone must be playing\na prank on me.',
    'If you give me your bow,\nI might be able to\nshoot the switch.',
    {options: ['Keep bow', 'Give bow']}
  ],
  [
    'Thanks, you really saved me there.'
  ], 3, 'curlyhair'))

  // crate
  scene.addEntity(new Wall(1 * 16, 7 * 16, 16, 16));

  engine.addScene('1,-2', scene);
}

function builde1s1(view: View, keyController: KeyboardController) {
  const scene = new Scene(view);
  scene.addController(keyController);

  scene.addEntity(new BackgroundEntity('main6'));
  //left
  scene.addEntity(new Wall(0, 0, 16, screenHeight));
  //right
  scene.addEntity(new Wall(screenWidth - 16, 0, 16, screenHeight));
  //bottom
  scene.addEntity(new Wall(0, screenHeight - 32, screenWidth, 16));

  // holes
  scene.addEntity(new Hole(1 * 16, 4 * 16));
  scene.addEntity(new Hole(2 * 16, 4 * 16));
  scene.addEntity(new Hole(3 * 16, 4 * 16));

  //mountain
  scene.addEntity(new Wall(4 * 16, 2 * 16, 6 * 16, 6 * 16));

  scene.addEntity(new Npc(scene, 3 * 16, 7 * 16,
    ['A rock slide is blocking\nthe way to my flower.', 'Could I have your bombs?', { options: ['keep bombs', 'give bombs'] }],
    ['Let me gather my nerves.'], 9));

  engine.addScene('1,1', scene);
}


function buildw20(view: View, keyController: KeyboardController) {
  const scene = new Scene(view);

  scene.addController(keyController);
  scene.addEntity(new BackgroundEntity('main7'));
  // top
  scene.addEntity(new Wall(0, 32, screenWidth, 16));
  // right/bottom
  scene.addEntity(new Wall(screenWidth - 32, screenHeight - 32, 32, 32));

  // house
  scene.addEntity(new Wall(4 * 16, 3 * 16, 3 * 16 - 8, 3 * 16));

  // fence
  scene.addEntity(new Wall(2 * 16 + 8, 3 * 16, 3 * 16, 1 * 16));
  scene.addEntity(new Wall(2 * 16 + 8, 4 * 16, 1 * 16, 1 * 16));
  scene.addEntity(new Wall(2 * 16 + 8, 5 * 16, 3 * 16, 1 * 16));

  //campfire
  scene.addEntity(new Wall(3 * 16, 6 * 16, 2 * 16, 2 * 16));

  scene.addEntity(new Barrel(1 * 16 + 8, 3 * 16));
  scene.addEntity(new Barrel(1 * 16 + 8, 4 * 16));
  scene.addEntity(new Barrel(1 * 16 + 8, 5 * 16));

  scene.addEntity(new Npc(scene, 5 * 16, 6 * 16,
    [
      'I put the barrels and\nfence there while he was\nnapping.',
      'Serves him right for\nsleeping on the job.'
    ], [], -1, 'spikeyhair'));

  scene.addEntity(new Npc(scene, 3 * 16, 4 * 16,
    [
      'I don\'t know how I got\nstuck. Could you spare\nyour mirror?',
      { options: ['Keep mirror', 'Give mirror'] }
    ],
    [
      'Thank you!'
    ], 7, 'shorthair'));

  engine.addScene('-2,0', scene);
}

function buildw30(view: View, keyController: KeyboardController) {
  const scene = new Scene(view);

  scene.addController(keyController);
  scene.addEntity(new BackgroundEntity('main8'));
  // top
  scene.addEntity(new Wall(0, 32, screenWidth, 16));
  // left
  scene.addEntity(new Wall(0, 0, 32, screenHeight));

  // house
  scene.addEntity(new Wall(2 * 16, 3 * 16, 6 * 16, 3 * 16));
  scene.addEntity(new Wall(2 * 16, 6 * 16, 2 * 16, 1 * 16));
  scene.addEntity(new Wall(5 * 16, 6 * 16, 3 * 16, 1 * 16));
  scene.addEntity(new Door(4 * 16, 6 * 16, 'h_-3,0', 4 * 16, 8 * 16, -3, 0));

  engine.addScene('-3,0', scene);
}

function buildHousew30(view: View, keyController: KeyboardController) {
  const scene = new Scene(view);
  scene.addController(keyController);

  scene.addEntity(new BackgroundEntity('house2'));
  //top
  scene.addEntity(new Wall(0, 32, screenWidth, 16));
  //right
  scene.addEntity(new Wall(screenWidth - 16, 0, 16, screenHeight));
  //left
  scene.addEntity(new Wall(0, 0, 16, screenHeight));
  //bottom
  scene.addEntity(new Wall(0, screenHeight - 16, 4 * 16, 16));
  scene.addEntity(new Door(4 * 16, 9 * 16, '-3,0', 4 * 16, 7 * 16, -3, 0));
  scene.addEntity(new Wall(5 * 16, screenHeight - 16, 6 * 16, 16));

  // lane
  scene.addEntity(new Wall(1 * 16, 3 * 16, 1 * 16, 5 * 16));
  scene.addEntity(new HalfWall(2 * 16, 6 * 16, 1 * 16, 1 * 16));
  scene.addEntity(new Wall(3 * 16, 3 * 16, 1 * 16, 5 * 16));
  scene.addEntity(new Switch(2 * 16, 3 * 16, () => {
    stairs.activate();
  }))

  // table
  scene.addEntity(new Wall(7 * 16, 7 * 16, 1 * 16, 1 * 16));

  let stairs = new Stairs(6 * 16, 4 * 16)
  // stage
  scene.addEntity(new Wall(4 * 16, 4 * 16, 2 * 16, 1 * 16));
  scene.addEntity(stairs);
  scene.addEntity(new Wall(7 * 16, 4 * 16, 2 * 16, 1 * 16));

  scene.addEntity(new Npc(scene, 6 * 16, 3 * 16,
    ['That harp looks like it\nwould match nicely on stage.', { options: ['Keep harp', 'Give harp'] }], ['Come back later for\nthe show.'], 8, 'longhair'));

  engine.addScene('h_-3,0', scene);
}

init();