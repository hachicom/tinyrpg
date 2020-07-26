class Scene2 extends BaseScene {
    constructor(){
        super("playGame");
    }

    init(){
        this.mapa = [
            [9,9,9,9,9,9,9,9,9],
            [9,9,9,9,0,9,9,9,9],
            [9,0,0,0,0,0,0,0,9],
            [9,0,0,0,0,0,0,0,9],
            [9,0,0,0,0,0,0,0,9],
            [9,0,0,0,0,0,0,0,9],
            [9,0,0,0,0,0,0,0,9],
            [9,0,0,0,0,0,0,0,9],
            [9,0,0,0,0,0,0,0,9],
            [9,0,0,0,0,0,0,0,9],
            [9,0,0,0,0,0,0,0,9],
            [9,9,9,9,0,9,9,9,9],
            [9,9,9,9,9,9,9,9,9],
        ];
        this.modo = 'comando'; //comando,mover,resolver,comprar,esperar
        this.battlemode = 'inicio';
        this.movebuttons = [];
        this.coluna = 4;
        this.linha = 1;
        this.moveX = 0;
        this.moveY = 0;
        this.moveSpeed = 4;

        this.fade(true, 1000, 0,0,0, false);
    }

    preload(){
        this.load.spritesheet('tileset', 'assets/images/Tileset80.png',{ frameWidth: 80, frameHeight: 80 });
        this.load.spritesheet('characters', 'assets/images/characters.png',{ frameWidth: 320, frameHeight: 320 });
        this.load.spritesheet('bullets', 'assets/images/bullets.png',{ frameWidth: 240, frameHeight: 240 });
        this.load.spritesheet('icons', 'assets/images/icons120.png',{ frameWidth: 120, frameHeight: 120 });
        this.load.spritesheet('iconsui', 'assets/images/icons320.png',{ frameWidth: 160, frameHeight: 320 });
        this.load.image('planet', 'assets/images/planet.png');
        this.load.image('starfield', 'assets/images/starfield.png');
        this.load.image('battlefield', 'assets/images/battlefield.png');
        this.load.image('txtbox', 'assets/images/Txtbox.png');
        this.load.tilemapTiledJSON('map', 'assets/json/tileset80.json');
        this.load.plugin('rexshakepositionplugin', 'js/rexshakepositionplugin.min.js', true);
    }

    create(){
        this.createStage();
        this.createMoveButtons();

        const posicao = this.placeOnMap(this.coluna,this.linha);        
        this.playericon = this.physics.add.sprite(posicao.x,posicao.y,'characters',0).setOrigin(0,0);
        this.playericon.scale = 0.25;

        this.positions = [(game.config.width/2) - 80,(game.config.width/2) + 80];
        
        //battle sprites
        this.battlefield = new Battlefield({scene:this});
        this.enemy = new Enemy({scene:this,x:game.config.width/2,y:200});
        this.player = new Player({scene:this,x:(game.config.width/2) - 80,y:game.config.height - 320});
        this.projectiles = this.add.group();
        this.createMiracleButtons();

        //UI Sprites        
        this.messenger = new Messenger({scene:this});
        this.createUIelements();
        //this.debugmovimento = this.add.text(10,10, "moveX, moveY, Modo",txtStyle2);

        //colisões       
        this.physics.add.overlap(this.playericon, this.blocks, this.hitBlock, null, this);
        this.physics.add.overlap(this.player, this.enemy, this.hitEnemy, null, this);
        this.physics.add.overlap(this.projectiles, this.player, this.hitPlayer, null, this);

        //input
        this.input.mouse.disableContextMenu();
        this.input.on('pointerdown', function (pointer) {
            if (this.messenger.estaEmCena){
                this.messenger.updateMessage();
            }
            if (this.modo == 'batalhar'){
                this.controlBattle(pointer);
            }
        },this);

        //effects
        this.shakenemy = this.plugins.get('rexshakepositionplugin').add(this.enemy, {
            // mode: 1, // 0|'effect'|1|'behavior'
            magnitude: 10,
            // magnitudeMode: 1, // 0|'constant'|1|'decay'
        });

        //timers
        //this.shootTimer = this.time.addEvent({ delay: 500, callback: onEvent, callbackScope: this, loop: true });
    }

    update() {
        this.starfield.tilePositionX += 0.5;
        this.starfield.tilePositionY += 0.5;
        this.updateUI();

        //this.debugmovimento.text = this.moveX+','+this.moveY+' - '+this.modo;

        switch(this.modo){
            case 'comando':
                //this.moveBtns.setVisible(true);
                this.showMoveButtons();
                break;
            case 'mover':
                //this.moveBtns.setVisible(false);
                this.hideMoveButtons();
                this.movePlayer(this.playericon);
                break;
            case 'resolver':
                break;
            case 'batalhar':
                this.player.updatePosition();
                break;
            case 'comprar':
                break;
            case 'esperar':
                break;
            
        }
    }

    createStage(){
        this.starfield = this.add.tileSprite(0,0, game.config.width, game.config.height,"starfield");
        this.starfield.setOrigin(0,0);
        this.starfield.setScrollFactor(0);
        
        let planet = this.add.image(this.cameras.main.width/2, this.cameras.main.height/2,"planet");
        planet.originX = 0.5;
        planet.originY = 0.5;

        var map = this.make.tilemap({ key: 'map' });
        var Tiles = map.addTilesetImage('Tileset80', 'tileset');
        map.createStaticLayer('floor', Tiles, 40, 80);
        map.createStaticLayer('walls', Tiles, 40, 80);
        
        this.blocks = this.add.group({});
        
        const blocksObjects = map.getObjectLayer('blocks')['objects'];        
        blocksObjects.forEach(obj => {
            const block = this.physics.add.sprite(obj.x + 40, obj.y + 80 - obj.height,'tileset',9).setOrigin(0,0);
            this.blocks.add(block);
        });
    }

    createMoveButtons(){
        let posicao = this.placeOnMap(4,2);
        let areaDown = this.add.image(posicao.x,posicao.y,'tileset',11).setOrigin(0,0);
        areaDown.setInteractive().on('pointerdown', function(pointer){
            this.move(this,0,80,1,0);
        }, this);
        this.movebuttons.push(areaDown);

        posicao = this.placeOnMap(3,1); 
        let areaLeft = this.add.image(posicao.x,posicao.y,'tileset',11).setOrigin(0,0);
        areaLeft.setInteractive().on('pointerdown', function(pointer){
            this.move(this,-80,0,0,-1);
        }, this);
        this.movebuttons.push(areaLeft);
        
        posicao = this.placeOnMap(5,1); 
        let areaRight = this.add.image(posicao.x,posicao.y,'tileset',11).setOrigin(0,0);
        areaRight.setInteractive().on('pointerdown', function(pointer){
            this.move(this,80,0,0,1);
        }, this);
        this.movebuttons.push(areaRight);
        
        posicao = this.placeOnMap(4,0); 
        let areaUp = this.add.image(posicao.x,posicao.y,'tileset',11).setOrigin(0,0);
        areaUp.setInteractive().on('pointerdown', function(pointer){
            this.move(this,0,-80,-1,0);
        }, this);
        this.movebuttons.push(areaUp);        

        var tween = this.tweens.add({
            targets: this.movebuttons,
            alpha: { from: 0, to: 1 },
            ease: 'Linear',
            duration: 1000,
            repeat: -1,
            yoyo: true
        });
    }

    createMiracleButtons(){
        this.miracleButtons = this.add.group();
        let healBtn = this.add.image(game.config.width/2 - 320,game.config.height - 160,'icons',0).setOrigin(0,0);
        healBtn.setInteractive().on('pointerdown', function(pointer){
            this.callMiracle('heal');
        }, this);
        this.miracleButtons.add(healBtn);  
        
        let clearBtn = this.add.image(healBtn.x + 140,game.config.height - 160,'icons',1).setOrigin(0,0);
        clearBtn.setInteractive().on('pointerdown', function(pointer){
            this.callMiracle('clear');
        }, this);
        this.miracleButtons.add(clearBtn); 
        
        let mightBtn = this.add.image(clearBtn.x + 140,game.config.height - 160,'icons',2).setOrigin(0,0);
        mightBtn.setInteractive().on('pointerdown', function(pointer){
            this.callMiracle('might');
        }, this);
        this.miracleButtons.add(mightBtn); 
        
        let protectBtn = this.add.image(mightBtn.x + 140,game.config.height - 160,'icons',3).setOrigin(0,0);
        protectBtn.setInteractive().on('pointerdown', function(pointer){
            this.callMiracle('protect');
        }, this);
        this.miracleButtons.add(protectBtn); 

        let miracleTxt = this.add.text(protectBtn.x + 140,game.config.height - 180, "x 3",txtStyle1).setOrigin(0,0);
        this.miracleButtons.add(miracleTxt);

        this.miracleButtons.setVisible(false);
    }

    createUIelements(){
        this.health = this.add.group();
        let picframe = 0;

        for (let j = 0; j < 2; j ++){
            for (let i = 0; i < 10; i++){
                if (i % 2 == 0){
                    picframe = 0;
                }else{
                    picframe = 1;
                }
                const heart = this.add.image(20 * i, (40 * j),'iconsui',picframe).setOrigin(0,0);
                heart.scale = 0.125;
                this.health.add(heart);
            }
        }        
    }

    updateUI(){
        let hearts = this.health.getChildren();
        let picframe = 0;
        for (let i = 0; i < 20; i++){
            //show if matches maxHP
            /*if (i + 1 > this.player.maxhp){
                hearts[i].setVisible(false);
            }else{                
                hearts[i].setVisible(true);                
            }*/

            //fill if matches HP
            if (i % 2 == 0){
                if (i + 1 > this.player.hp){
                    picframe = 2;
                }else picframe = 0;
            }else{
                if (i + 1 > this.player.hp){
                    picframe = 3;
                }else picframe = 1;
            }
            hearts[i].setFrame(picframe);
        }

        this.miracleButtons.getChildren()[4].setText('x '+this.player.mp);
    }

    /**
     * MOVIMENTO
     */
    movePlayer(playerSprite){
        if (this.moveX > 0){            
            playerSprite.x += this.moveSpeed;
            this.moveX -= this.moveSpeed;
            if(this.moveX <= 0){
                this.moveX = 0;
                this.resolverTurno();
            }
        }
        if (this.moveX < 0){            
            playerSprite.x -= this.moveSpeed;
            this.moveX += this.moveSpeed;
            if(this.moveX >= 0){
                this.moveX = 0;
                this.resolverTurno();
            }
        }
        if (this.moveY > 0){            
            playerSprite.y += this.moveSpeed;
            this.moveY -= this.moveSpeed;
            if(this.moveY <= 0){
                this.moveY = 0;
                this.resolverTurno();
            }
        }
        if (this.moveY < 0){            
            playerSprite.y -= this.moveSpeed;
            this.moveY += this.moveSpeed;
            if(this.moveY >= 0){
                this.moveY = 0;
                this.resolverTurno();
            }
        }
    }

    placeOnMap(col,row){
        return {
            'x': 40 + (col * 80),
            'y': 80 + (row * 80),
            'wall': this.mapa[row][col] == 9
        };
    }

    coordsOnMap(x,y){
        let col = (x - 40) / 80;
        let row = (y - 80) / 80;
        return {
            'col': col,
            'row': row,
            'wall': this.mapa[row][col] == 9
        };
    }

    hitBlock(player,block){
        block.destroy();
    }

    canIMove (col,row){
        let pos = this.placeOnMap(col,row);
        return pos.wall == false;
    }

    updateMoveButtons(x,y){
        this.movebuttons.forEach((item)=>{
            item.x += x;
            item.y += y;
        });
    }

    showMoveButtons(){
        this.movebuttons.forEach((item)=>{
            const pos = this.coordsOnMap(item.x,item.y);
            if (pos.wall) item.setVisible(false);
            else item.setVisible(true);
        });
    }

    hideMoveButtons(){
        this.movebuttons.forEach((item)=>{
            item.setVisible(false);
        });
    }

    move(context,x,y,linha,coluna){
        if (context.modo !== 'comando') {
            return false;
        }else{
            if (context.canIMove(context.coluna+coluna,context.linha+linha)){
                context.moveY = y;
                context.linha += linha;
                context.moveX = x;
                context.coluna += coluna;
                context.updateMoveButtons(x,y);
                context.modo = 'mover';
            }else{
                return false;
            }
        }
    }

    /**
     * RESOLUÇÃO
     */
    resolverTurno(){
        this.modo = 'resolver';

        //TODO: checar no mapa se a casa está vazia, se tiver sortear entre batalhar, nada ou tesouro
        //      caso esteja com algum ícone, resolver o evento (shopping, oração, descanso, a definir)
        if (this.coluna == 4 && this.linha == 2){
            this.messenger.showMessage(["Bem Vindo!","Este é o meu novo game, Tiny RPG: The Pirate Space Ship."],() => {
                this.modo = 'comando';
            });
        }else{
            this.startBattle();
            this.modo = 'batalhar';
        }
    }

    /**
     * BATALHA
     */
    startBattle(){
        this.enemy.defineEnemy(); //TODO: passar json contendo dados do monstro
        this.battlefield.showBattlefield();
        this.battlemode = 'inicio';
    }

    controlBattle(pointer){
        switch(this.battlemode){
            case 'inicio': 
                if (this.battlefield.modo == 'inicio'){
                    this.battlemode = 'jogando';
                    this.battlefield.startBattle();
                    this.player.charge();
                    this.enemy.attack();
                }
                break;
            case 'jogando': 
                if (pointer.y < game.config.height - 160){
                    this.player.changeLane(pointer);
                }
                break;
            case 'fim': 
                this.modo = 'comando';
                this.battlefield.hideBattlefield();
                break;
        }
    }

    changeLane(pointer){
        if (this.moving == false){
            this.lane ++;
            //if (pointer.leftButtonDown()){
            if (this.lane > 1){
                this.lane = 0;
            }
            this.nextpos = this.positions[this.lane];
            this.moving = true;
        }
    }

    shoot(){
        var beam = new Bullet(this,this.enemy.defineShootLane(), this.enemy.y-200);
    }

    eraseBullets(){        
        this.projectiles.children.each(function(b) {
            b.destroy();
        }.bind(this));
    }

    callMiracle(miracle){
        if (this.player.mp <= 0) return false;
        console.log(miracle);
        this.player.mp--;
    }

    hitEnemy(){
        this.enemy.hp -= 1;
        if (this.enemy.hp > 0){
            this.shakenemy.shake({
                duration: 500,
                magnitude: 10
            });
        }else{
            this.shakenemy.shake({
                duration: 1000,
                magnitude: 50
            });
            this.enemy.die();
            this.player.wonBattle();
        }
        this.player.retreat();
        this.eraseBullets();
    }

    hitPlayer(projectile,player){
        if (!player.moving){
            this.eraseBullets();
            if (!player.getBack){
                player.hp -= 1;
            }
            player.retreat();
        }
    }

    fimDaBatalha(won){
        if(!won){
            this.battlemode = 'ko'; //cai fora do switch
            this.modo = 'esperar'; 
            this.fade(false, 1000, 255,255,255, () => {
                this.scene.start("overGame");
            });
        }else{
            this.battlemode = 'fim'; 
            //this.modo = 'esperar';
            this.battlefield.showVictoryMsg();
        }

    }
    
}