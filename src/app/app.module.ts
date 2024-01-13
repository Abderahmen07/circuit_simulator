import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListComponent } from './list/list.component';
import { MaquetteComponent } from './maquette/maquette.component';
import { NvbarComponent } from './nvbar/nvbar.component';



@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    MaquetteComponent,
    NvbarComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DragDropModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {


 }
