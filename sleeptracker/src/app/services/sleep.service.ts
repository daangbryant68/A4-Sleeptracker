import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';

@Injectable({
	providedIn: 'root'
})
export class SleepService {
	private overnightSleepData: OvernightSleepData[] = [];
	private sleepinessData: StanfordSleepinessData[] = [];
	private isDataLoaded = false;
	private loadPromise: Promise<void> | null = null;

	// Storage keys
	private readonly SLEEP_STORAGE_KEY = 'sleepData_v1';
	private readonly SLEEPINESS_STORAGE_KEY = 'sleepinessData_v1';

	constructor(private storage: Storage) {
		// Start loading data immediately
		this.ensureDataLoaded();
	}

	// Ensure data is loaded before any operation
	private ensureDataLoaded(): Promise<void> {
		if (this.loadPromise) {
			return this.loadPromise;
		}

		if (this.isDataLoaded) {
			return Promise.resolve();
		}

		this.loadPromise = this.loadDataInternal();
		return this.loadPromise;
	}

	private async loadDataInternal(): Promise<void> {
		try {
			console.log('Starting data load...');

			// Initialize storage
			await this.storage.create();

			// Load sleep data
			const storedSleep = await this.storage.get(this.SLEEP_STORAGE_KEY);
			if (storedSleep && Array.isArray(storedSleep)) {
				for (const item of storedSleep) {
					try {
						const sleepStart = this.parseDateFromStorage(item.sleepStart);
						const sleepEnd = this.parseDateFromStorage(item.sleepEnd);
						const sleepData = new OvernightSleepData(sleepStart, sleepEnd);
						this.overnightSleepData.push(sleepData);
					} catch (e) {
						console.error('Error parsing sleep data:', e);
					}
				}
			}

			// Load sleepiness data
			const storedSleepiness = await this.storage.get(this.SLEEPINESS_STORAGE_KEY);
			if (storedSleepiness && Array.isArray(storedSleepiness)) {
				for (const item of storedSleepiness) {
					try {
						const loggedAt = this.parseDateFromStorage(item.loggedAt);
						const sleepinessData = new StanfordSleepinessData(item.loggedValue, loggedAt);
						this.sleepinessData.push(sleepinessData);
					} catch (e) {
						console.error('Error parsing sleepiness data:', e);
					}
				}
			}

			this.isDataLoaded = true;
			console.log('Data loaded successfully');

		} catch (error) {
			console.error('Error loading data:', error);
			this.isDataLoaded = true; // Mark as loaded to prevent infinite loops
		}
	}

	// Parse date from storage - handles both ISO strings and custom format
	private parseDateFromStorage(dateStr: string): Date {
		// Try parsing as ISO string first
		let date = new Date(dateStr);

		// If invalid, try custom format
		if (isNaN(date.getTime())) {
			const parts = dateStr.split(/[-T:]/);
			if (parts.length >= 5) {
				const year = parseInt(parts[0], 10);
				const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
				const day = parseInt(parts[2], 10);
				const hours = parseInt(parts[3], 10);
				const minutes = parseInt(parts[4], 10);
				date = new Date(year, month, day, hours, minutes);
			}
		}

		return date;
	}

	// Convert date to storage string (consistent format)
	private dateToStorageString(date: Date): string {
		// Use ISO format for consistency
		return date.toISOString();
	}

	// Save data to storage
	private async saveDataToStorage() {
		try {
			// Prepare sleep data
			const sleepDataToStore = this.overnightSleepData.map(data => ({
				sleepStart: this.dateToStorageString(data.sleepStart),
				sleepEnd: this.dateToStorageString(data.sleepEnd),
				loggedAt: this.dateToStorageString(data.loggedAt),
				id: data.id
			}));

			// Prepare sleepiness data
			const sleepinessDataToStore = this.sleepinessData.map(data => ({
				loggedValue: data.loggedValue,
				loggedAt: this.dateToStorageString(data.loggedAt),
				id: data.id
			}));

			// Save to storage
			await this.storage.set(this.SLEEP_STORAGE_KEY, sleepDataToStore);
			await this.storage.set(this.SLEEPINESS_STORAGE_KEY, sleepinessDataToStore);

		} catch (error) {
			console.error('Error saving data:', error);
		}
	}

	// Public methods
	async getAllOvernightSleepData(): Promise<OvernightSleepData[]> {
		await this.ensureDataLoaded();
		return [...this.overnightSleepData];
	}

	async getAllSleepinessData(): Promise<StanfordSleepinessData[]> {
		await this.ensureDataLoaded();
		return [...this.sleepinessData];
	}

	async getSleepForDate(date: Date): Promise<OvernightSleepData | null> {
		await this.ensureDataLoaded();

		const targetDate = new Date(
			date.getFullYear(),
			date.getMonth(),
			date.getDate()
		);

		return this.overnightSleepData.find(data => {
			const dataDate = data.getSleepDate();
			return dataDate.getTime() === targetDate.getTime();
		}) || null;
	}

	async logOvernightSleep(sleepStart: Date, sleepEnd: Date): Promise<OvernightSleepData> {
		await this.ensureDataLoaded();

		// Check for existing sleep on same date
		const sleepDate = new Date(
			sleepStart.getFullYear(),
			sleepStart.getMonth(),
			sleepStart.getDate()
		);

		// Remove existing sleep for same date
		this.overnightSleepData = this.overnightSleepData.filter(data => {
			const dataDate = data.getSleepDate();
			return dataDate.getTime() !== sleepDate.getTime();
		});

		const sleepData = new OvernightSleepData(sleepStart, sleepEnd);
		this.overnightSleepData.unshift(sleepData);

		// Save to storage
		await this.saveDataToStorage();

		return sleepData;
	}

	async logSleepiness(value: number, loggedAt: Date = new Date()): Promise<StanfordSleepinessData> {
		await this.ensureDataLoaded();

		const sleepinessData = new StanfordSleepinessData(value, loggedAt);
		this.sleepinessData.unshift(sleepinessData);

		// Save to storage
		await this.saveDataToStorage();

		return sleepinessData;
	}

	async hasLoggedToday(): Promise<boolean> {
		await this.ensureDataLoaded();
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		return this.overnightSleepData.some(data => {
			const dataDate = data.getSleepDate();
			return dataDate.getTime() === today.getTime();
		});
	}

	async getAverageSleepDuration(): Promise<number> {
		await this.ensureDataLoaded();
		const lastWeek = new Date();
		lastWeek.setDate(lastWeek.getDate() - 7);

		const recentSleeps = this.overnightSleepData.filter(data =>
			data.sleepStart >= lastWeek
		);

		if (recentSleeps.length === 0) return 0;

		const totalHours = recentSleeps.reduce((sum, data) =>
			sum + data.getDurationInHours(), 0
		);

		return totalHours / recentSleeps.length;
	}

	// Debug method
	async debugStorage() {
		const sleepData = await this.storage.get(this.SLEEP_STORAGE_KEY);
		const sleepinessData = await this.storage.get(this.SLEEPINESS_STORAGE_KEY);

		console.log('Storage contents:', {
			sleepData,
			sleepinessData
		});
	}
}