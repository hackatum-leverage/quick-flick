import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FlicksPage } from './flicks.page';

const routes: Routes = [
  {
    path: '',
    component: FlicksPage,
    children: [
      {
        path: 'movies',
        loadChildren: () => import('./movies/movies.module').then( m => m.MoviesPageModule)
      },
      {
        path: 'series',
        loadChildren: () => import('./series/series.module').then( m => m.SeriesPageModule)
      },
      {
        path: '',
        redirectTo: '/movies',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/movies',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FlicksPageRoutingModule {}
