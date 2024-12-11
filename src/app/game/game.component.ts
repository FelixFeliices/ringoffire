import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Game } from '../../models/game';
import { PlayerComponent } from '../player/player.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, PlayerComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent implements OnInit {
  pickCardAnimation = false;
  currentCard: string | undefined = '';
  game: Game | undefined;

  constructor() {}

  ngOnInit(): void {
    this.newGame();
  }

  newGame() {
    this.game = new Game();
  }

  takeCard() {
    if (!this.pickCardAnimation && this.game) {
      let card = this.game.stack.pop() ?? '';
      this.currentCard = card;
      this.pickCardAnimation = true;

      setTimeout(() => {
        this.game?.playedCards.push(card);
        this.pickCardAnimation = false;
      }, 1000);

      console.log(this.game);
      console.log('New Card:', card);
    }
  }
}
