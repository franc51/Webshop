import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/Login/login/login.component';
import { SignupComponent } from './components/Signup/signup/signup.component';
import { HomeComponent } from './components/Home/home/home.component';
import { FavoritesComponent } from './components/Favorites/favorites/favorites.component';
import { AccountComponent } from './components/Account/account/account.component';
import { AddProductsComponent } from './components/Admin/Add-product/add-products/add-products.component';
import { ProductListComponent } from './components/Product-list/product-list/product-list.component';
import { CartComponent } from './components/cart/cart.component';
import { OrderConfirmationComponent } from './components/order-confirmation/order-confirmation.component';
import { ProductPageComponent } from './components/product-page/product-page.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: '', component: HomeComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: 'cart', component: CartComponent },
  { path: 'account', component: AccountComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'contact', component: FavoritesComponent },
  { path: 'blog', component: FavoritesComponent },
  { path: 'add-new-product', component: AddProductsComponent },
  { path: 'products/:category', component: ProductListComponent },
  { path: 'order', component: OrderConfirmationComponent },
  { path: 'product/:id', component: ProductPageComponent },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
