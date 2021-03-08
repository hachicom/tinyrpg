class SceneP extends BaseScene {
    constructor(){
        super("pauseGame");
    }

    create(){
        console.log(playerdata);
        
        // playerdata.hp;
        // playerdata.maxhp;
        // playerdata.mp;
        // playerdata.maxmp;
        // playerdata.atk;
        // playerdata.def;
        // playerdata.spd;
        // playerdata.gold;
        // playerdata.dead;
        // playerdata.shield;
        // playerdata.inventory;

        //elementos gráticos
        this.graphics = this.add.graphics();
        this.graphics.fillStyle(0x000000, 0.75);
        this.graphics.fillRectShape(new Phaser.Geom.Rectangle(0, 80, game.config.width, game.config.height));
        
        this.statusbox = this.add.image(0,80,"box1").setOrigin(0,0);
                
        this.pauseBtn = this.add.image(720,0,'icons',5).setOrigin(0,0);
        this.pauseBtn.scale = 0.75;
        this.pauseBtn.setInteractive().on('pointerdown', this.unpause, this);

        //texto
        this.txtDB = this.cache.json.get('txt');
        this.atkLbl = this.add.text(320,220, this.txtDB['ATAQUE']+": ",txtStyle4).setOrigin(1,0);
        this.atkTxt = this.add.text(340,220, playerdata.atk,txtStyle4);
        this.defLbl = this.add.text(320,280, this.txtDB['DEFESA']+": ",txtStyle4).setOrigin(1,0);
        this.defTxt = this.add.text(340,280, playerdata.def,txtStyle4);
        this.spdLbl = this.add.text(320,340, this.txtDB['VELOCIDADE']+": ",txtStyle4).setOrigin(1,0);
        this.spdTxt = this.add.text(340,340, playerdata.spd,txtStyle4);
        this.goldTxt = this.add.text(80,780, playerdata.gold+"G",txtStyle4);

        this.input.keyboard.on('keyup-SPACE', this.unpause, this);
    }

    unpause(){
        this.scene.resume('playGame');
        this.scene.stop();
    }
}