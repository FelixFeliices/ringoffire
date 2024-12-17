import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Game } from '../../models/game';
import { PlayerComponent } from '../player/player.component';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { GameInfoComponent } from '../game-info/game-info.component';
import { Firestore } from '@angular/fire/firestore';
import { collection, collectionData, addDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    PlayerComponent,
    MatIconModule,
    MatButtonModule,
    GameInfoComponent,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent implements OnInit {
  pickCardAnimation = false;
  currentCard: string | undefined = '';
  test: string = 'test';
  game: Game | undefined;
  firestore: Firestore = inject(Firestore);

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.newGame();

    collectionData(this.getGameRef()).subscribe((game: any) => {
      console.log('Game update', game);
    });
  }

  getGameRef() {
    return collection(this.firestore, 'games');
  }

  async newGame() {
    this.game = new Game();
    await this.addGame();
    console.log(this.game);
  }

  async addGame() {
    await addDoc(this.getGameRef(), this.game?.cleanGame()).catch((err) => {
      console.error('Error adding document:', err);
    });
  }
  takeCard() {
    if (!this.pickCardAnimation && this.game) {
      let card = this.game?.stack.pop() ?? '';

      this.currentCard = card;
      this.pickCardAnimation = true;
      this.game.currentPlayer++;

      this.game.currentPlayer =
        this.game.currentPlayer % this.game.players.length;

      setTimeout(() => {
        this.game?.playedCards.push(card);
        this.pickCardAnimation = false;
      }, 1000);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game?.players.push(name);
      }
    });
  }
}
