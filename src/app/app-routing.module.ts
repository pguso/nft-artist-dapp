import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from "./pages/home/home.component";
import { UploadComponent } from "./pages/upload/upload.component";
import { DetailsComponent } from './pages/details/details.component';
import { MyNftsComponent } from "./pages/my-nfts/my-nfts.component";

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'upload', component: UploadComponent},
  {path: 'details/:id', component: DetailsComponent},
  {path: 'my-nfts', component: MyNftsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
