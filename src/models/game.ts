export class Game {
  public players: string[] = [];
  public stack: string[] = [];
  public playedCards: string[] = [];
  public currentPlayer: number = 0;

  constructor() {
    let suits = ['ace', 'clubs', 'diamonds', 'hearts'];
    for (let i = 1; i < 14; i++) {
      suits.forEach((suit) => this.stack.push(`${suit}_${i}`));
    }
    this.shuffle(this.stack);
  }

  shuffle(array: string[]): void {
    let currentIndex = array.length;
    while (currentIndex !== 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
  }
  public cleanGame() {
    return {
      players: this.players || [],
      stack: this.stack || [],
      playedCards: this.playedCards || [],
      currentPlayer: this.currentPlayer || 0,
    };
  }
}
