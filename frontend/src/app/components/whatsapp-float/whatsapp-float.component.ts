import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-whatsapp-float',
  standalone: true,
  imports: [CommonModule],
  template: `
    <a
      class="whatsapp-float"
      [href]="whatsappLink"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp support"
      title="WhatsApp support"
    >
      <svg viewBox="0 0 32 32" width="26" height="26" aria-hidden="true">
        <path fill="currentColor" d="M19.11 17.2c-.27-.13-1.56-.77-1.8-.86-.24-.09-.42-.13-.6.13-.18.27-.68.86-.84 1.04-.15.18-.31.2-.58.07-.27-.13-1.12-.41-2.13-1.31-.79-.7-1.32-1.56-1.47-1.83-.15-.27-.02-.42.11-.55.12-.12.27-.31.4-.47.13-.15.18-.27.27-.45.09-.18.04-.34-.02-.47-.07-.13-.6-1.45-.82-1.99-.22-.52-.44-.45-.6-.46h-.51c-.18 0-.47.07-.72.34-.25.27-.95.93-.95 2.27s.97 2.63 1.1 2.81c.13.18 1.9 2.91 4.6 4.08.64.28 1.15.45 1.54.58.65.2 1.24.17 1.71.1.52-.08 1.56-.64 1.78-1.26.22-.62.22-1.15.15-1.26-.06-.11-.24-.18-.51-.31zM16.07 3.2A12.8 12.8 0 0 0 5 21.73L3.2 28.8l7.26-1.9A12.8 12.8 0 1 0 16.07 3.2zm0 23.25a10.4 10.4 0 0 1-5.3-1.45l-.38-.22-4.3 1.13 1.15-4.2-.25-.43a10.4 10.4 0 1 1 9.08 5.17z"/>
      </svg>
    </a>
  `,
  styles: [`
    .whatsapp-float {
      position: fixed;
      right: 20px;
      bottom: 20px;
      width: 54px;
      height: 54px;
      border-radius: 50%;
      background: #25d366;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
      z-index: 1300;
      transition: transform 0.2s ease;
    }

    .whatsapp-float:hover {
      transform: scale(1.08);
      text-decoration: none;
    }
  `]
})
export class WhatsappFloatComponent {
  private readonly adminPhone = '212600000000';
  whatsappLink = `https://wa.me/${this.adminPhone}`;
}
