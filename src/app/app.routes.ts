import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/Login/login/login.component';
import { SignupComponent } from './components/Signup/signup/signup.component';
import { HomeComponent } from './components/Home/home/home.component';
import { FavoritesComponent } from './components/Favorites/favorites/favorites.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: '', component: HomeComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: 'cart', component: FavoritesComponent },
  { path: 'account', component: FavoritesComponent },
  { path: 'products', component: FavoritesComponent },
  { path: 'contact', component: FavoritesComponent },
  { path: 'blog', component: FavoritesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
