import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { LoginComponent } from './components/Login/login/login.component';
import { SignupComponent } from './components/Signup/signup/signup.component';
import { HomeComponent } from './components/Home/home/home.component';

export const routes: Routes = [
  {path: "login", component: LoginComponent},
  {path: "signup", component: SignupComponent},
  {path: "home", component: HomeComponent},
];
