class Scene2 extends BaseScene {
    constructor(){
        super("playGame");
    }

    init(){
        /*
        1: batalha, 2: evento, 3: tesouro, 4: templo, 5: enfermaria, 6 a 9: lojas 
         */
        this.mapa = [
            ['x','x','x','x','x','x','x','x','x'],
            ['x','x','x','x',0,'x','x','x','x'],
                  ['x',1,1,3,2,3,1,1,'x'],
                  ['x',1,1,4,9,7,1,1,'x'],
                  ['x',1,1,6,5,8,1,1,'x'],
                  ['x',1,1,1,1,1,1,1,'x'],
                  ['x',1,1,1,1,1,1,1,'x'],
                  ['x',1,1,1,1,1,1,1,'x'],
                  ['x',1,1,1,1,1,1,1,'x'],
                  ['x',1,1,1,1,1,1,1,'x'],
                  ['x',1,1,1,1,1,1,1,'x'],
            ['x','x','x','x',2,'x','x','x','x'],
            ['x','x','x','x','x','x','x','x','x'],
        ];
        this.mapaBlocks = [
            ['x','x','x','x','x','x','x','x','x'],
            ['x','x','x','x',0,'x','x','x','x'],
                  ['x',1,1,1,1,1,1,1,'x'],
                  ['x',1,1,1,1,1,1,1,'x'],
                  ['x',1,1,1,1,1,1,1,'x'],
                  ['x',1,1,1,1,1,1,1,'x'],
                  ['x',1,1,1,1,1,1,1,'x'],
                  ['x',1,1,1,1,1,1,1,'x'],
                  ['x',1,1,1,1,1,1,1,'x'],
                  ['x',1,1,1,1,1,1,1,'x'],
                  ['x',1,1,1,1,1,1,1,'x'],
            ['x','x','x','x',1,'x','x','x','x'],
            ['x','x','x','x','x','x','x','x','x'],
        ];
        this.modo = 'comando'; //comando,mover,resolver,comprar,esperar
        this.battlemode = 'inicio';
        this.movebuttons = [];
        this.coluna = 4;
        this.linha = 1;
        this.moveX = 0;
        this.moveY = 0;
        this.moveSpeed = 4;
        this.paused = false;

        this.fade(true, 1000, 0,0,0, false);
    }

    preload(){ 
        //TODO: verificar a necessidade de carregar assets nesta tela ou em uma cena de loader própria
    }

    create(){
        this.createStage();
        this.createMoveButtons(this.coluna,this.linha);

        const posicao = this.placeOnMap(this.coluna,this.linha);        
        this.playericon = this.physics.add.sprite(posicao.x,posicao.y,'characters',0).setOrigin(0,0);
        this.playericon.scale = 0.25;

        this.positions = [(game.config.width/2) - 80,(game.config.width/2) + 80];

        //JSONs
        this.monstersDB = this.cache.json.get('monsters');
        this.itensDB = this.cache.json.get('itens');
        this.txtDB = this.cache.json.get('txt');
        
        //battle sprites
        this.battlefield = new Battlefield({scene:this});
        this.enemy = new Enemy({scene:this,x:game.config.width/2,y:200});
        this.player = new Player({scene:this,x:(game.config.width/2) - 80,y:game.config.height - 320});
        this.projectiles = this.add.group();
        this.createBattleButtons();

        this.battleParticles = this.add.particles('iconsui');
        this.battleParticles.createEmitter({
            frame: 4,
            angle: { min: 240, max: 300 },
            speed: { min: 400, max: 600 },
            quantity: { min: 2, max: 10 },
            lifespan: 4000,
            alpha: { start: 1, end: 0 },
            scale: 0.25,
            rotate: { start: 0, end: 360, ease: 'Back.easeOut' },
            gravityY: 800,
            on: false
        });

        //shop sprites
        this.shop = new Shop({scene:this, itens:this.itensDB});
        this.createShopButtons();

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

        this.input.keyboard.on('keyup-SPACE', function (event) {
            this.player.savePlayerData();
            this.scene.pause();
            this.scene.launch('pauseGame');
        }, this);

        /**
         * DEBUG FUNCTIONS: Criar rotina na tela de apresentação para habilitar este modo
         */
        this.input.keyboard.on('keyup-Z', function (event) {
            this.shop.showStore('atk');
        }, this);

        this.input.keyboard.on('keyup-X', function (event) {
            this.shop.showStore('def');
        }, this);

        this.input.keyboard.on('keyup-C', function (event) {
            this.shop.showStore('spd');
        }, this);
        
        this.input.keyboard.on('keyup-V', function (event) {
            this.shop.showStore('item');
        }, this);
        
        this.input.keyboard.on('keyup-G', function (event) {
            this.player.gold += 50;
        }, this);

        //effects
        this.shakenemy = this.plugins.get('rexshakepositionplugin').add(this.enemy, {
            // mode: 1, // 0|'effect'|1|'behavior'
            magnitude: 10,
            // magnitudeMode: 1, // 0|'constant'|1|'decay'
        });
    }

