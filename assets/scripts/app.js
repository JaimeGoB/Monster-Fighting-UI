
const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 20;
const MODE_ATTACK = 'ATTACK';
const MODE_STRONG_ATTACK = 'STRONG_ATTACK';
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';

/**********************************************************
* Getting the health for user and monster from user input.
**********************************************************/
function getMaxLifeValues() {
    const enteredValue = prompt('Maximum life for you and the monster.', '100');
  
    const parsedValue = parseInt(enteredValue);
    if (isNaN(parsedValue) || parsedValue <= 0) {
      throw { message: 'Invalid user input, not a number!' };
    }
    return parsedValue;
  }
  
  let chosenMaxLife;
  
  try {
    chosenMaxLife = getMaxLifeValues();
  } catch (error) {
    console.log(error);
    chosenMaxLife = 100;
    alert('You entered something wrong, default value of 100 was used.');
  }
  

//Adjusting health from user input on UI and numeric
let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;
adjustHealthBars(chosenMaxLife);
    
let battleLog = [];

/**********************************************************
* 
**********************************************************/

function writeToLog(ev, val, monsterHealth, playerHealth) {
    let logEntry = {
        event: ev,
        value: val,
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth
    };

    switch (ev) {
        case LOG_EVENT_PLAYER_ATTACK:
            logEntry.target = 'MONSTER';
            break;
        case LOG_EVENT_PLAYER_STRONG_ATTACK:
            logEntry = {
            event: ev,
            value: val,
            target: 'MONSTER',
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth
            };
            break;
        case LOG_EVENT_MONSTER_ATTACK:
            logEntry = {
            event: ev,
            value: val,
            target: 'PLAYER',
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth
            };
            break;
        case LOG_EVENT_PLAYER_HEAL:
            logEntry = {
            event: ev,
            value: val,
            target: 'PLAYER',
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth
            };
            break;
        case LOG_EVENT_GAME_OVER:
            logEntry = {
            event: ev,
            value: val,
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth
            };
            break;
        default:
            logEntry = {};
    }
    battleLog.push(logEntry);
}

function printLogHandler() {
    for(const logEntry of battleLog){
        console.log(logEntry);
    }
}

function endRound() {
    const initialPlayerHealth = currentPlayerHealth;
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= playerDamage;
    writeToLog(
        LOG_EVENT_MONSTER_ATTACK,
        playerDamage,
        currentMonsterHealth,
        currentPlayerHealth
    );

    if (currentPlayerHealth <= 0 && hasBonusLife) {
        hasBonusLife = false;
        removeBonusLife();
        currentPlayerHealth = initialPlayerHealth;
        setPlayerHealth(initialPlayerHealth);
        alert('You would be dead but the bonus life saved you!');
    }

    if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
        alert('You won!');
        writeToLog(
        LOG_EVENT_GAME_OVER,
        'PLAYER WON',
        currentMonsterHealth,
        currentPlayerHealth
        );
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
        alert('You lost!');
        writeToLog(
        LOG_EVENT_GAME_OVER,
        'MONSTER WON',
        currentMonsterHealth,
        currentPlayerHealth
        );
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
        alert('You have a draw!');
        writeToLog(
        LOG_EVENT_GAME_OVER,
        'A DRAW',
        currentMonsterHealth,
        currentPlayerHealth
        );
    }

    if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0) {
        reset();
    }
}

/**********************************************************
* This will handling ressetting the game.
**********************************************************/
function reset(){
    currentMonsterHealth = chosenMaxLife;
    currentPlayerHealth = chosenMaxLife;
    resetGame(chosenMaxLife);
}

/**********************************************************
* Handling clicks of Attack & Strong Attack Buttons 
* for both user and monster
**********************************************************/
function endRound(){

    //variable for life reset
    const playerHealthBeforeDeath = currentPlayerHealth;

    //Update damages to bars in UI
    //Update numeric value of health
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= playerDamage;

    writeToLog(
        LOG_EVENT_MONSTER_ATTACK,
        playerDamage,
        currentMonsterHealth,
        currentPlayerHealth
      );

    //check for bonus life
    if(currentPlayerHealth <= 0 && hasBonusLife){
        hasBonusLife = false;
        //Update UI
        removeBonusLife();
        currentPlayerHealth = playerHealthBeforeDeath;
        setPlayerHealth(playerHealthBeforeDeath);
        alert('Using your bonus life!');
    }

    //checking for a winner
    if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
        alert('You won!');
        writeToLog(
            LOG_EVENT_GAME_OVER,
            'PLAYER WON',
            currentMonsterHealth,
            currentPlayerHealth
        );
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
        alert('You lost!');
        writeToLog(
            LOG_EVENT_GAME_OVER,
            'MONSTER WON',
            currentMonsterHealth,
            currentPlayerHealth
        );
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
        alert('You have a draw!');
        writeToLog(
            LOG_EVENT_GAME_OVER,
            'A DRAW',
            currentMonsterHealth,
            currentPlayerHealth
        );
    }
}

function attackMonster(mode) {
    let maxDamage;
    let logEvent;
    if (mode === MODE_ATTACK) {
      maxDamage = ATTACK_VALUE;
      logEvent = LOG_EVENT_PLAYER_ATTACK;
    } else if (mode === MODE_STRONG_ATTACK) {
      maxDamage = STRONG_ATTACK_VALUE;
      logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
    }
    const damage = dealMonsterDamage(maxDamage);
    currentMonsterHealth -= damage;
    writeToLog(
      logEvent,
      damage,
      currentMonsterHealth,
      currentPlayerHealth
    );
    endRound();
}

function attackHandler(){
    attackMonster(MODE_ATTACK);
}

function strongAttackHandler(){
    attackMonster(MODE_STRONG_ATTACK);
}

/**********************************************************
* Handling click for Heal Button
* This function will increase users health but also 
* will call on monster attack.
**********************************************************/
function healPlayerHandler(){
    /*
    * Adjusting HEAL_VALUE, to correct amount.
    * Depending if it exceeds max life or not.
    */
   let healValue;
   if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
     alert("You can't heal to more than your max initial health.");
     healValue = chosenMaxLife - currentPlayerHealth;
   } else {
     healValue = HEAL_VALUE;
   }

    //Increase player health bar in UI and numerica value
    increasePlayerHealth(healValue);
    currentPlayerHealth += healValue;
    writeToLog(
        LOG_EVENT_PLAYER_HEAL,
        healValue,
        currentMonsterHealth,
        currentPlayerHealth
    );
    endRound();
}



//Setting listners 

  attackBtn.addEventListener('click', attackHandler);
  strongAttackBtn.addEventListener('click', strongAttackHandler);
  healBtn.addEventListener('click', healPlayerHandler);
  logBtn.addEventListener('click', printLogHandler);
  

