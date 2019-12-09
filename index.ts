import "./src/style/style.css"
import letters from './src/config/letters.json'
import {UserInterface} from "./src/components/UI";

class Game {
  private backSound: HTMLAudioElement;
  private loseSound: HTMLAudioElement;
  private target: HTMLImageElement;
  private score: number;
  private speedX: number;
  private speedY: number;
  private fps: number;
  private canvas: any;
  private context: any;
  private userInterface: UserInterface;
  private letters: Array<any>;

  constructor() {
    this.target = new Image();
    this.speedX = 5;
    this.speedY = 1;
    this.letters = [];
    this.fps = 15;
    this.score = 0;
    this.userInterface = new UserInterface();
    this.backSound = new Audio();
    this.loseSound = new Audio();
    this.canvas = document.getElementById('canvas');
    this.context = this.canvas.getContext('2d');
  }

  // Инициализация игры
  public async init(): Promise<any> {
    this.setCanvasSize();
    // Ждем загрузки аудио
    await this.loadSound();
    // Ждем загрузку мишени
    await this.setTarget();
    // Ждем когда юзер нажмем кнопку "Новая игры"
    await this.userInterface.confirmGameStart();
    await this.backSound.play();
    this.userInterface.toggleLoader();
    this.addListeners();
    this.setLetters();
    this.render();
    this.userInterface.toggleLoader();
  }

  // Загрузка мишени
  private async setTarget(): Promise<any> {
    this.target.src = (await import('./src/assets/images/target.png')).default;
  }

  // Растягивание канваса на весь экран
  private setCanvasSize(): void {
    this.canvas.setAttribute('width', window.innerWidth);
    this.canvas.setAttribute('height', window.innerHeight);
  }

  // Повышаем уровень и заного заполняем массив с буквами
  private upLevel(): void {
    this.speedX += 2;
    this.speedY += 1;
    this.setLetters();
  }

  //Заполняем массив с буквами из JSON и добавлеяем рандомные координаты для каждой буквы
  private setLetters(): void {
    this.letters = letters.map((item: string) => {
      const coords = [
        this.getRandom(0, -1000),
        this.getRandom(window.innerWidth, window.innerWidth + 1000)
      ];
      return {
        text: item,
        x: coords[this.getRandom(0, 1)],
        y: this.getRandom(-500, window.innerHeight + 500)
      }
    })
  }

  // Функция которая будет вызвана когда хоть одна буква дойдет до мишени
  private async gameEnd(): Promise<any> {
    this.userInterface.showGameOver(this.score);
    await this.loseSound.play();

    // Ждем что выберет пользователи (try - кнопка повторить, catch - кнопка выхода)
    try {
      await this.userInterface.confirmGameOver();
      this.setLetters();
      this.score = 0;
      this.render();
      this.userInterface.hideEndModal();
    } catch {
      window.location.reload();
    }
  }

  // Условие завершения игры
  private isGameEnd(x: number, y: number): boolean {
    return (
      (window.innerWidth / 2 - 64 < x && window.innerWidth / 2 + 64 > x)
      && (window.innerHeight / 2 - 64 < y && window.innerHeight / 2 + 64 > y)
    )
  }

  // Функция для получения рандомного числа
  private getRandom(min: any, max: any): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Функция загрузки audio
  private async loadSound(): Promise<any> {
    this.backSound.src = (await import('./src/assets/sound/back.mp3')).default;
    this.loseSound.src = (await import('./src/assets/sound/win.mp3')).default;
  }

  // Отрисовка букв и мишени на canvas
  private render(): void {
    this.context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    this.context.drawImage(this.target, window.innerWidth / 2 - 64, window.innerHeight / 2 - 64);

    //Повышения лвла когда заканчиваються буквы
    if (!this.letters.length) {
      this.upLevel()
    }

    // Отрисовка букв на canvas
    for (const item of this.letters) {
      this.context.font = "35px Stasea2";
      this.context.fillStyle = "white";
      this.context.textAlign = "center";
      this.context.fillText(item.text, item.x, item.y);

      // Проверка на конец игры
      if (this.isGameEnd(item.x, item.y)) {
        this.gameEnd();
        return;
      }

      // Анимирование букв
      if (window.innerWidth / 2 < item.x) {
        item.x -= this.speedX
      } else {
        item.x += this.speedX
      }

      if (window.innerHeight / 2 < item.y) {
        item.y -= this.speedY
      } else {
        item.y += this.speedY
      }
    }

    setTimeout(() => {
      requestAnimationFrame(() => {
        this.render();
      });
    }, 1000 / this.fps);
  }

  // Удаление буквы из массива если она есть на экране и в массиве с буквами
  private deleteLetter(e: any): void {
    const letterIndex = this.letters.findIndex((item) => item.text.includes(e.key));
    if (
      letterIndex !== -1
      && this.letters[letterIndex].x > 0
      && this.letters[letterIndex].x < window.innerWidth
      && this.letters[letterIndex].y > 0
      && this.letters[letterIndex].y < window.innerHeight
    ) {
      this.letters.splice(letterIndex, 1);
      this.score += 1
    }
  }

  // Обработчик кнопок
  private addListeners(): void {
    document.addEventListener('keypress', (e) => {
      this.deleteLetter(e)
    })
  }
}

const game = new Game();

game.init();

