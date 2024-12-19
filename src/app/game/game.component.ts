import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Game } from '../../models/game';
import { PlayerComponent } from '../player/player.component';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { GameInfoComponent } from '../game-info/game-info.component';
import { docData, Firestore } from '@angular/fire/firestore';
import { collection, doc, updateDoc } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { retry } from 'rxjs';

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
  game: Game | undefined;
  gameId: string = '';
  firestore: Firestore = inject(Firestore);

  constructor(public route: ActivatedRoute, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((params) => {
      docData(this.getDocRef(params)).subscribe((game: any) => {
        if (this.game) {
          this.gameId = params['id'];
          this.game.currentPlayer = game.currentPlayer;
          this.game.playedCards = game.playedCards;
          this.game.players = game.players;
          this.game.stack = game.stack;
          this.game.pickCardAnimation = game.pickCardAnimation;
          this.game.currentCard = game.currentCard;
        }
      });
    });
  }

  getDocRef(params: any) {
    return doc(this.getGameRef(), params.id);
  }

  getDocRefId(id: any) {
    return doc(this.getGameRef(), id);
  }

  getGameRef() {
    return collection(this.firestore, 'games');
  }

  newGame() {
    this.game = new Game();
  }

  takeCard() {
    if (this.game && !this.game.pickCardAnimation) {
      let card = this.game?.stack.pop() ?? '';

      this.game.currentCard = card;
      this.game.pickCardAnimation = true;
      this.game.currentPlayer++;

      this.game.currentPlayer =
        this.game.currentPlayer % this.game.players.length;
      this.saveGame();
      setTimeout(() => {
        if (this.game) {
          this.game.playedCards.push(card);
          this.game.pickCardAnimation = false;
          this.saveGame();
        }
      }, 1000);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game?.players.push(name);
        this.saveGame();
      }
    });
  }

  async saveGame() {
    if (this.game) {
      await updateDoc(
        this.getDocRefId(this.gameId),
        this.game.cleanGame()
      ).catch((err) => {
        console.error('Error saving game:', err);
      });
    }
  }
}
