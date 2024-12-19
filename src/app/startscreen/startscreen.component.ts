import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { addDoc, Firestore, collection } from '@angular/fire/firestore';
import { Game } from '../../models/game';

@Component({
  selector: 'app-startscreen',
  standalone: true,
  imports: [],
  templateUrl: './startscreen.component.html',
  styleUrl: './startscreen.component.scss',
})
export class StartscreenComponent {
  constructor(private firestore: Firestore, private router: Router) {}

  async newGame() {
    await this.addGame();
  }

  async addGame() {
    let game = new Game();
    await addDoc(this.getGameRef(), game.cleanGame())
      .catch((err) => {
        console.error('Error adding document:', err);
      })
      .then((gameInfo: any) => {
        this.router.navigateByUrl('/game/' + gameInfo.id);
      });
  }

  getGameRef() {
    return collection(this.firestore, 'games');
  }
}
