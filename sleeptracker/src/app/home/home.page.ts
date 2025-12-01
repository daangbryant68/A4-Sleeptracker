import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
	IonContent,
	IonHeader,
	IonTitle,
	IonToolbar,
	IonCard,
	IonCardHeader,
	IonCardTitle,
	IonCardContent,
	IonButton,
	IonIcon,
	IonText,
	IonRow,
	IonCol,
	IonGrid, IonCardSubtitle
} from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { bed, moon, statsChart, happy, sad, time } from 'ionicons/icons';

@Component({
	selector: 'app-home',
	templateUrl: './home.page.html',
	styleUrls: ['./home.page.scss'],
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		RouterModule,
		IonContent,
		IonHeader,
		IonTitle,
		IonToolbar,
		IonCard,
		IonCardHeader,
		IonCardTitle,
		IonCardContent,
		IonButton,
		IonIcon,
		IonText,
		IonRow,
		IonCol,
		IonGrid,
		IonCardSubtitle
	]
})
export class HomePage implements OnInit {
	today = new Date();
	greeting = '';// You could make this customizable

	constructor() {
		addIcons({ bed, moon, statsChart, happy, sad, time });
	}

	ngOnInit() {
		this.setGreeting();
	}

	setGreeting() {
		const hour = this.today.getHours();
		if (hour < 12) {
			this.greeting = 'Good Morning';
		} else if (hour < 18) {
			this.greeting = 'Good Afternoon';
		} else {
			this.greeting = 'Good Evening';
		}
	}

	getDayOfWeek(): string {
		const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		return days[this.today.getDay()];
	}

	getFormattedDate(): string {
		const options: Intl.DateTimeFormatOptions = {
			month: 'long',
			day: 'numeric',
			year: 'numeric'
		};
		return this.today.toLocaleDateString('en-US', options);
	}
}