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
    IonSegment,
    IonSegmentButton,
    IonBackButton,
    IonButtons, IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack, moon, speedometer, listOutline, timeOutline } from 'ionicons/icons';
import { SleepService } from '../services/sleep.service';

@Component({
    selector: 'app-view-all-logs',
    templateUrl: 'view-all-logs.page.html',
    styleUrls: ['view-all-logs.page.scss'],
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
        IonSegment,
        IonSegmentButton,
        IonBackButton,
        IonButtons,
        IonSpinner
    ]
})
export class ViewAllLogsPage implements OnInit {
    formattedLogs: any[] = [];
    filter: 'all' | 'sleep' | 'sleepiness' = 'all';
    isLoading = true;

    constructor(
        private sleepService: SleepService
    ) {
        addIcons({ arrowBack, moon, speedometer, listOutline, timeOutline });
    }

    async ngOnInit() {
        await this.loadLogs();
    }

    async ionViewWillEnter() {
        await this.loadLogs();
    }

    async loadLogs() {
        this.isLoading = true;

        try {
            // Get logs from service - USE AWAIT
            const sleepLogs = await this.sleepService.getAllOvernightSleepData();
            const sleepinessLogs = await this.sleepService.getAllSleepinessData();

            console.log('Loaded logs:', {
                sleep: sleepLogs.length,
                sleepiness: sleepinessLogs.length
            });

            // Format sleep logs
            const formattedSleepLogs = sleepLogs.map((log: any) => ({
                type: 'sleep',
                icon: 'moon',
                color: 'primary',
                date: log.sleepStart,
                summary: log.summaryString(),
                startTime: log.getStartTimeString ? log.getStartTimeString() : '--:--',
                endTime: log.getEndTimeString ? log.getEndTimeString() : '--:--',
                duration: log.summaryString(),
                original: log
            }));

            // Format sleepiness logs
            const formattedSleepinessLogs = sleepinessLogs.map((log: any) => ({
                type: 'sleepiness',
                icon: 'speedometer',
                color: 'secondary',
                date: log.loggedAt,
                summary: log.summaryString(),
                level: log.loggedValue,
                description: this.getSleepinessDescription(log.loggedValue),
                original: log
            }));

            // Combine all logs
            this.formattedLogs = [...formattedSleepLogs, ...formattedSleepinessLogs]
                .sort((a, b) => b.original.loggedAt.getTime() - a.original.loggedAt.getTime());

        } catch (error) {
            console.error('Error loading logs:', error);
            this.formattedLogs = [];
        } finally {
            this.isLoading = false;
        }
    }

    formatDate(date: Date): string {
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    }

    getSleepinessDescription(level: number): string {
        const descriptions = [
            '', // Index 0 is empty
            'Feeling active, vital, alert, or wide awake',
            'Functioning at high levels, but not at peak; able to concentrate',
            'Awake, but relaxed; responsive but not fully alert',
            'Somewhat foggy, let down',
            'Foggy; losing interest in remaining awake; slowed down',
            'Sleepy, woozy, fighting sleep; prefer to lie down',
            'No longer fighting sleep, sleep onset soon; having dream-like thoughts'
        ];
        return descriptions[level] || 'Unknown level';
    }

    getLogsToShow(): any[] {
        if (this.filter === 'all') {
            return this.formattedLogs;
        } else {
            return this.formattedLogs.filter(log => log.type === this.filter);
        }
    }

    onFilterChange(event: any) {
        this.filter = event.detail.value;
    }
}