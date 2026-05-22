import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, user } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private db   = inject(Firestore);

  user$ = user(this.auth);
  get currentUser() { return this.auth.currentUser; }

  async register(email: string, password: string, nombre: string, apellidos: string, foto: string) {
    const cred = await createUserWithEmailAndPassword(this.auth, email, password);
    await setDoc(doc(this.db, 'usuarios', cred.user.uid), {
      uid: cred.user.uid, email, nombre, apellidos, foto, creadoEn: new Date()
    });
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() { return signOut(this.auth); }
}
