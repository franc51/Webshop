import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ConfettiService } from '../Shared/confetti.service';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [],
  templateUrl: './order-confirmation.component.html',
  styleUrl: './order-confirmation.component.css'
})
export class OrderConfirmationComponent {
  constructor(private conffeti: ConfettiService){}

  ngOnInit(){
    this.conffeti.launchBasicConfetti();
  }

}
