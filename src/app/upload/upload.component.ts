import { Component, OnInit } from '@angular/core';

import { environment } from '@env/environment';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { UploadService } from '@app/upload/upload.service';
import { AuthenticationService } from '@app/core';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  version: string = environment.version;
  fileToUpload: File = null;
  user_info: any;
  loading$ = false;
  message = '';

  constructor(
    private http: HttpClient,
    private uploadService: UploadService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.user_info = this.authenticationService.userInfo();
  }

  handleFileInput(files: FileList) {
    this.loading$ = true;
    console.log('this.loading$', this.loading$);
    this.fileToUpload = files.item(0);
    this.onSubmit(this.fileToUpload);
  }

  onSubmit(fileToUpload: any) {
    const formData = new FormData();
    formData.append('file', fileToUpload);
    this.uploadService
      .uploadProductList(formData)
      .pipe(
        finalize(() => {
          this.loading$ = false;
        })
      )
      .subscribe(events => {
        // this.message = 'Uploaded successfully';
      });
  }

  onSelectFile(event: any) {
    // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event: any) => {
        // called once readAsDataURL is completed
        // this.url = event.target.result;
      };
    }
  }
}
