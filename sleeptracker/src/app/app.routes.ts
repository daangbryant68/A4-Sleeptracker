import { Routes } from '@angular/router';
import { HomePage } from './home/home.page';
import { LogSleepPage } from './log-sleep/log.page';
import { LogSleepinessPage } from './log-sleepiness/log-sleepiness.page';
import { ViewAllLogsPage } from './view-all-logs/view-all-logs.page';

export const routes: Routes = [
  {
    path: 'home',
    component: HomePage,
  },
  {
    path: 'log-sleep',
    component: LogSleepPage,
  },
  {
    path: 'log-sleepiness',
    component: LogSleepinessPage,
  },
  {
    path: 'view-all-logs',
    component: ViewAllLogsPage,
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
];