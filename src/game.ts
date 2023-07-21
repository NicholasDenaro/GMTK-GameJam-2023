import { Canvas2DView, ControllerBinding, Engine, FixedTickEngine, KeyboardController, Scene, MouseController, Sprite, Sound, GamepadController, View, ControllerState, Entity, SpriteEntity, SpritePainter } from 'game-engine';
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
import { HeavyRock } from './heavy-rocky';
import { Portal } from './portal';
import { Credits } from './credits';
import { MainMenu } from './main-menu';
import { Interactable } from './interactable';
import { Title } from './title';
import { Grave, Skeleton } from './grave';
import { PermaFire } from './perma-fire';
import { TiledBackground } from './tiled-background';
import { GameEntity } from './game-entity';
import { TransitionFadeEntity } from './transition-fade';
import { OptionsEntity } from './options';
import { Cutscene } from './cutscene';
import { Fire } from './fire';
import { StatusBar } from './status-bar';
import { Arrow } from './arrow';
import { Bomb } from './bomb';
import { TextboxEntity } from './textbox';
import { ScreenController } from './screen-controller';

const world = require('../tiled-project/overworld-2.tmx');
const houses = require('../tiled-project/houses.tmx');
const underground = require('../tiled-project/underground.tmx');

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

export const FPS = 60;

export const engine: Engine = new FixedTickEngine(FPS);

export const statefulMode = {
  enabled: false,
}

export const win = {
  active: false,
}

export const fadeEntity = new TransitionFadeEntity();

export function drawTile(ctx: CanvasRenderingContext2D, x: number, y: number, index: number) {
  const width = Sprite.Sprites['tiles'].getImage().width;
  const i = index % (width / 16);
  const j = Math.floor(index / (width / 16));
  ctx.drawImage(Sprite.Sprites['tiles'].getImage(), i * 16, j * 16, 16, 16, x, y, 16, 16);
};

export const screenTransition: {activate: boolean, active: boolean, action: 'slide' | 'fade', timer: number, totalTime: number, scene?: Scene, nextScene?: Scene, direction: number} = {
  activate: false,
  active: false,
  action: undefined,
  timer: 0,
  totalTime: 0,
  scene: <Scene>undefined,
  nextScene: <Scene>undefined,
  direction: 0,
};

const spriteAssets = require.context('../assets/', false, /\.png$/);
const spriteAssetsPremade = require.context('../assets/premade', false, /\.png$/);
const wavAssets = require.context('../assets/', false, /\.(wav|ogg|mp3)$/);
const wavAssetsPremade = require.context('../assets/premade/outputs', false, /\.(wav|ogg|mp3)$/);

