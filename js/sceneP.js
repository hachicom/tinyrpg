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

        //tempVars
        this.wpnTxt = "-";
        this.shdTxt = "-";
        this.btsTxt = "-";
        if (typeof playerdata.inventory.weapon["level"] != 'undefined'){
            this.wpnTxt = this.txtDB[playerdata.inventory.weapon.name];
        }
        if (typeof playerdata.inventory.shield["level"] != 'undefined'){
            this.shdTxt = this.txtDB[playerdata.inventory.shield.name];
        }
        if (typeof playerdata.inventory.boot["level"] != 'undefined'){
            this.btsTxt = this.txtDB[playerdata.inventory.boot.name];
        }

        //texto
        this.txtDB = this.cache.json.get('txt');
        this.attrLbl = this.add.text(80,160, this.txtDB['ATTRIB'],txtStyle4);
        this.equipLbl = this.add.text(400,160, this.txtDB['EQUIP'],txtStyle4);

        this.atkLbl = this.add.text(320,220, this.txtDB['ATAQUE']+": ",txtStyle4).setOrigin(1,0);
        this.atkTxt = this.add.text(340,220, playerdata.atk,txtStyle4);
        this.wpnTxt = this.add.text(400,220, this.wpnTxt,txtStyle4);

        this.defLbl = this.add.text(320,280, this.txtDB['DEFESA']+": ",txtStyle4).setOrigin(1,0);
        this.defTxt = this.add.text(340,280, playerdata.def,txtStyle4);
        this.wpnTxt = this.add.text(400,280, this.shdTxt,txtStyle4);

        this.spdLbl = this.add.text(320,340, this.txtDB['VELOCIDADE']+": ",txtStyle4).setOrigin(1,0);
        this.spdTxt = this.add.text(340,340, playerdata.spd,txtStyle4);
        this.wpnTxt = this.add.text(400,340, this.btsTxt,txtStyle4);

        this.mrclLbl = this.add.text(80,460, this.txtDB['MIRACLES'],txtStyle4);
        //this.goldTxt = this.add.text(720,640, playerdata.gold+" gp",txtStyle4).setOrigin(1,0);

        this.optnLbl = this.add.text(400,460, this.txtDB['OPTIONS'],txtStyle4);

        this.input.keyboard.on('keyup-SPACE', this.unpause, this);
    }

    unpause(){
        this.scene.resume('playGame');
        this.scene.stop();
    }
}