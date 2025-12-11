import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 

// Importar IonAlert (o IonToast) y AlertController para mensajes emergentes (REQUISITO 4)
import { 
  IonContent, 
  IonIcon,
  IonAlert, // Añadido para el mensaje emergente
  AlertController // Añadido para controlar el mensaje
} from '@ionic/angular/standalone'; 

// Importar TaskService (o tu AuthService)
import { TaskService } from '../services/task.service'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    FormsModule, 
    IonContent,
    IonIcon,
    IonAlert // Añadido
  ],
})
export class LoginPage implements OnInit {
  
  // Inyección de servicios
  private router = inject(Router);
  private alertController = inject(AlertController); // Para mostrar alertas
  private taskService = inject(TaskService); // Para manejar usuarios

  // Variables para el modelo (ngModel)
  username = '';
  password = '';

  constructor() {}

  ngOnInit() {
    // Si el usuario ya está autenticado, redirigir directamente
    if (localStorage.getItem('isAuthenticated') === 'true') {
      this.router.navigateByUrl('/tabs/dashboard', { replaceUrl: true });
    }
  }

  /**
   * REQUISITO 4: Muestra un mensaje emergente.
   */
  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  /**
   * Lógica de autenticación principal (REQUISITOS 3 y 4).
   */
  login() {
    // 1. Verificar credenciales
    if (this.taskService.verifyUser(this.username, this.password)) {
      // REQUISITO 3: Login exitoso
      localStorage.setItem('isAuthenticated', 'true');
      this.router.navigateByUrl('/tabs/dashboard', { replaceUrl: true });
    } else {
      // REQUISITO 4: Credenciales incorrectas
      this.presentAlert(
        'Error de Autenticación',
        'El email o la contraseña son incorrectos.'
      );
    }
  }

  /**
   * REQUISITO 1: Registrar un nuevo usuario.
   */
  async register() {
    // Simular que el registro se hace con los campos actuales
    if (!this.username || !this.password) {
      this.presentAlert('Error de Registro', 'Por favor, ingrese un email y una contraseña.');
      return;
    }

    if (this.taskService.registerUser(this.username, this.password)) {
      this.presentAlert(
        'Registro Exitoso', 
        '¡Cuenta creada! Ahora puedes iniciar sesión.'
      );
      // Opcional: Iniciar sesión automáticamente
      // this.login(); 
    } else {
      this.presentAlert(
        'Error de Registro', 
        'Este email ya está registrado.'
      );
    }
  }

  /**
   * REQUISITO 2: Simulación de recuperación de contraseña.
   */
  async forgotPassword() {
    if (!this.username) {
        this.presentAlert('Recuperación de Contraseña', 'Por favor, ingrese su email en el campo de Usuario/Email.');
        return;
    }

    if (this.taskService.userExists(this.username)) {
        this.presentAlert(
            'Recuperación de Contraseña', 
            `Se ha enviado un correo de recuperación a ${this.username}.`
        );
    } else {
        this.presentAlert(
            'Error', 
            `El email ${this.username} no se encuentra registrado.`
        );
    }
  }
}