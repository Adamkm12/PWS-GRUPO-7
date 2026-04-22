import { Injectable, inject } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  user,
  updateProfile
} from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private auth = inject(Auth);

  // Observo el estado del usuario en tiempo real
  currentUser$: Observable<any> = user(this.auth);

  register(email: string, password: string, name: string): Promise<void> {
    return createUserWithEmailAndPassword(this.auth, email, password).then(credential =>
      updateProfile(credential.user, { displayName: name })
    );
  }

  login(email: string, password: string): Promise<any> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout(): Promise<void> {
    return signOut(this.auth);
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }
}
