import { Component } from '@angular/core';
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
    IonButton,
    IonBackButton,
    IonButtons,
    IonSpinner,
    IonDatetime,
    IonGrid,
    IonRow,
    IonCol,
    IonCardSubtitle,
    IonLabel,
    IonItem,
    IonRadioGroup,
    IonRadio,
    IonList,
    IonListHeader, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack, speedometer } from 'ionicons/icons';
import { NavController, AlertController } from '@ionic/angular/standalone';
import { SleepService } from '../services/sleep.service';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';

@Component({
    selector: 'app-log-sleepiness',
    templateUrl: 'log-sleepiness.page.html',
    styleUrls: ['log-sleepiness.page.scss'],
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
        IonButton,
        IonBackButton,
        IonButtons,
        IonSpinner,
        IonDatetime,
        IonGrid,
        IonRow,
        IonCol,
        IonCardSubtitle,
        IonLabel,
        IonItem,
        IonRadioGroup,
        IonRadio,
        IonList,
        IonListHeader,
        IonIcon
    ]
})
export class LogSleepinessPage {
    isSubmitting = false;
    selectedValue: number | null = null;
    customTime: string = new Date().toISOString();
    useCustomTime = false;

    // Use the ScaleValues from StanfordSleepinessData
    sleepinessScale = StanfordSleepinessData.ScaleValues.slice(1).map((description, index) => ({
        value: index + 1,
        description: description
    }));

    constructor(
        private navCtrl: NavController,
        private alertController: AlertController,
        private sleepService: SleepService
    ) {
        addIcons({ arrowBack, speedometer });
    }

    async logSleepiness() {
        if (this.selectedValue === null) {
            await this.showAlert('Select Sleepiness Level', 'Please select how sleepy you feel.');
            return;
        }

        this.isSubmitting = true;

        try {
            let loggedAt: Date;

            if (this.useCustomTime) {
                loggedAt = new Date(this.customTime);
            } else {
                loggedAt = new Date();
            }

            // Log the sleepiness using the service
            this.sleepService.logSleepiness(this.selectedValue, loggedAt);

            const description = StanfordSleepinessData.ScaleValues[this.selectedValue];
            await this.showAlert('Success!', `Sleepiness level ${this.selectedValue} logged: ${description}`);
            this.navCtrl.back();
        } catch (error) {
            await this.showAlert('Error', 'There was an error logging your sleepiness.');
            this.isSubmitting = false;
        }
    }

    toggleCustomTime() {
        this.useCustomTime = !this.useCustomTime;
        if (!this.useCustomTime) {
            this.customTime = new Date().toISOString();
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
}