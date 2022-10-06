import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationBarComponent } from '../../shared/navigation-bar/navigation-bar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { ReusableSearchComponent } from '../../shared/reusable-search/reusable-search.component';



@NgModule({
  declarations: [
    NavigationBarComponent,
    FooterComponent,
    ReusableSearchComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NavigationBarComponent,
    FooterComponent,
    ReusableSearchComponent
  ]
})
export class SharedModule { }