(function setupAssets() {
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

  new Sprite('skeleton_idle_strip6', spriteAssetsPremade('./skeleton_idle_strip6.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 26 });
  //walk
  new Sprite('base_walk_strip8', spriteAssetsPremade('./base_walk_strip8.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
  new Sprite('bowlhair_walk_strip8', spriteAssetsPremade('./bowlhair_walk_strip8.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
  new Sprite('curlyhair_walk_strip8', spriteAssetsPremade('./curlyhair_walk_strip8.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
  new Sprite('longhair_walk_strip8', spriteAssetsPremade('./longhair_walk_strip8.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
  new Sprite('mophair_walk_strip8', spriteAssetsPremade('./mophair_walk_strip8.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
  new Sprite('shorthair_walk_strip8', spriteAssetsPremade('./shorthair_walk_strip8.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
  new Sprite('spikeyhair_walk_strip8', spriteAssetsPremade('./spikeyhair_walk_strip8.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
  new Sprite('tools_walk_strip8', spriteAssetsPremade('./tools_walk_strip8.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
  //jump
  new Sprite('base_jump_strip9', spriteAssetsPremade('./base_jump_strip9.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
  new Sprite('bowlhair_jump_strip9', spriteAssetsPremade('./bowlhair_jump_strip9.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
  new Sprite('curlyhair_jump_strip9', spriteAssetsPremade('./curlyhair_jump_strip9.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
  new Sprite('longhair_jump_strip9', spriteAssetsPremade('./longhair_jump_strip9.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
  new Sprite('mophair_jump_strip9', spriteAssetsPremade('./mophair_jump_strip9.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
  new Sprite('shorthair_jump_strip9', spriteAssetsPremade('./shorthair_jump_strip9.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
  new Sprite('spikeyhair_jump_strip9', spriteAssetsPremade('./spikeyhair_jump_strip9.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
  new Sprite('tools_jump_strip9', spriteAssetsPremade('./tools_jump_strip9.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
  //dig
  new Sprite('base_dig_strip13', spriteAssetsPremade('./base_dig_strip13.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
  new Sprite('bowlhair_dig_strip13', spriteAssetsPremade('./bowlhair_dig_strip13.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
  new Sprite('curlyhair_dig_strip13', spriteAssetsPremade('./curlyhair_dig_strip13.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
  new Sprite('longhair_dig_strip13', spriteAssetsPremade('./longhair_dig_strip13.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
  new Sprite('mophair_dig_strip13', spriteAssetsPremade('./mophair_dig_strip13.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
  new Sprite('shorthair_dig_strip13', spriteAssetsPremade('./shorthair_dig_strip13.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
  new Sprite('spikeyhair_dig_strip13', spriteAssetsPremade('./spikeyhair_dig_strip13.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
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
  new Sprite('curlyhair_doing_strip8', spriteAssetsPremade('./curlyhair_doing_strip8.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
  new Sprite('longhair_doing_strip8', spriteAssetsPremade('./longhair_doing_strip8.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
  new Sprite('mophair_doing_strip8', spriteAssetsPremade('./mophair_doing_strip8.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
  new Sprite('shorthair_doing_strip8', spriteAssetsPremade('./shorthair_doing_strip8.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
  new Sprite('spikeyhair_doing_strip8', spriteAssetsPremade('./spikeyhair_doing_strip8.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
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
  new Sprite('logo', spriteAssetsPremade('./gmtk-logo-downscale.png'), { spriteWidth: 292, spriteHeight: 160 });
  new Sprite('title', spriteAssetsPremade('./title.png'), { spriteWidth: screenWidth, spriteHeight: screenHeight });
  new Sprite('menu', spriteAssetsPremade('./menu.png'), { spriteWidth: screenWidth, spriteHeight: screenHeight });
  new Sprite('main1', spriteAssetsPremade('./main1.png'), { spriteWidth: screenWidth, spriteHeight: screenHeight });
  new Sprite('main2', spriteAssetsPremade('./main2.png'), { spriteWidth: screenWidth, spriteHeight: screenHeight });
  new Sprite('main3', spriteAssetsPremade('./main3.png'), { spriteWidth: screenWidth, spriteHeight: screenHeight });
  new Sprite('main4', spriteAssetsPremade('./main4.png'), { spriteWidth: screenWidth, spriteHeight: screenHeight });
  new Sprite('main5', spriteAssetsPremade('./main5.png'), { spriteWidth: screenWidth, spriteHeight: screenHeight });
  new Sprite('main6', spriteAssetsPremade('./main6.png'), { spriteWidth: screenWidth, spriteHeight: screenHeight });
  new Sprite('main7', spriteAssetsPremade('./main7.png'), { spriteWidth: screenWidth, spriteHeight: screenHeight });
  new Sprite('main8', spriteAssetsPremade('./main8.png'), { spriteWidth: screenWidth, spriteHeight: screenHeight });
  new Sprite('main9', spriteAssetsPremade('./main9.png'), { spriteWidth: screenWidth, spriteHeight: screenHeight });
  new Sprite('main10', spriteAssetsPremade('./main10.png'), { spriteWidth: screenWidth, spriteHeight: screenHeight });
  new Sprite('main11', spriteAssetsPremade('./main11.png'), { spriteWidth: screenWidth, spriteHeight: screenHeight });
  new Sprite('underground1', spriteAssetsPremade('./underground1.png'), { spriteWidth: screenWidth, spriteHeight: screenHeight });
  new Sprite('underground2', spriteAssetsPremade('./underground2.png'), { spriteWidth: screenWidth, spriteHeight: screenHeight });
  new Sprite('house1', spriteAssetsPremade('./house1.png'), { spriteWidth: screenWidth, spriteHeight: screenHeight });
  new Sprite('house2', spriteAssetsPremade('./house2.png'), { spriteWidth: screenWidth, spriteHeight: screenHeight });

  // items
  new Sprite('volume', spriteAssetsPremade('./volume.png'), { spriteWidth: 32, spriteHeight: 16 });
  new Sprite('button', spriteAssetsPremade('./button.png'), { spriteWidth: 80, spriteHeight: 64 });
  new Sprite('options', spriteAssetsPremade('./options.png'), { spriteWidth: screenWidth, spriteHeight: screenHeight });
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

  // effects
  new Sprite('fire1', spriteAssetsPremade('./spr_deco_fire_01_strip4.png'), { spriteWidth: 5, spriteHeight: 10 });
  new Sprite('fire2', spriteAssetsPremade('./spr_deco_fire_02_strip4.png'), { spriteWidth: 8, spriteHeight: 12 });

  new Sprite('bomb', spriteAssets('./bomb.png'), { spriteWidth: 16, spriteHeight: 16 });
  new Sprite('explosion', spriteAssets('./explosion.png'), { spriteWidth: 32, spriteHeight: 32 });
  new Sprite('arrowV', spriteAssets('./arrowV.png'), { spriteWidth: 8, spriteHeight: 16 });
  new Sprite('arrowH', spriteAssets('./arrowH.png'), { spriteWidth: 16, spriteHeight: 8 });
  new Sprite('shadow', spriteAssets('./shadow.png'), { spriteWidth: 16, spriteHeight: 8, spriteOffsetY: -12 });

  new Sprite('tree', spriteAssetsPremade('./Sunnyside_World_skinny_tree.png'), { spriteWidth: 16, spriteHeight: 16 });

  new Sound('start', wavAssetsPremade('./GAME_MENU_SCORE_SFX001416.ogg'));
  new Sound('dayloop', wavAssetsPremade('./Daytime1Loop.ogg'), true);
  new Sound('caveloop', wavAssetsPremade('./CaveLoop.ogg'), true);
  new Sound('townloop', wavAssetsPremade('./Town1DayLoop.ogg'), true);
  new Sound('houseloop', wavAssetsPremade('./MysteriousTempleLayer3Loop.ogg'), true);
  new Sound('sadloop', wavAssetsPremade('./SadPianoLoop.ogg'), true);
  new Sound('talk', wavAssetsPremade('./MenuCursor01.ogg'));
  new Sound('pause', wavAssetsPremade('./MenuValid01.ogg'));
  new Sound('slash', wavAssetsPremade('./Attack03.ogg'));
  new Sound('dig', wavAssetsPremade('./Attack02.ogg'));
  new Sound('jump', wavAssetsPremade('./Jump03.ogg'));
  new Sound('fall', wavAssetsPremade('./Fall01.ogg'));
  new Sound('hurt', wavAssetsPremade('./Hurt01.ogg'));
  new Sound('harp', wavAssetsPremade('./GuitarStinger4.ogg'));
  new Sound('bow', wavAssets('./bow3.wav'));
  new Sound('smash_pot', wavAssetsPremade('./Fantasy_Game_Action_Smash_Pot_B.ogg'));
  new Sound('cut_grass', wavAssetsPremade('./Fantasy_Game_Attack_Cloth_Armor_Hit_B.ogg'));
  new Sound('fire', wavAssetsPremade('./Fantasy_Game_Magic_Fire_Instant_Cast_Spell_A.ogg'));
  new Sound('explosion', wavAssetsPremade('./explosion_36.ogg'));
})();

const signTexts = [
  [
    'Congratulations on defeating\nthe evil Frogman. The\nKingdom is safe.',
    'But more people are in\nneed of help. Luckily you\nhave gathered many',
    'items across your journey.',
    'Find the correct order\nto give away each item\nso you can help everyone.',
    'PS Gaze into the mirror\nto return here instantly.'
  ],
];

const graveTexts = [
  ['Good morning!'],
  ['It was dark down there.'],
  ['Back from the dead!']
]

export let compassManAlternateDialog = {
  dialog: [
    'Thank you for not\ndestroying my collection\nof pots.',
    'Could you give me your\ncompass so I can go\nsearching for even more?',
    { options: ['Keep compass', 'Give compass'] }
  ],
  postDialog: [
    'Oh boy! Time to look\nfor more pots.'
  ],
}

const npcs = [
  { // 0 default
    dialog: [
      'Hello',
    ],
    postDialog: [
      'Hello!'
    ],
    requestedItem: -1,
    hair: 'shorthair',
    flip: false
  },
  { // 1 Mirror man
    dialog: [
      'I don\'t know how I got\nstuck. Could you spare\nyour mirror?',
      { options: ['Keep mirror', 'Give mirror'] }
    ],
    postDialog: [
      'Thank you!'
    ],
    requestedItem: 7,
    hair: 'shorthair',
    flip: false
  },
  { // 2 Shovel lady
    dialog: [
      'I need a shovel to dig my\ngarden. Could you give\nme yours?',
      { options: ['keep shovel', 'give shovel'] }
    ],
    postDialog: ['Thank you, now it\'s\ntime to get planting.'],
    requestedItem: 0,
    hair: 'longhair',
    flip: false
  },
  { // 3 Bomb lady
    dialog: [
      'A rock slide is blocking\nthe way to my flower.',
      'Could I have your bombs?',
      { options: ['keep bombs', 'give bombs']}
    ],
    postDialog: ['I\'ll need some time\nto gather my nerves.'],
    requestedItem: 9,
    hair: 'longhair',
    flip: false
  },
  { // 4 Glove man
    dialog: [
      'Phew, this sure is heavy.',
      { options: ['Keep glove', 'Give glove'] }
    ],
    postDialog: [
      'That should help a lot!'
    ],
    requestedItem: 6,
    hair: 'spikeyhair',
    flip: false
  },
  { // 5 Feater man
    dialog: [
      'I don\'t know how I\nmanaged to get stuck here.',
      'Hey! That feather looks\nlike could help!',
      { options: ['Keep feather', 'Give feather']}
    ],
    postDialog: ['Thank you!\nNow I can leave.', '...', '......', 'I hope you can too!'],
    requestedItem: 4,
    hair: 'spikeyhair',
    flip: false
  },
  { // 6 Bow man
    dialog: [
      'The drawbridge is up,\nsomeone must be playing\na prank on me.',
      'If you give me your bow,\nI might be able to\nshoot the switch.',
      { options: ['Keep bow', 'Give bow'] }
    ],
    postDialog: [
      'Thanks, you really saved\nme there.'
    ],
    requestedItem: 3,
    hair: 'curlyhair',
    flip: false
  },
  { // 7 Harp lady
    dialog: [
      'That harp looks like it\nwould match nicely on stage.',
      { options: ['Keep harp', 'Give harp'] }
    ],
    postDialog: ['Come back later for\nthe show.'],
    requestedItem: 8,
    hair: 'longhair',
    flip: false
  },
  { // 8 Compass man
    dialog: [
      'You destroyed my\npot collection.',
      'Give me your compass, so\nI can go searching for more.',
      { options: ['Keep compass', 'Give compass'] }
    ],
    postDialog: [
      'Alright, now scram!'
    ],
    requestedItem: 5,
    hair: 'mophair',
    flip: false
  },
  { // 9 Lamp man
    dialog: [
      'It\'s so dark in here.',
      'Hey, is that a lamp?',
      'Mind if I take it?',
      { options: ['Keep lamp', 'Give lamp'] }
    ],
    postDialog: [
      'Thanks, now I can light\nup the room.'
    ],
    requestedItem: 2,
    hair: 'shorthair',
    flip: false
  },
  { // 10 Sword man
    dialog: [
      'That sword looks good\nfor cutting.',
      'My yard could use a trim.',
      { options: ['Keep sword', 'Give sword'] }
    ],
    postDialog: [
      'I\'m going to have the\nbest yard in the kingom!'
    ],
    requestedItem: 1,
    hair: null,
    flip: false
  },
  { // 11 Boss man
    dialog: [
      'I put the barrels and\nfence there while he was\nnapping.',
      'Serves him right for\nsleeping on the job.'
    ],
    postDialog: [],
    requestedItem: -1,
    hair: 'spikeyhair',
    flip: false
  },
]

export const volume = {
  main: 0.2,
  music: 0.5,
  sounds: 0.5,
}

export const scenes = new SceneMap();

export const stopwatch = {
  start: 0,
  end: 0,
  items: 10,
};

export const loopTrack = {
  track: {
    stop: () => {},
    volume: (val: number) => {}
  },
  current: ''
}

export const cutscenes: {[key: string]: Cutscene} = {};

export function getCookies() {
  return document.cookie.split('; ').reduce((prev: { [key: string]: string }, cur) => {
    prev[cur.split('=')[0]] = cur.split('=')[1];
    return prev;
  }, {});
}

async function init() {

  await Sprite.waitForLoad();
  await Sound.waitForLoad();

  let dpi = window.window.devicePixelRatio;
  let viewportScaling = window.visualViewport.width / window.window.innerWidth;

  const cookies = getCookies();
  if (cookies['volume.main']) {
    volume.main = Number.parseFloat(cookies['volume.main']);
  }
  if (cookies['volume.music']) {
    volume.music = Number.parseFloat(cookies['volume.music']);
  }
  if (cookies['volume.sounds']) {
    volume.sounds = Number.parseFloat(cookies['volume.sounds']);
  }

  console.log(`Window dpi scaling: ${dpi}`);
  console.log(`Window viewport width: ${window.visualViewport.width}`);
  console.log(`Window viewport scaling: ${viewportScaling}`);
  console.log(`Window width: ${window.window.innerWidth}`);
  console.log(`Window scaled width: ${window.window.innerWidth * dpi}`);
  let scale = Math.min(Math.floor(window.window.innerHeight * dpi * viewportScaling / 160), Math.floor(window.window.innerWidth * dpi * viewportScaling / 160));

  console.log(`game scale: ${scale}`);

  const view = new Canvas2DView(screenWidth, screenHeight, { scale: scale, bgColor: '#BBBBBB' });

  view.activate();

  view.viewElement().querySelector('canvas').style.marginLeft = 'auto';
  view.viewElement().querySelector('canvas').style.marginRight = 'auto';

  document.getElementById('controls').style.display = 'block';
  document.getElementById('dpad').style.top = `${view.viewElement().getClientRects()[0].bottom}px`;
  document.getElementById('dpad').style.left = `0px`;
  document.getElementById('dpad').style.backgroundImage = `url(${spriteAssetsPremade('./dpad.png')})`;
  document.getElementById('dpad').style.backgroundSize = `cover`;
  document.getElementById('dpad').style.imageRendering = 'pixelated';

  document.getElementById('buttons').style.top = `${view.viewElement().getClientRects()[0].bottom}px`;
  document.getElementById('buttons').style.right = `0px`;
  document.getElementById('buttons').querySelectorAll('div').forEach(div => {
    div.style.backgroundImage = `url(${spriteAssetsPremade('./pad-button.png')})`;
    div.style.backgroundSize = `cover`;
    div.style.imageRendering = 'pixelated';
  });

  document.getElementById('menus').style.top = `${document.getElementById('dpad').getClientRects()[0].bottom}px`;
  document.getElementById('menus').style.left = `${window.visualViewport.width / 2 - 100 - 10}px`;
  document.getElementById('menus').querySelectorAll('div[actions]').forEach((div:HTMLDivElement) => {
    div.style.backgroundImage = `url(${spriteAssetsPremade('./pad-button.png')})`;
    div.style.backgroundSize = `15vw 7.5vw`;
    div.style.imageRendering = 'pixelated';
  });
  document.getElementById('controls').style.display = 'none';

  const intro = new Scene(view);
  intro.addEntity(new BackgroundEntity('title'));
  intro.addEntity(new Title());
  engine.addScene('intro', intro);

  const mainMenu = new Scene(view);
  mainMenu.addController(keyController);
  mainMenu.addController(screenController);
  mainMenu.addController(gamepadController);
  mainMenu.addEntity(new BackgroundEntity('menu'));
  mainMenu.addEntity(new MainMenu());

  engine.addScene('main_menu', mainMenu);

  const settingsMenu = new Scene(view);
  settingsMenu.addController(keyController);
  settingsMenu.addController(screenController);
  settingsMenu.addController(gamepadController);
  settingsMenu.addEntity(new BackgroundEntity('options'));
  settingsMenu.addEntity(new OptionsEntity());

  engine.addScene('settings_menu', settingsMenu);

  const credits = new Scene(view);
  credits.addController(keyController);
  credits.addController(screenController);
  credits.addController(gamepadController);
  credits.addEntity(new Credits());
  credits.addEntity(new StatusBar(null));

  engine.addScene('credits', credits);

  buildMap(view, keyController);

  const time13 = 10 * 13;
  cutscenes['scene1'] = new Cutscene(time13 + 16 + time13 + 16 + time13, (step: number) => {
    const scene = engine.getScene('1,0');
    const npc = engine.getScene('1,0').entitiesByType(Npc)[0];
    if (step == 0) {
      scene.addEntity(new StatusBar(null));
      scene.entitiesByType(TiledBackground).forEach(bg => {
        bg.resetPosition(1, 0);
      });
      scene.entitiesByType(Rock).forEach(rock => scene.removeEntity(rock));
      scene.entitiesByType(Player).forEach(player => player.remove(scene));
      scene.entitiesByType(TextboxEntity).forEach(textbox => scene.removeEntity(textbox));
      npc.moveTo(64, 28);
      npc.setEmotion('none');
      npc.flipHorizontal = false;
    }

    if (step < time13) {
      if (step == 0) {
        npc.imageIndex = 0;
      }
      npc.setAnimation('dig_strip13');
    } else if (step < time13 + 16) {
      npc.setAnimation('walk_strip8');
      npc.move(1, 0);
    } else if (step < time13 + 16 + time13) {
      if (step == time13 + 16) {
        npc.imageIndex = 0;
      }
      npc.setAnimation('dig_strip13');
    } else if (step < time13 + 16 + time13 + 16) {
      npc.setAnimation('walk_strip8');
      npc.move(1, 0);
    } else if (step < time13 + 16 + time13 + 16 + time13) {
      if (step == time13 + 16 + time13 + 16) {
        npc.imageIndex = 0;
      }
      npc.setAnimation('dig_strip13');
    }
  }, '1,0', 'credits', true);

  cutscenes['scene2'] = new Cutscene(30 + 30 + 16 * 3 + 60, (step: number) => {
    const npcs = engine.getScene('-2,0').entitiesByType(Npc);
    if (step == 0) {
      const scene = engine.getScene('-2,0');
      scene.addEntity(new StatusBar(null));
      scene.entitiesByType(TiledBackground).forEach(bg => {
        bg.resetPosition(-2, 0);
      });
      scene.entitiesByType(Player).forEach(player => player.remove(scene));
      scene.entitiesByType(TextboxEntity).forEach(textbox => scene.removeEntity(textbox));
      npcs.filter(npc => npc.isItem(7))[0].moveTo(4 * 16, 4 * 16);
      npcs.forEach(npc => npc.setEmotion('none'));
    } else if (step < 30) {
    } else if (step == 30) {
      npcs.filter(npc => npc.isItem(7))[0].move(6 * 16, 32);
      npcs.filter(npc => npc.isItem(-1))[0].setEmotion('question');
    } else if (step < 30 + 30) {
    } else if (step < 30 + 30 + 16 * 3) {
      npcs.filter(npc => npc.isItem(7))[0].setAnimation('walk_strip8');
      npcs.filter(npc => npc.isItem(7))[0].move(-1, 0);
    } else if (step < 30 + 30 + 16 * 3 + 30) {
      npcs.filter(npc => npc.isItem(7))[0].setEmotion('anger');
      npcs.filter(npc => npc.isItem(-1))[0].flipHorizontal = false;
      npcs.filter(npc => npc.isItem(-1))[0].setEmotion('surprise');
    } else if (step < 30 + 30 + 16 * 3 + 30 + 30) {
      npcs.filter(npc => npc.isItem(-1))[0].setEmotion('sweat');
    } 
  }, '-2,0', 'credits', true);

  cutscenes['scene3'] = new Cutscene(16 + 30 + 10 * 8 + 60, (step: number) => {
    const scene = engine.getScene('u-2,1');
    const npcs = scene.entitiesByType(Npc);
    if (step == 0) {
      scene.addEntity(new StatusBar(null));
      scene.entitiesByType(Rock).forEach(rock => scene.removeEntity(rock));
      scene.entitiesByType(Player).forEach(player => player.remove(scene));
      scene.entitiesByType(TextboxEntity).forEach(textbox => scene.removeEntity(textbox));
      npcs[0].setAnimation('walk_strip8');
      npcs[0].moveTo(7 * 16, 4 * 16);
      npcs.forEach(npc => npc.setEmotion('none'));
    } else if (step < 16) {
      npcs[0].move(0, -1);
    } else if (step < 16 + 30) {
      npcs[0].flipHorizontal = false;
    } else if (step < 16 + 30 + 10 * 8) {
      npcs[0].setAnimation('doing_strip8');
    } else if (step < 16 + 30 + 10 * 8 + 60) {
      if (step == 16 + 30 + 10 * 8) {
        const scene = engine.getScene('u-2,1');
        scene.entitiesByType(TiledBackground).filter(bg => bg.zIndex == -99).forEach(bg => scene.removeEntity(bg));
        scene.addEntity(new Fire(8 * 16 + 5, 2 * 16 + 12));
        npcs[0].setEmotion('happy');
        npcs[0].setAnimation('idle_strip9');
      }
    }
  }, 'u-2,1', 'credits', true);

  cutscenes['scene4'] = new Cutscene(48 + 32 + 32 + 32 + 16 + 32, (step: number) => {
    const npcs = engine.getScene('u-1,0').entitiesByType(Npc);
    if (step == 0) {
      const scene = engine.getScene('u-1,0')
      scene.addEntity(new StatusBar(null));
      scene.entitiesByType(Player).forEach(player => player.remove(scene));
      scene.entitiesByType(TextboxEntity).forEach(textbox => scene.removeEntity(textbox));
      npcs[0].setAnimation('jump_strip9');
      npcs[0].moveTo(8 * 16, 8 * 16);
      npcs[0].imageIndex = 3;
      npcs.forEach(npc => npc.setEmotion('none'));
    } else if (step < 48) {
      npcs[0].move(-1, 0);
    } else if (step < 48 + 32) {
      if (step == 48) {
        npcs[0].imageIndex = 3;
      }
      npcs[0].move(-1, 0);
    } else if (step < 48 + 32 + 32) {
      if (step == 48 + 32) {
        npcs[0].imageIndex = 3;
      }
      npcs[0].move(-1, -1);
    } else if (step < 48 + 32 + 32 + 32) {
      if (step == 48 + 32 + 32) {
        npcs[0].imageIndex = 3;
      }
      npcs[0].move(0, -1);
    } else if (step < 48 + 32 + 32 + 32 + 16) {
      npcs[0].setAnimation('walk_strip8');
      npcs[0].move(0, -1);
    } else if (step < 48 + 32 + 32 + 32 + 16 + 32) {
      npcs.forEach(npc => npc.remove(engine.getScene('u-1,0')));
    }
  }, 'u-1,0', 'credits', true);

  cutscenes['scene5'] = new Cutscene(48 + 32 + 16 + 32 + 112, (step: number) => {
    const npcs = engine.getScene('1,-2').entitiesByType(Npc);
    if (step == 0) {
      const scene = engine.getScene('1,-2');
      scene.entitiesByType(Player).forEach(player => player.remove(scene));
      scene.entitiesByType(TextboxEntity).forEach(textbox => scene.removeEntity(textbox));
      scene.entitiesByType(TiledBackground).forEach(bg => {
        bg.resetPosition(1, -2);
      });
      scene.entitiesByType(Grass).forEach(grass => scene.removeEntity(grass));
      scene.addEntity(new StatusBar(null));
      scene.addEntity(new Arrow(scene, 16 * 1, 5 * 16, 3 * Math.PI / 2));
      npcs[0].moveTo(1 * 16, 6 * 16);
      npcs.forEach(npc => npc.setEmotion('none'));
    } else if (step < 48) { // wait
      if (step == 16) {
        const scene = engine.getScene('1,-2');
        const bridge1 = new GameEntity(new SpritePainter(Sprite.Sprites['tiles'], { spriteWidth: 16, spriteHeight: 16 }), 4 * 16, 4 * 16);
        bridge1.imageIndex = 424;
        scene.addEntity(bridge1);
      } if (step == 32) {
        const scene = engine.getScene('1,-2');
        const bridge2 = new GameEntity(new SpritePainter(Sprite.Sprites['tiles'], { spriteWidth: 16, spriteHeight: 16 }), 4 * 16, 5 * 16);
        bridge2.imageIndex = 424;
        scene.addEntity(bridge2);
      }
    } else if (step < 48 + 16) {
      npcs[0].flipHorizontal = false;
      npcs[0].move(1, 0);
    } else if (step < 48 + 16 + 16) {
      npcs[0].move(0, 1);
    } else if (step < 48 + 16 + 16 + 32) {
      npcs[0].move(1, 0);
    } else if (step < 48 + 32 + 16 + 32 + 112) {
      npcs[0].move(0, -1);
    }
  }, '1,-2', 'credits', true);

  let sound = 0;
  cutscenes['scene6'] = new Cutscene(210 + 64 + 16 + 60, (step: number) => {
    const npcs = engine.getScene('1,1').entitiesByType(Npc);
    if (step == 0) {
      const scene = engine.getScene('1,1');
      scene.entitiesByType(Player).forEach(player => player.remove(scene));
      scene.entitiesByType(TextboxEntity).forEach(textbox => scene.removeEntity(textbox));
      scene.entitiesByType(TiledBackground).forEach(bg => {
        bg.resetPosition(1, 1);
      });
      scene.addEntity(new StatusBar(null));
      npcs[0].flipHorizontal = false;
      npcs[0].moveTo(4 * 16, 6 * 16);
      npcs.forEach(npc => npc.setEmotion('none'));
    }
    if (step == 8) {
      const scene = engine.getScene('1,1');
      let bomb;
      sound = Sound.getVolume();
      Sound.setVolume(0);
      scene.addEntity(bomb = new Bomb(5 * 16, 6 * 16));
      bomb.zIndex = -1000;
    }
    if (step == 16) {
      const scene = engine.getScene('1,1');
      let bomb;
      scene.addEntity(bomb = new Bomb(6 * 16, 7 * 16));
      bomb.zIndex = -1000;
    }
    if (step == 24) {
      const scene = engine.getScene('1,1');
      let bomb;
      scene.addEntity(bomb = new Bomb(7 * 16, 6 * 16));
      bomb.zIndex = -1000;
    }
    if (step >= 24 && step < 24 + 32) {
      npcs[0].flipHorizontal = true;
      npcs[0].move(-1, 0);
    }
    if (step == 24 + 32) {
      npcs[0].flipHorizontal = false;
    }

    if (step == 210) {
      Sound.setVolume(sound);
      npcs[0].zIndex = -200;
      const scene = engine.getScene('1,1');
      const cave = new GameEntity(new SpritePainter(Sprite.Sprites['tiles'], { spriteWidth: 16, spriteHeight: 16 }), 6 * 16, 5 * 16);
      cave.imageIndex = 139;
      cave.zIndex = -100;
      scene.addEntity(cave);
      const grassc = new GameEntity(new SpritePainter(Sprite.Sprites['tiles'], { spriteWidth: 16, spriteHeight: 16 }), 7 * 16, 5 * 16);
      grassc.imageIndex = 66;
      grassc.zIndex = -100;
      scene.addEntity(grassc);
      const cave2 = new GameEntity(new SpritePainter(Sprite.Sprites['tiles'], { spriteWidth: 16, spriteHeight: 16 }), 7 * 16, 5 * 16);
      cave2.imageIndex = 2051;
      cave2.zIndex = -101;
      scene.addEntity(cave2);
      const grass = new GameEntity(new SpritePainter(Sprite.Sprites['tiles'], { spriteWidth: 16, spriteHeight: 16 }), 5 * 16, 6 * 16);
      grass.imageIndex = 66;
      grass.zIndex = -100;
      scene.addEntity(grass);
      const grass2 = new GameEntity(new SpritePainter(Sprite.Sprites['tiles'], { spriteWidth: 16, spriteHeight: 16 }), 6 * 16, 6 * 16);
      grass2.imageIndex = 66;
      grass2.zIndex = -100;
      scene.addEntity(grass2);
      const grass3 = new GameEntity(new SpritePainter(Sprite.Sprites['tiles'], { spriteWidth: 16, spriteHeight: 16 }), 7 * 16, 6 * 16);
      grass3.imageIndex = 66;
      grass3.zIndex = -100;
      scene.addEntity(grass3);
      const grass4 = new GameEntity(new SpritePainter(Sprite.Sprites['tiles'], { spriteWidth: 16, spriteHeight: 16 }), 5 * 16, 7 * 16);
      grass4.imageIndex = 66;
      grass4.zIndex = -100;
      scene.addEntity(grass4);
      const grass5 = new GameEntity(new SpritePainter(Sprite.Sprites['tiles'], { spriteWidth: 16, spriteHeight: 16 }), 6 * 16, 7 * 16);
      grass5.imageIndex = 66;
      grass5.zIndex = -100;
      scene.addEntity(grass5);
    }
    if (step < 210) {

    } else if (step < 210 + 64) {
      npcs[0].move(1, 0);
    } else if (step < 210 + 64 + 16) {
      npcs[0].move(0, -1);
    } else if (step < 210 + 64 + 16 + 60) {
      if (step === 210 + 64 + 16) {
        npcs[0].flipHorizontal = true;
        npcs[0].move(0, -48);
        npcs[0].setEmotion('love');
      }
    }
  }, '1,1', 'credits', true);

  cutscenes['scene7'] = new Cutscene(128, (step: number) => {
    const npcs = engine.getScene('-1,1').entitiesByType(Npc);
    if (step == 0) {
      const scene = engine.getScene('-1,1');
      scene.entitiesByType(Player).forEach(player => player.remove(scene));
      scene.entitiesByType(TextboxEntity).forEach(textbox => scene.removeEntity(textbox));
      scene.entitiesByType(TiledBackground).forEach(bg => {
        bg.resetPosition(-1, 1);
      });
      scene.entitiesByType(Grass).forEach(grass => scene.removeEntity(grass));
      scene.addEntity(new StatusBar(null));
      npcs.forEach(npc => npc.setEmotion('none'));
      npcs[0].setEmotion('happy');
      npcs[0].moveTo(5 * 16, 3 * 16);
    }
  }, '-1,1', 'credits', true);

  cutscenes['scene8'] = new Cutscene(FPS * 3, (step: number) => {
    const scene = engine.getScene('-3,1');
    const npcs = scene.entitiesByType(Npc);
    if (step == 0) {
      scene.entitiesByType(TiledBackground).forEach(bg => {
        bg.resetPosition(-3, 1);
      });
      scene.entitiesByType(Player).forEach(player => player.remove(scene));
      scene.entitiesByType(TextboxEntity).forEach(textbox => scene.removeEntity(textbox));
      scene.entitiesByType(Barrel).forEach(barrel => scene.removeEntity(barrel));
      scene.entitiesByType(HeavyRock).forEach(heavyRock => scene.removeEntity(heavyRock));
      scene.removeEntity(scene.entitiesByType(TiledBackground).filter(bg => bg.zIndex < -90).at(-1));
      scene.addEntity(new StatusBar(null));
      npcs.forEach(npc => npc.setEmotion('none'));

      const floor1 = new GameEntity(new SpritePainter(Sprite.Sprites['tiles'], { spriteWidth: 16, spriteHeight: 16 }), 1 * 16, 7 * 16);
      floor1.imageIndex = 961;
      floor1.zIndex = -100;
      scene.addEntity(floor1);
      const floor2 = new GameEntity(new SpritePainter(Sprite.Sprites['tiles'], { spriteWidth: 16, spriteHeight: 16 }), 2 * 16, 7 * 16);
      floor2.imageIndex = 961;
      floor2.zIndex = -100;
      scene.addEntity(floor2);

      npcs.filter(npc => npc.isItem(6))[0].moveTo(7 * 16, 5 * 16);
      npcs.filter(npc => npc.isItem(6))[0].setEmotion('happy');

      npcs.filter(npc => !npc.isItem(6))[0].moveTo(4 * 16, 5 * 16);
      npcs.filter(npc => !npc.isItem(6))[0].flipHorizontal = false;
      npcs.filter(npc => !npc.isItem(6))[0].setEmotion('sweat');
    }
  }, '-3,1', 'credits', true);

  let npc1: Npc, npc2: Npc, npc3: Npc;

  cutscenes['scene9'] = new Cutscene(16 + 16 + 16 + 16 + 32 + 120 + 1, (step: number) => {
    const npcs = engine.getScene('h-3,0').entitiesByType(Npc);
    if (step == 0) {
      const scene = engine.getScene('h-3,0');
      scene.addEntity(new StatusBar(null));
      scene.entitiesByType(Player).forEach(player => player.remove(scene));
      scene.entitiesByType(TextboxEntity).forEach(textbox => scene.removeEntity(textbox));
      if (!npc1) {
        npc1 = new Npc(scene, 4 * 16, 9 * 16, [], [], -1, 'spikeyhair', false);
        npc1.flipHorizontal = false;
        npc2 = new Npc(scene, 4 * 16, 9 * 16, [], [], -1, 'curlyhair', false);
        npc2.flipHorizontal = false;
        npc3 = new Npc(scene, 4 * 16, 9 * 16, [], [], -1, 'mophair', false);
        npc3.flipHorizontal = false;
      }
      npcs.forEach(npc => npc.setEmotion('none'));
      scene.addEntity(npc1);
    } else if (step < 16) {
      npc1.move(0, -1);
    } else if (step < 16 + 16) {
      npc1.move(0, -1);
      if (step == 16) {
        const scene = engine.getScene('h-3,0');
        scene.addEntity(npc2);
      }
      npc2.move(0, -1);
    } else if (step < 16 + 16 + 16) {
      npc1.move(0, -1);
      if (step == 16 + 16) {
        const scene = engine.getScene('h-3,0');
        scene.addEntity(npc3);
      }
      npc2.move(0, -1);
      npc3.move(0, -1);
    } else if (step < 16 + 16 + 16 + 16) {
      npc1.move(0, -1);
      npc2.move(1, 0);
      npc3.move(1, 0);
    } else if (step < 16 + 16 + 16 + 16 + 32) {
      npc2.move(1, 0);
    } else {
      npc1 = undefined;
      npc2.flipHorizontal = true;
    }
  }, 'h-3,0', 'credits', true);

  cutscenes['scene10'] = new Cutscene(120, (step: number) => {
    if (step == 0) {
      const scene = engine.getScene('1,-1');
      scene.entitiesByType(TiledBackground).forEach(bg => {
        bg.resetPosition(1, -1);
      });
      scene.addEntity(new StatusBar(null));
      scene.entitiesByType(Player).forEach(player => player.remove(scene));
      scene.entitiesByType(TextboxEntity).forEach(textbox => scene.removeEntity(textbox));
      scene.entitiesByType(Skeleton).forEach(npc => npc.setEmotion('none'));
    }
  }, '1,-1', 'credits', true);

  engine.switchToScene('main_menu');

  Sound.setVolume(0.1);

  engine.addAction('transition', () => {

    if (screenTransition.activate) {
      screenTransition.active = true;
      screenTransition.activate = false;
    } else if (screenTransition.timer >= 0) {
      if (screenTransition.active && screenTransition.action === 'slide') {
        const scene = screenTransition.scene;
        const direction = screenTransition.direction;
        const totalTime = screenTransition.totalTime;
        if (screenTransition.timer > 0) {
          scene.entitiesByType(GameEntity).forEach(entity => entity.move(Math.round(Math.cos(direction) * 16), Math.round(Math.sin(direction) * 16)));
          screenTransition.timer--;
        }
        if (screenTransition.timer == 0) {
          const nextCoords = scene.entitiesByType(Player)[0].getWorldCoords();
          scene.entitiesByType(TiledBackground).forEach(entity => entity.resetPosition(nextCoords.x, nextCoords.y));

          screenTransition.timer--;
          engine.switchToScene(engine.sceneKey(screenTransition.nextScene));
          screenTransition.nextScene.entitiesByType(Player)[0].respawn();
          playTrackForScene(engine.sceneKey(screenTransition.nextScene));
        }
      } else if (screenTransition.active && screenTransition.action === 'fade') {
        if (screenTransition.timer >= 0) {
          screenTransition.timer--;
        }
      } 
    } 
    else if (screenTransition.timer == -1) {
      screenTransition.timer--;
      console.log('inactive');
      screenTransition.active = false;
      if (screenTransition.action === 'slide') {
        const scene = screenTransition.scene;
        const direction = screenTransition.direction;
        const totalTime = screenTransition.totalTime;
        const nextCoords = scene.entitiesByType(Player)[0].getWorldCoords();
        scene.entitiesByType(GameEntity).filter(entity => entity instanceof Player == false).forEach(entity => entity.move(-Math.round(Math.cos(direction) * 16 * totalTime), -Math.round(Math.sin(direction) * 16 * totalTime)));
        scene.entitiesByType(TiledBackground).forEach(entity => entity.resetPosition(nextCoords.x, nextCoords.y));
      }
    }
  });

  console.log('loaded game');

  Sound.Sounds['start'].play();

  await engine.start();
}

export function playTrackForScene(nextScene: string) {
  const worldCoords = engine.getScene(nextScene).entitiesByType(Player)[0].getWorldCoords();
  if (nextScene.indexOf('u') != -1) {
    changeLoop('underground');
  } else if (nextScene.indexOf('h') != -1) {
    changeLoop('house');
  } else if (worldCoords.x < -1 || worldCoords.y < -1) {
    changeLoop('town');
  } else if (worldCoords.y == -1) {
    changeLoop('grave');
  } else {
    changeLoop('overworld');
  }
}

export function stopLoop() {
  loopTrack.track.stop();
}

export function restartLoop() {
  loopTrack.track = Sound.Sounds[loopTrack.current].play();
}

export function changeLoop(place: 'overworld' | 'town' | 'underground' | 'house' | 'grave') {
  let track = 'dayloop';
  switch (place) {
    case 'overworld':
      track = 'dayloop';
      break;
    case 'town':
      track = 'townloop';
      break;
    case 'underground':
      track = 'caveloop';
      break;
    case 'grave':
      track = 'sadloop';
      break;
    case 'house':
      track = 'houseloop';
      break;
  }

  if (loopTrack.current != track) {
    loopTrack.track.stop();
    Sound.setVolume(volume.main * volume.music);
    loopTrack.track = Sound.Sounds[track].play();
    Sound.setVolume(volume.main * volume.sounds);
    loopTrack.current = track;
  }
}

export function transitionSlide(scene: Scene, nextScene: Scene, direction: number, lastWorldX: number, lastWorldY: number) {
  screenTransition.activate = true;
  screenTransition.scene = scene;
  screenTransition.nextScene = nextScene;
  screenTransition.direction = direction;
  screenTransition.totalTime = direction == Math.PI || direction == 0 ? 10 : 9;
  screenTransition.timer = screenTransition.totalTime;
  screenTransition.action = 'slide';
  nextScene.entitiesByType(TiledBackground).forEach(bg => {
    scene.addEntity(bg);
    bg.resetPosition(lastWorldX, lastWorldY);
  });
}

export function transitionFade(scene: Scene, nextScene: Scene, sound = true) {
  screenTransition.activate = true;
  screenTransition.scene = scene;
  screenTransition.nextScene = nextScene;
  screenTransition.direction = 0;
  screenTransition.totalTime = 10;
  screenTransition.timer = screenTransition.totalTime;
  screenTransition.action = 'fade';
  engine.switchToScene(engine.sceneKey(nextScene));
  fadeEntity.reset();
  nextScene.addEntity(fadeEntity);
  if (sound) {
    Sound.Sounds['slash'].play();
  }
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
  {
    binding: new ControllerBinding<undefined>('restart'),
    keys: ['Escape'],
  },
];

export const keyController = new KeyboardController(keyMap);

const gamepadMap = [
  {
    binding: new ControllerBinding<{ value: number }>('action1'),
    buttons: [
      { type: 'buttons', index: 1 },
    ],
  },
  {
    binding: new ControllerBinding<{ value: number }>('action2'),
    buttons: [
      { type: 'buttons', index: 0 },
    ],
  },
  {
    binding: new ControllerBinding<{ value: number }>('up'),
    buttons: [
      { type: 'buttons', index: 12 },
    ],
  },
  {
    binding: new ControllerBinding<{ value: number }>('down'),
    buttons: [
      { type: 'buttons', index: 13 },
    ],
  },
  {
    binding: new ControllerBinding<{ value: number }>('left'),
    buttons: [
      { type: 'buttons', index: 14 },
    ],
  },
  {
    binding: new ControllerBinding<{ value: number }>('right'),
    buttons: [
      { type: 'buttons', index: 15 },
    ],
  },
  {
    binding: new ControllerBinding<{ value: number }>('pause'),
    buttons: [
      { type: 'buttons', index: 9 },
    ],
  },
  {
    binding: new ControllerBinding<{ value: number }>('restart'),
    buttons: [
      { type: 'buttons', index: 8 },
    ],
  },
  // {
  //   binding: new ControllerBinding<{ value: number }>('axis1'),
  //   buttons: [
  //     { type: 'axes', index: 0 },
  //   ],
  // },
  // {
  //   binding: new ControllerBinding<{ value: number }>('axis2'),
  //   buttons: [
  //     { type: 'axes', index: 1 },
  //   ],
  // }
];
export const gamepadController = new GamepadController(gamepadMap);

const screenControllerMap = [
  {
    binding: new ControllerBinding<undefined>('left'),
    keys: ['left'],
  },
  {
    binding: new ControllerBinding<undefined>('right'),
    keys: ['right'],
  },
  {
    binding: new ControllerBinding<undefined>('up'),
    keys: ['up'],
  },
  {
    binding: new ControllerBinding<undefined>('down'),
    keys: ['down'],
  },
  {
    binding: new ControllerBinding<undefined>('sprint'),
    keys: ['shift'],
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
    keys: ['start'],
  },
  {
    binding: new ControllerBinding<undefined>('restart'),
    keys: ['select'],
  },
];
export const screenController = new ScreenController(screenControllerMap);

export function buildMap(view: View, keyController: KeyboardController) {
  buildMapNew(view, keyController);
  win.active = false;
}

export function buildMapNew(view: View, keyController: KeyboardController) {
  scenes.clear();
  const scenePause = new Scene(view);
  scenePause.addController(keyController);
  scenePause.addController(screenController);
  scenePause.addController(gamepadController);
  engine.addScene('pause', scenePause);
  scenePause.addEntity(new BackgroundEntity('inventory'));
  scenePause.addEntity(new PauseMenu());

  const parser = new DOMParser();
  const docWorld = parser.parseFromString(world, 'text/xml');
  const docHouses = parser.parseFromString(houses, 'text/xml');
  const docUnderground = parser.parseFromString(underground, 'text/xml');

  [{doc: docWorld, key: ''}, {doc: docHouses, key: 'h'}, {doc: docUnderground, key: 'u'}].forEach(docData => {
    const doc = docData.doc;
    const objects = doc.querySelectorAll('object');

    doc.querySelectorAll('layer').forEach(layer => {
      const layerId = Number.parseInt(layer.getAttribute('id') || '0');
      const layerName = layer.getAttribute('name');
      const isOverhead = layerName === 'Overheads' || layerName === 'Overheads2' || layerName === 'UIs';
      let zIndex = 0;
      switch (layerName) {
        case 'Overheads':
          zIndex = -89;
          break;
        case 'Overheads2':
          zIndex = -99;
          break;
        case 'UIs':
          zIndex = -99;
          break;
      }
      layer.querySelectorAll('chunk').forEach(chunk => {
        const worldX = Number.parseInt(chunk.getAttribute('x')) / 10;
        const worldY = Number.parseInt(chunk.getAttribute('y')) / 9;
        if (scenes.getSceneByKey(`${docData.key}${worldX},${worldY}`)) {
          const scene = scenes.getSceneByKey(`${docData.key}${worldX},${worldY}`).scene;
          scene.addEntity(new TiledBackground(worldX, worldY, chunk.innerHTML.split(',').map(val => Number.parseInt(val)), zIndex));
          return;
        }

        console.log(`Adding chunk: ${docData.key}${worldX},${worldY}`);

        const scene = new Scene(view);
        scene.addController(keyController);
        scene.addController(screenController);
        scene.addController(gamepadController);

        const resetter = new EntityResetter(scene);

        scene.addEntity(new TiledBackground(worldX, worldY, chunk.innerHTML.split(',').map(val => Number.parseInt(val)), zIndex));
        scene.addEntity(fadeEntity);

        engine.addScene(`${docData.key}${worldX},${worldY}`, scene);
        scenes.setScene(scene, `${docData.key}${worldX},${worldY}`, worldX, worldY, resetter);
      })
    });

    objects.forEach(object => {
      const type = object.getAttribute('type');
      let x = Number.parseInt(object.getAttribute('x'));
      let y = Number.parseInt(object.getAttribute('y')) - (Number.parseInt(object.getAttribute('gid') || '0') != 0 ? Number.parseInt(object.getAttribute('height') || '0') : 0) // subtract height from tile objects;
      const sceneData = scenes.getSceneByKey(`${docData.key}${Math.floor(x / 160)},${Math.floor(y / 144)}`);
      x = x % 160;
      y = y % 144;

      x = x >= 0 ? x : 160 + x;
      y = y >= 0 ? y : 144 + y;
      //y = y + (Number.parseInt(object.getAttribute('gid') || '0') == 0 ? 16 : 0); // add 16 to rectangles (Walls and such)
      y += 16;

      const width = Number.parseInt(object.getAttribute('width') || '0');
      const height = Number.parseInt(object.getAttribute('height') || '0');
      switch (type) {
        case 'Grass':
          sceneData.scene.addEntity(sceneData.resetter.add(new Grass(x, y)));
          break;
        case 'Pot':
          sceneData.scene.addEntity(sceneData.resetter.add(new Pot(x, y)));
          break;
        case 'Hole':
          sceneData.scene.addEntity(sceneData.resetter.add(new Hole(sceneData.scene, x, y, Number.parseInt(object.getAttribute('gid') || '0') - 1)));
          break;
        case 'HeavyRock':
          sceneData.scene.addEntity(sceneData.resetter.add(new HeavyRock(x, y)));
          break;
        case 'Rock':
          sceneData.scene.addEntity(sceneData.resetter.add(new Rock(x, y)));
          break;
        case 'Barrel':
          sceneData.scene.addEntity(sceneData.resetter.add(new Barrel(x, y)));
          break;
        case 'Tree':
          sceneData.scene.addEntity(sceneData.resetter.add(new Tree(x, y)));
          break;
        case 'PermaFire':
          sceneData.scene.addEntity(sceneData.resetter.add(new PermaFire(x, y)));
          break;
        case 'Portal':
          const portal = new Portal(x, y, Number.parseInt(object.querySelector('property[name=destX]').getAttribute('value') || '0'), Number.parseInt(object.querySelector('property[name=destY]').getAttribute('value') || '0'));
          sceneData.scene.addEntity(sceneData.resetter.add(portal));
          sceneData.resetter.addAction(() => {
            if (!statefulMode.enabled) {
              portal.deactivate();
            }
          });
          break;
        case 'Grave':
          sceneData.scene.addEntity(sceneData.resetter.add(new Grave(x, y, width, height, graveTexts[Number.parseInt(object.querySelector('property[name=graveIndex]').getAttribute('value'))])));
          break;
        case 'Sign':
          sceneData.scene.addEntity(sceneData.resetter.add(new Sign(sceneData.scene, x, y, 
            [
              statefulMode.enabled ? 'Welcome to easy mode.\nDestroying Grass/Pots/etc.\nis permanent. Have fun!' : undefined,
              ...signTexts[Number.parseInt(object.querySelector('property[name=textIndex]').getAttribute('value'))]
            ].filter(val => val)
            )));
          break;
        case 'Door':
          const destSceneKey = object.querySelector('property[name=sceneKey]')?.getAttribute('value') || '0,0';
          const destX = Number.parseInt(object.querySelector('property[name=destX]')?.getAttribute('value') || '0');
          const destY = Number.parseInt(object.querySelector('property[name=destY]')?.getAttribute('value') || '0');
          const worldX = Number.parseInt(object.querySelector('property[name=worldX]')?.getAttribute('value') || '0');
          const worldY = Number.parseInt(object.querySelector('property[name=worldY]')?.getAttribute('value') || '0');
          sceneData.scene.addEntity(sceneData.resetter.add(new Door(x, y, destSceneKey, destX, destY, worldX, worldY)));
          break;
        case 'Stairs':
          const stairs = new Stairs(x, y, 0, 806, Number.parseInt(object.getAttribute('id') || '0'));
          sceneData.scene.addEntity(sceneData.resetter.add(stairs));
          sceneData.resetter.addAction(() => {
            if (!statefulMode.enabled) {
              stairs.deactivate();
            }
          });
          break;
        case 'Switch':
          const activationId = Number.parseInt(object.querySelector('property[name=activationId]')?.getAttribute('value') || '0');
          sceneData.scene.addEntity(sceneData.resetter.add(new Switch(x, y, () => sceneData.scene.entitiesSlice(e => true).forEach(entity => entity instanceof Stairs && entity.activationId == activationId && entity.activate()))));
          break;
        case 'Wall':
          sceneData.scene.addEntity(sceneData.resetter.add(new Wall(x, y, width, height)));
          break;
        case 'HalfWall':
          sceneData.scene.addEntity(sceneData.resetter.add(new HalfWall(x, y, width, height)));
          break;
        case 'Player':
          sceneData.scene.addEntity(sceneData.resetter.add(new Player(sceneData.scene, x, y)));
          break;
        case 'Npc':
          const npcData = npcs[Number.parseInt(object.querySelector('property[name=npcIndex]')?.getAttribute('value') || '0')];

          console.log(npcData);
          sceneData.scene.addEntity(sceneData.resetter.add(new Npc(
            sceneData.scene,
            x,
            y,
            npcData.dialog,
            npcData.postDialog,
            npcData.requestedItem,
            npcData.hair,
            npcData.flip
          )));
          break;
      }
    });
  });
  
}


export class EntityResetter {
  private entities: Entity[] = [];
  private entityActions: ((entity: Entity) => void)[] = [];
  private actions: (() => void)[] = [];

  constructor(private scene: Scene) {

  }

  add(entity: Entity): Entity {
    this.entities.push(entity);
    return entity;
  }

  addEntityAction(action: (entity: Entity) => void) {
    this.entityActions.push(action);
  }

  addAction(action: () => void) {
    this.actions.push(action);
  }

  reset() {
    if (!statefulMode.enabled) {
      this.entities.forEach(entity => {
        this.scene.addEntity(entity);
        if (entity instanceof Interactable) {
          entity.reset();
        }
        this.entityActions.forEach(act => {
          act(entity);
        })
      });
    }

    this.actions.forEach(act => {
      act();
    })
  }
}

init();