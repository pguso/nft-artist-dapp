import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { DOCUMENT } from "@angular/common";
import { HelperService } from "../../services/helper.service";
import { Router } from "@angular/router";
import { environment } from "../../../environments/environment";
import { IpfsService } from "../../services/ipfs.service";
import { MarketService } from "../../services/market.service";
import { Collection } from "../../interfaces/collection";

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  public uploadForm = this.fb.group({
    name: this.fb.control('', Validators.required),
    description: this.fb.control('', Validators.required),
    price: this.fb.control('', Validators.required),
    externalLink: this.fb.control(''),
    isAuction: this.fb.control(false),
    addToCollection: this.fb.control('', Validators.required),
    fileUrl: this.fb.control('', Validators.required),
    rare: this.fb.control(false),
    // fileOnUnlock: this.fb.control(''),
  })
  public hasFormError = false
  public collections: Collection[] = []
  public selectedCollectionId = 0
  public uploadedImage: Promise<string> = new Promise<string>(() => undefined);
  public loadingImage = false

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private fb: FormBuilder,
    private helper: HelperService,
    private router: Router,
    private ipfs: IpfsService,
    private market: MarketService,
  ) { }

  ngOnInit(): void {
    this.collections = environment.categories
  }

  public setCollection(collection: Collection): void {
    this.setField('addToCollection', collection.id)
    this.selectedCollectionId = collection.id
  }

  private setField(fieldName: string, fieldValue: any): void {
    this.uploadForm.get(fieldName)?.setValue(fieldValue);
  }

  public async uploadFile(event: any): Promise<void> {
    this.uploadedImage = new Promise(() => null);
    this.loadingImage = true
    const uploadedImage = await this.ipfs.upload(event.target.files)
    this.setField('fileUrl', uploadedImage)
    this.loadingImage = false

    this.uploadedImage = new Promise((resolve) => {
      resolve(uploadedImage);
    });
  }

  public resetError(): void {
    this.hasFormError = false
  }

  public async onSubmit(): Promise<void> {
    this.hasFormError = true
    await this.uploadedImage;

    if (this.uploadForm.valid) {
      this.hasFormError = false
      const isItemCreated = await this.market.addItem(this.uploadForm)
      if (isItemCreated) {
        await this.router.navigate([ '' ]);
      }
    } else {
      console.error('form is not valid')
      this.hasFormError = true
    }
  }
}
