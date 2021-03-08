class Scene1 extends BaseScene {
    constructor(){
        super("bootGame");
    }
    
    preload(){
        this.load.spritesheet('tileset', 'assets/images/Tileset80.png',{ frameWidth: 80, frameHeight: 80 });
        this.load.spritesheet('characters', 'assets/images/characters.png',{ frameWidth: 320, frameHeight: 320 });
        this.load.spritesheet('bullets', 'assets/images/bullets.png',{ frameWidth: 240, frameHeight: 240 });
        this.load.spritesheet('icons', 'assets/images/icons120.png',{ frameWidth: 120, frameHeight: 120 });
        this.load.spritesheet('btns120', 'assets/images/btns120.png',{ frameWidth: 480, frameHeight: 120 });
        this.load.spritesheet('heartui', 'assets/images/icons320.png',{ frameWidth: 160, frameHeight: 320 });
        this.load.spritesheet('iconsui', 'assets/images/icons320.png',{ frameWidth: 320, frameHeight: 320 });
        this.load.image('planet', 'assets/images/planet.png');
        this.load.image('starfield', 'assets/images/starfield.png');
        this.load.image('battlefield', 'assets/images/battlefield.png');
        this.load.image('window1', 'assets/images/Win1.png');
        this.load.image('window2', 'assets/images/Win2.png');
        this.load.image('window3', 'assets/images/Win3.png');
        this.load.image('box1', 'assets/images/Box1.png');
        this.load.image('box2', 'assets/images/Box2.png');
        this.load.tilemapTiledJSON('map', 'assets/json/tileset80.json');
        this.load.plugin('rexshakepositionplugin', 'js/rexshakepositionplugin.min.js', true);
        this.load.json('monsters', 'assets/json/monsters.json');
        this.load.json('itens', 'assets/json/itens.json');
        this.load.json('txt', 'assets/json/txt_'+language+'.json');

        //Loading control
        var loadingText = this.add.text(20,20, "Please wait...",txtStyle1);

        this.load.on('progress', this.progress, {loadingText:loadingText});
		this.load.on('complete', this.complete, this);
    }

    create(){
    }

    progress(percentage){
        percentage = percentage * 100;
        this.loadingText.text = "Loading: "+percentage.toFixed(2)+"%";
    }

    complete(){
        //this.loadingText.text = "Welcome to Tiny Quest!";
        
        this.fade(false, 1000, 0,0,0, () => {
            this.scene.start("playGame");
        });
    }
}