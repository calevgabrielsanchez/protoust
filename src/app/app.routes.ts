import { Routes } from '@angular/router';
import { MainComponent } from './components/main.component/main.component';
import { CreatividadComponent } from './components/creatividad.component/creatividad.component';
import { MenteComponent } from './components/mente.component/mente.component';


export const routes: Routes = [
    {path:'', component: MainComponent},
    {path:'creatividad', component: CreatividadComponent},
    {path:'mente', component: MenteComponent},
];
