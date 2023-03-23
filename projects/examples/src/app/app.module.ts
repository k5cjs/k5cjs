import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SelectSimpleModule } from './views/select-simple/select-simple.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, SelectSimpleModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
