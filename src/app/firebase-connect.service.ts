import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyB-_zxRgy4LmTTKzMOTcq2nVTWtE2L-WZM',
  authDomain: 'fir-basket.firebaseapp.com',
  databaseURL: 'https://fir-basket.firebaseio.com',
  projectId: 'fir-basket',
  storageBucket: 'fir-basket.appspot.com',
  messagingSenderId: '177058333042'
};

@Injectable()
export class FirebaseConnectService {
  uid: string;
  email: string;
  usersRef: firebase.database.Reference;

  constructor() {
    firebase.initializeApp(config);
    this.usersRef = firebase.database().ref('/users');
  }

  observe<T>(ref: firebase.database.Reference) {
    return new Observable<T>(observer => {
      const watcher = ref.on('value', snap => {
        observer.next(snap.val());
      });
      return () => ref.off('value', watcher);
    });
  }

  async authenticate() {
    const result = await firebase.auth().getRedirectResult();
    const user = result.user || firebase.auth().currentUser;
    if (!user) {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithRedirect(provider);
    }
    this.usersRef.child(user.uid).update({
      photo: user.photoURL,
      name: user.displayName
    })
    this.uid = user.uid;
    this.email = user.email;
    return user.email;
  }
}
