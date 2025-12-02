import { SleepData } from './sleep-data';

export class OvernightSleepData extends SleepData {
	get sleepEnd(): Date {
		return this._sleepEnd;
	}
	get sleepStart(): Date {
		return this._sleepStart;
	}
	private _sleepStart:Date;
	private _sleepEnd:Date;

	constructor(sleepStart:Date, sleepEnd:Date) {
		super();
		this._sleepStart = sleepStart;
		this._sleepEnd = sleepEnd;
	}

	override summaryString():string {
		const duration = this.getDurationInHours();
		const hours = Math.floor(duration);
		const minutes = Math.floor((duration - hours) * 60);

		return `${hours}h ${minutes}m`;
	}

	override dateString():string {
		return this._sleepStart.toLocaleDateString('en-US', {
			weekday: 'short',
			month: 'short',
			day: 'numeric'
		});
	}

	// Get sleep duration in hours
	getDurationInHours(): number {
		const difference_ms = this._sleepEnd.getTime() - this._sleepStart.getTime();
		return difference_ms / (1000*60*60);
	}

	// Format time as HH:MM
	getStartTimeString(): string {
		return this._sleepStart.toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true
		});
	}

	getEndTimeString(): string {
		return this._sleepEnd.toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true
		});
	}

	// Get just the date portion (without time)
	getSleepDate(): Date {
		return new Date(
			this._sleepStart.getFullYear(),
			this._sleepStart.getMonth(),
			this._sleepStart.getDate()
		);
	}

}