    update() {
        this.starfield.tilePositionX += 0.5;
        this.starfield.tilePositionY += 0.8;
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

    createMoveButtons(coluna,linha){
        let posicao = this.placeOnMap(coluna,linha + 1);
        let areaDown = this.add.image(posicao.x,posicao.y,'tileset',11).setOrigin(0,0);
        areaDown.setInteractive().on('pointerdown', function(pointer){
            this.move(this,0,80,1,0);
        }, this);
        this.movebuttons.push(areaDown);

        posicao = this.placeOnMap(coluna - 1,linha); 
        let areaLeft = this.add.image(posicao.x,posicao.y,'tileset',11).setOrigin(0,0);
        areaLeft.setInteractive().on('pointerdown', function(pointer){
            this.move(this,-80,0,0,-1);
        }, this);
        this.movebuttons.push(areaLeft);
        
        posicao = this.placeOnMap(coluna + 1,linha); 
        let areaRight = this.add.image(posicao.x,posicao.y,'tileset',11).setOrigin(0,0);
        areaRight.setInteractive().on('pointerdown', function(pointer){
            this.move(this,80,0,0,1);
        }, this);
        this.movebuttons.push(areaRight);
        
        posicao = this.placeOnMap(coluna,linha - 1); 
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

    createBattleButtons(){
        this.battleButtons = this.add.group();
        let miracleTxt = this.add.text(game.config.width/2 + 160,game.config.height - 280, "x 3",txtStyle1).setOrigin(0,0);
        this.battleButtons.add(miracleTxt);
        
        let dodgeBtn = this.add.image(game.config.width - 40,game.config.height - 180,'btns120',0).setOrigin(1,0);
        dodgeBtn.setInteractive().on('pointerdown', function(pointer){
            this.player.changeLane(pointer);
        }, this);
        this.battleButtons.add(dodgeBtn);

        let dodgeTxt = this.add.text(dodgeBtn.x-240,dodgeBtn.y, this.txtDB["DODGELABEL"],txtStyleBtn).setOrigin(0.5,0);
        this.battleButtons.add(dodgeTxt);

        let healBtn = this.add.image(dodgeBtn.x - 600,dodgeBtn.y + 60,'icons',0).setOrigin(0,0);
        healBtn.setInteractive().on('pointerdown', function(pointer){
            this.callMiracle('heal');
        }, this);
        this.battleButtons.add(healBtn);  
        
        let clearBtn = this.add.image(healBtn.x - 120,healBtn.y,'icons',1).setOrigin(0,0);
        clearBtn.setInteractive().on('pointerdown', function(pointer){
            this.callMiracle('clear');
        }, this);
        this.battleButtons.add(clearBtn); 
        
        let mightBtn = this.add.image(clearBtn.x,clearBtn.y - 120,'icons',2).setOrigin(0,0);
        mightBtn.setInteractive().on('pointerdown', function(pointer){
            this.callMiracle('might');
        }, this);
        this.battleButtons.add(mightBtn); 
        
        let protectBtn = this.add.image(mightBtn.x + 120,mightBtn.y,'icons',3).setOrigin(0,0);
        protectBtn.setInteractive().on('pointerdown', function(pointer){
            this.callMiracle('protect');
        }, this);
        this.battleButtons.add(protectBtn);   

        this.battleButtons.setVisible(false);
    }

    createShopButtons(){
        this.shopButtons = this.add.group();

        let btn0 = this.add.image(game.config.width/2 - 160,game.config.height/2 - 378,'icons',0).setOrigin(0,0);
        btn0.setInteractive().on('pointerdown', function(pointer){
            this.buySumthinWillYa(0);
        }, this);
        this.shopButtons.add(btn0);

        let btn1 = this.add.image(btn0.x,btn0.y + 190,'icons',1).setOrigin(0,0);
        btn1.setInteractive().on('pointerdown', function(pointer){
            this.buySumthinWillYa(1);
        }, this);
        this.shopButtons.add(btn1); 

        let btn2 = this.add.image(btn1.x,btn1.y + 190,'icons',2).setOrigin(0,0);
        btn2.setInteractive().on('pointerdown', function(pointer){
            this.buySumthinWillYa(2);
        }, this);
        this.shopButtons.add(btn2); 

        let btnC = this.add.image(game.config.width/2 + 264,110,'icons',5).setOrigin(0,0);
        btnC.setInteractive().on('pointerdown', function(pointer){
            this.fecharLoja();
        }, this);
        this.shopButtons.add(btnC); 

        //TODO: adicionar botão para fechar janela

        this.shopButtons.setVisible(false); 
    }

    createUIelements(){
        //life
        this.health = this.add.group();
        let picframe = 0;
        for (let j = 0; j < 2; j ++){
            for (let i = 0; i < 10; i++){
                if (i % 2 == 0){
                    picframe = 0;
                }else{
                    picframe = 1;
                }
                const heart = this.add.image(20 * i, (40 * j),'heartui',picframe).setOrigin(0,0);
                heart.scale = 0.125;
                this.health.add(heart);
            }
        }
        
        //gold
        const gold = this.add.image(320,0,'iconsui',4).setOrigin(0,0);
        gold.scale = 0.125;
        this.goldTxt = this.add.text(384,30, "000",txtStyle3).setOrigin(1,0);

        //faith
        const faith = this.add.image(420,0,'iconsui',3).setOrigin(0,0);
        faith.scale = 0.125;
        this.mpTxt = this.add.text(484,30, "00",txtStyle3).setOrigin(1,0);

        //potion
        this.potionIcon = this.add.image(560,0,'iconsui',2).setOrigin(0,0);
        this.potionIcon.scale = 0.25;
        //this.potionTxt = this.add.text(320,40, "0",txtStyle3).setOrigin(0,0);

        //pause
        this.pauseBtn = this.add.image(720,0,'icons',10).setOrigin(0,0);
        this.pauseBtn.scale = 0.75;
        this.pauseBtn.setInteractive().on('pointerdown', function(pointer){
            this.player.savePlayerData();
            this.scene.pause();
            this.scene.launch('pauseGame');
        }, this);

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

        this.goldTxt.text = this.player.gold;
        this.mpTxt.text = this.player.mp;

        if (this.player.potions > 0){
            this.potionIcon.setVisible(true);
        }else{
            this.potionIcon.setVisible(false);
        }

        this.battleButtons.getChildren()[0].setText('x '+this.player.mp);
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
            'floor': this.mapa[row][col],
            'wall': this.mapa[row][col] == 'x'
        };
    }

    coordsOnMap(x,y){
        let col = (x - 40) / 80;
        let row = (y - 80) / 80;
        return {
            'col': col,
            'row': row,
            'floor': this.mapa[row][col],
            'wall': this.mapa[row][col] == 'x'
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
        let pos = this.placeOnMap(this.coluna,this.linha);
        if(pos.floor == 0){
            this.modo = 'comando';
        }else if (pos.floor == 2){ //evento
            this.executarEvento();
        }else if (pos.floor == 3){ //tesouro
            this.executarTesouro();
        }else if (pos.floor == 4){ //templo
            this.executarTemplo();
        }else if (pos.floor == 5){ //enfermaria
            this.executarEnfermaria();
        }else if (pos.floor == 6){ //loja de armas
            this.executarLoja('atk');
        }else if (pos.floor == 7){ //loja de escudos
            this.executarLoja('def');
        }else if (pos.floor == 8){ //loja de botas
            this.executarLoja('spd');
        }else if (pos.floor == 9){ //loja de itens (poção/livro/heart)
            this.executarLoja('item');
        }else{ //1: batalha
            this.startBattle();
        }
    }

    executarEvento(){ //TODO: criar prefab só para eventos, para ter melhor controle dos scripts
        if (this.coluna == 4 && this.linha == 2){
            this.messenger.showMessage([
                [this.txtDB["BEMVINDO"],"none"],
                [this.txtDB["NOVOGAME"],"none"]
            ],
                () => {
                    this.mapa[this.linha][this.coluna] = 0;
                    this.modo = 'comando';
                }
            );
        }else if (this.coluna == 4 && this.linha == 11){
            this.messenger.showMessage([["Aqui seria o final do jogo, onde ocorre a luta final","none"]],() => {
                this.mapa[this.linha][this.coluna] = 0;
                this.modo = 'comando';
            });
        }
    }

    executarTesouro(){
        let moedas = (rollDice(4) + 1) * Math.round(this.linha/2);
        this.messenger.showMessage([
                [this.txtDB["BAUENCONTRADO1"],"nico"],
                [this.txtDB["BAUENCONTRADO2"],"belle"],
                [this.txtDB["BAUENCONTRADO3"],"belle"],
                [this.txtDB["BAUENCONTRADO4"],"nico"],
                [this.txtDB["VOCEGANHOUMOEDAS"].replace('VARCOINS',moedas),"none"]
            ],
            () => {
                this.player.gold += moedas;
                this.modo = 'comando';
            }
        );
    }

    executarTemplo(){
        //TODO: criar umas 3 ou 4 conversas sobre e randomizar
        this.messenger.showMessage([
                [this.txtDB["TEMPLOENCONTRADO1"],"belle"],
                [this.txtDB["TEMPLOENCONTRADO2"],"belle"],
                [this.txtDB["TEMPLOENCONTRADO3"],"belle"],
                [this.txtDB["TEMPLOENCONTRADO4"],"nico"],
                [this.txtDB["TEMPLOENCONTRADO5"],"none"]
            ],
            () => {
                this.player.mp = this.player.maxmp;
                this.modo = 'comando';
            }
        );
    }

    executarEnfermaria(){
        //Aqui o jogador será perguntado se deseja descansar ao custo de x moedas (valor por coração a ser recuperado)
        this.custoenfermaria = (this.player.maxhp - this.player.hp) * 5;
        let msg = [[this.txtDB["ENFERMARIAENCONTRADA5"],"belle"]];
        //TODO: criar prefab contendo as arrays de mensagens, e selecionar qual usar por aqui
        if (!this.player.encontrouEnfermaria){
            msg = [
                [this.txtDB["ENFERMARIAENCONTRADA1"],"belle"],
                [this.txtDB["ENFERMARIAENCONTRADA2"],"belle"],
                [this.txtDB["ENFERMARIAENCONTRADA3"],"nico"],
                [this.txtDB["ENFERMARIAENCONTRADA4"],"nico"]
            ]
        }

        if (this.player.hp >= this.player.maxhp){
            msg = [[this.txtDB["ENFERMARIAENCONTRADA6"],"nico"]];
        }

        this.messenger.showMessage(msg, () => {
                if (this.player.hp < this.player.maxhp){
                    let choicer = new ChoiceMaker({scene:this});
                    choicer.showQuestion(this.txtDB["DESEJARECUPERARENERGIAPORXMOEDAS"].replace('VARCOINS',this.custoenfermaria),
                    [this.txtDB["SIM"],this.txtDB["NAO"]],
                        () => {
                            if (this.custoenfermaria <= this.player.gold){
                                this.player.hp = this.player.maxhp;
                                this.player.gold -= this.custoenfermaria;
                                if (this.player.gold < 0) this.player.gold = 0;
                                this.messenger.showMessage([
                                    [this.txtDB["SEUSPONTOSDEVIDAFORAMRECUPERADOS"],"none"]
                                ],
                                () => {
                                    this.modo = 'comando';
                                });
                            }else{
                                this.messenger.showMessage([
                                    [this.txtDB["DINHEIROINSUFICIENTE"],"none"]
                                ],
                                () => {
                                    this.modo = 'comando';
                                });
                            }
                        },
                        () => {
                            this.modo = 'comando';
                        }
                    );
                }else{
                    this.modo = 'comando';
                }
            }
        );

        this.player.encontrouEnfermaria = true;
    }

    /**
     * COMPRAS
     */
    executarLoja(tipo){
        /*
        Apresentar 3 itens para compra
        Verifica se o jogador obteve itens máximos de armas, caso tenha abrir a loja de itens no lugar
        Equipamentos: verificar de acordo com o que o jogador possui de atk/def/spd.
                      menor que o valor do item equipado são removidos da loja

        Livro: verificar se o jogador fez duas compras de livro, nesse caso impedir que compre mais
        Poção: impedir que o jogador compre mais que uma(?)
        Heart Container: quantos disponíveis (1 ou 2)? verificar se o jogador já comprou em alguma variavel

        Ao clicar: descreve o item e pergunta ao jogador se vai comprar por X moedas
         */
        if (!this.player.foundshop){
            this.messenger.showMessage([
                [this.txtDB["LOJAENCONTRADA1"],"belle"],
                [this.txtDB["LOJAENCONTRADA2"],"belle"],
                [this.txtDB["LOJAENCONTRADA3"],"belle"],
                [this.txtDB["LOJAENCONTRADA4"],"belle"],
                [this.txtDB["LOJAENCONTRADA5"],"belle"]
            ],
            () => {
                this.player.foundshop = true;
                this.shop.showStore(tipo);
            }
        );
        }else{
            this.shop.showStore(tipo);
        }
    }

    showShopButtons(tipo){
        //TODO: Alterar os frames de cada botão de acordo com o tipo da loja
        this.shopButtons.setVisible(true);
    }

    buySumthinWillYa(opt){
        if (!this.shop.buymode) return;
        let produto = this.shop.getItemData(opt);
        this.shop.setBuyMode(false);
        if (produto.msg == "SOLDOUT"){
            this.messenger.showMessage([[this.txtDB["NAOTEMOSMAISESTEITEM"],"none"]], () => {
                this.shop.setBuyMode(true);
            });
        }else if (produto.msg == "STUPIDEXCHANGE"){
            this.messenger.showMessage([[this.txtDB["VOCEPOSSUIEQUIPAMENTOMELHOR"],"none"]], () => {
                this.shop.setBuyMode(true);
            });
        }else {
            this.messenger.showMessage([[this.txtDB[produto.msg],"none"]], () => {
                let choicer = new ChoiceMaker({scene:this});
                choicer.showQuestion(this.txtDB["CONFIRMARCOMPRA"].replace('VARCOINS',produto.valor),
                [this.txtDB["SIM"],this.txtDB["NAO"]],
                    () => {
                        this.shop.buySumthinWillYa(opt);
                    },
                    () => {
                        this.shop.setBuyMode(true);
                    }
                );
            });
        }
    }

    fecharLoja(){
        this.shop.hideStore();
    }

    /**
     * BATALHA
     */
    startBattle(level){
        if (typeof level == 'undefined') level = this.linha - 1;
        let monsterID = rollDice(2) - 1;
        this.enemy.defineEnemy(this.monstersDB[level][monsterID]); 
        this.battlefield.showBattlefield();
        
        this.modo = 'batalhar';
        this.battlemode = 'inicio';
    }

    controlBattle(pointer){ //pointer
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
                // if (pointer.y < game.config.height - 160){
                //     this.player.changeLane(pointer);
                // }
                break;
            case 'fim': 
                this.modo = 'comando';
                this.battlefield.hideBattlefield();
                break;
        }
    }

    shoot(){
        let bulletID = rollDice(4) -1;
        let bulletFrame = this.enemy.bullets[bulletID];
        var beam = new Bullet(this,this.enemy.defineShootLane(), this.enemy.y-200, this.linha - 1, bulletFrame);
    }

    createCoinParticle(pointer,quantity){
        this.battleParticles.emitParticleAt(pointer.x, pointer.y,quantity);
    }

    eraseBullets(){        
        this.projectiles.children.each(function(b) {
            b.destroy();
        }.bind(this));
    }

    pauseAction(){
        this.player.pause();
        this.enemy.pause();
        this.projectiles.children.each(function(b) {
            b.pause();
        }.bind(this));
        this.battleButtons.setVisible(false);
        this.time.addEvent({ delay: 1500, callback: this.resumeAction, callbackScope: this });
    }

    resumeAction(){
        this.player.resume();
        this.enemy.resume();
        this.projectiles.children.each(function(b) {
            b.resume();
        }.bind(this));
        this.battleButtons.setVisible(true);
        this.battlefield.hideMiracleText();
    }

    callMiracle(miracle){
        if (this.player.mp <= 0) return false;
        this.player.mp--;
        this.pauseAction();
        this.battlefield.showMiracleText(miracle);

        switch(miracle){
            case "heal": 
                this.player.heal(true); 
                break;
            case "clear": 
                this.eraseBullets(); 
                this.enemy.pause(true); 
                this.time.addEvent({ delay: 2000, callback: this.enemy.resumeForced, callbackScope: this.enemy });
                break;
            case "might": 
                this.player.bonusatk += 1; 
                break;
            case "protect": 
                this.player.bonusdef += 1; 
                this.player.recoverDefense(); 
                break;

        }
    }

    ressurectPlayer(){
        this.pauseAction();
        this.battlefield.showMiracleText(this.txtDB["VOCEUSOUPOCAO"]);
        this.player.heal(false); 
    }

    hitEnemy(){
        if (this.enemy.dead) return false;

        this.enemy.hp -= this.player.atk + this.player.bonusatk;
        if (this.enemy.hp > 0){
            this.player.retreat();
        }else{
            this.battlefield.showClickerMsg();
            this.enemy.aboutToDie();
        }
        this.shakenemy.shake({
            duration: 500,
            magnitude: 10
        });
        this.eraseBullets();
    }

    hitPlayer(projectile,player){
        if (!player.moving){
            let tipoBullet = projectile.tipo;
            projectile.destroy();
            
            player.setStatusEffect(tipoBullet); //apenas alguns tipos causarão efeitos
            let dmg = this.battlefield.calculaDmg(this.linha - 1);
            if (tipoBullet > 1) dmg *= 2; //frames 2 pra cima causam o dobro de dano
            if (tipoBullet > 3) dmg *= 2; //frames
            if (this.player.shield <= 0){
                this.eraseBullets();
                if (!player.getBack){
                    player.hp -= dmg;
                }
                player.retreat();
            }else{                
                this.player.shield -= dmg;
                this.player.y += 20;
            }
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
            this.player.gold += this.enemy.gold;
            this.battlefield.showVictoryMsg(this.enemy.gold);
        }

    }
    
}