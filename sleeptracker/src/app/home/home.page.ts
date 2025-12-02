import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
	IonHeader,
	IonToolbar,
	IonTitle,
	IonContent,
	IonCard,
	IonCardHeader,
	IonCardTitle,
	IonCardContent,
	IonList,
	IonItem,
	IonLabel,
	IonButton,
	IonIcon,
	IonGrid,
	IonRow,
	IonCol,
	IonCardSubtitle,
	IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { moon, bedOutline, speedometer, list } from 'ionicons/icons';
import { SleepService } from '../services/sleep.service';
import { OvernightSleepData } from '../data/overnight-sleep-data';

@Component({
	selector: 'app-home',
	templateUrl: 'home.page.html',
	styleUrls: ['home.page.scss'],
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		RouterModule,
		IonHeader,
		IonToolbar,
		IonTitle,
		IonContent,
		IonCard,
		IonCardHeader,
		IonCardTitle,
		IonCardContent,
		IonList,
		IonItem,
		IonLabel,
		IonButton,
		IonIcon,
		IonGrid,
		IonRow,
		IonCol,
		IonCardSubtitle,
		IonSpinner
	]
})
export class HomePage implements OnInit {
	recentSleeps: OvernightSleepData[] = [];
	totalSleepLogs = 0;
	hasLoggedToday = false;
	averageSleepHours = 0;
	isLoading = true;

	constructor(
		private sleepService: SleepService
	) {
		addIcons({ moon, bedOutline, speedometer, list });
	}

	async ngOnInit() {
		console.log('Home page loading...');
		await this.loadData();
	}

	async ionViewWillEnter() {
		console.log('Home page entering, refreshing data...');
		await this.loadData();
	}

	async loadData() {
		this.isLoading = true;

		try {
			console.log('Loading sleep data...');
			const allSleeps = await this.sleepService.getAllOvernightSleepData();
			console.log('Loaded', allSleeps.length, 'sleep logs');

			this.recentSleeps = allSleeps.slice(0, 3);
			this.totalSleepLogs = allSleeps.length;

			if (allSleeps.length > 0) {
				console.log('Sample sleep log:', {
					date: allSleeps[0].dateString(),
					start: allSleeps[0].getStartTimeString(),
					end: allSleeps[0].getEndTimeString(),
					summary: allSleeps[0].summaryString()
				});
			}

			this.hasLoggedToday = await this.sleepService.hasLoggedToday();
			this.averageSleepHours = await this.sleepService.getAverageSleepDuration();

			console.log('Home page data loaded:', {
				totalLogs: this.totalSleepLogs,
				recentSleeps: this.recentSleeps.length,
				hasLoggedToday: this.hasLoggedToday,
				avgSleep: this.averageSleepHours
			});

		} catch (error) {
			console.error('Error loading home page data:', error);
		} finally {
			this.isLoading = false;
		}
	}

	formatDuration(hours: number): string {
		const wholeHours = Math.floor(hours);
		const minutes = Math.round((hours - wholeHours) * 60);
		return `${wholeHours}h ${minutes}m`;
	}
}