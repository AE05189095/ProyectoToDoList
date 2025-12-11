import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';

import { 
  IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { listOutline, addCircleOutline, folderOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [
    IonTabs, 
    IonTabBar, 
    IonTabButton, 
    IonIcon, 
    IonLabel, 
    CommonModule, 
    RouterOutlet, 
    RouterLink // Necesario para la navegación entre pestañas
  ],
})
export class TabsPage {
  
  // Agregar los íconos necesarios para que Ionic los reconozca
  constructor() {
    addIcons({ listOutline, addCircleOutline, folderOutline });
  }

}