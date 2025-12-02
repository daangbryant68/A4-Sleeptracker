import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    IonButton,
    IonBackButton,
    IonButtons,
    IonSpinner,
    IonDatetime,
    IonGrid,
    IonRow,
    IonCol,
    IonCardSubtitle,
    IonLabel
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack } from 'ionicons/icons';
import { NavController, AlertController } from '@ionic/angular/standalone';
import { SleepService } from '../services/sleep.service';

@Component({
    selector: 'app-log',
    templateUrl: 'log.page.html',
    styleUrls: ['log.page.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonContent,
        IonCard,
        IonCardHeader,
        IonCardTitle,
        IonCardContent,
        IonButton,
        IonBackButton,
        IonButtons,
        IonSpinner,
        IonDatetime,
        IonGrid,
        IonRow,
        IonCol,
        IonCardSubtitle,
        IonLabel
    ]
})
export class LogSleepPage implements OnInit {
    sleepForm: FormGroup;
    isSubmitting = false;

    constructor(
        private navCtrl: NavController,
        private alertController: AlertController,
        private sleepService: SleepService,
        private fb: FormBuilder
    ) {
        // Set default times (sleep from 11 PM yesterday to 7 AM today)
        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);

        this.sleepForm = this.fb.group({
            sleepStartDate: [this.formatDateForInput(yesterday), Validators.required],
            sleepStartTime: ['23:00', Validators.required],
            sleepEndDate: [this.formatDateForInput(now), Validators.required],
            sleepEndTime: ['07:00', Validators.required]
        });

        addIcons({ arrowBack });
    }

    ngOnInit() {}

    // Format date for input (YYYY-MM-DD)
    private formatDateForInput(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Set quick sleep durations
    setQuickSleep(hours: number) {
        const now = new Date();
        const endDate = new Date(now);
        const startDate = new Date(now.getTime() - (hours * 60 * 60 * 1000));

        this.sleepForm.patchValue({
            sleepStartDate: this.formatDateForInput(startDate),
            sleepStartTime: this.formatTimeForDisplay(startDate),
            sleepEndDate: this.formatDateForInput(endDate),
            sleepEndTime: this.formatTimeForDisplay(endDate)
        });
    }

    // Set sleep from yesterday night to today morning
    setYesterdayToToday() {
        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);

        this.sleepForm.patchValue({
            sleepStartDate: this.formatDateForInput(yesterday),
            sleepStartTime: '23:00',
            sleepEndDate: this.formatDateForInput(now),
            sleepEndTime: '07:00'
        });
    }

    // Format time for display (HH:MM)
    private formatTimeForDisplay(date: Date): string {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    // Create Date object from form values (FIXED for timezone)
    private createDateTime(dateStr: string, timeStr: string): Date {
        // Parse date and time
        const [year, month, day] = dateStr.split('-').map(Number);
        const [hours, minutes] = timeStr.split(':').map(Number);

        // Create date in local timezone
        const date = new Date(year, month - 1, day, hours, minutes, 0);

        console.log('Created date:', {
            input: `${dateStr} ${timeStr}`,
            output: date.toLocaleString(),
            iso: date.toISOString(),
            components: { year, month: month - 1, day, hours, minutes }
        });

        return date;
    }

    async logSleep() {
        if (this.sleepForm.invalid || this.isSubmitting) {
            return;
        }

        this.isSubmitting = true;

        const formValue = this.sleepForm.value;

        // Create Date objects
        const sleepStart = this.createDateTime(formValue.sleepStartDate, formValue.sleepStartTime);
        const sleepEnd = this.createDateTime(formValue.sleepEndDate, formValue.sleepEndTime);

        // Validate times
        if (sleepEnd <= sleepStart) {
            await this.showAlert('Invalid Times', 'Wake-up time must be after bedtime.');
            this.isSubmitting = false;
            return;
        }

        // Check duration
        const durationHours = (sleepEnd.getTime() - sleepStart.getTime()) / (1000 * 60 * 60);
        if (durationHours < 1 || durationHours > 16) {
            await this.showAlert('Check Duration', 'Sleep duration should be between 1 and 16 hours.');
            this.isSubmitting = false;
            return;
        }

        // Check for existing sleep log
        const sleepDate = new Date(sleepStart.getFullYear(), sleepStart.getMonth(), sleepStart.getDate());
        const existingSleep = await this.sleepService.getSleepForDate(sleepDate);

        if (existingSleep) {
            const confirm = await this.showConfirm(
                'Already Logged',
                `You already have a sleep log for ${sleepDate.toLocaleDateString()}. Do you want to replace it?`
            );

            if (!confirm) {
                this.isSubmitting = false;
                return;
            }
        }

        try {
            // Log the sleep
            await this.sleepService.logOvernightSleep(sleepStart, sleepEnd);

            // Debug: Check what was saved
            setTimeout(() => {
                this.sleepService.debugStorage();
            }, 500);

            await this.showAlert('Success!', `Sleep logged: ${sleepStart.toLocaleString()} to ${sleepEnd.toLocaleString()}`);
            this.navCtrl.back();

        } catch (error) {
            console.error('Error logging sleep:', error);
            await this.showAlert('Error', 'There was an error logging your sleep.');
            this.isSubmitting = false;
        }
    }

    cancel() {
        this.navCtrl.back();
    }

    // Helper methods for alerts
    private async showAlert(header: string, message: string) {
        const alert = await this.alertController.create({
            header,
            message,
            buttons: ['OK']
        });
        await alert.present();
    }

    private async showConfirm(header: string, message: string): Promise<boolean> {
        return new Promise(async (resolve) => {
            const alert = await this.alertController.create({
                header,
                message,
                buttons: [
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        handler: () => resolve(false)
                    },
                    {
                        text: 'Replace',
                        handler: () => resolve(true)
                    }
                ]
            });
            await alert.present();
        });
    }
}