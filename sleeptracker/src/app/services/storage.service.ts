import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage-angular';
const STORAGE_KEY = 'sleeplist';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    private _storage: Storage | null = null;

    constructor(private storage: Storage) {
        this.init();
    }

    async init() {
        // If using, define drivers here: await this.storage.defineDriver(/*...*/);
        const storage = await this.storage.create();
        this._storage = storage;
    }

    // Create and expose methods that users of this service can
    // call, for example:
    public set(key: string, value: any) {
        this._storage?.set(key, value);
    }

    getData(key: string){
        return this.storage.get(key) || [];
    }

    async addData({item, key}: { item: any, key: string }) {
        const storedData = await this.storage.get(key) || [];
        storedData.push(item);
        return this.storage.set(key, storedData);
    }

    deleteData() {
        this.storage.clear();
    }
}