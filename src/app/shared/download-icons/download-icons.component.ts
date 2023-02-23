import { Component, Input, OnInit } from '@angular/core';
import { AssessmentDetails } from 'src/app/models/assessment.models';
import { AnApplication, DownloadAsExcelAndPdfData } from 'src/app/models/generalModels';
import { SharedService } from 'src/app/services/sharedServices';
import {  jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import {UserOptions} from 'jspdf-autotable';

@Component({
  selector: 'app-download-icons',
  templateUrl: './download-icons.component.html',
  styleUrls: ['./download-icons.component.scss']
})
export class DownloadIconsComponent implements OnInit {
  @Input('dataToUse') dataToUse!: DownloadAsExcelAndPdfData
  constructor(private sharedService: SharedService) { }

  ngOnInit(): void {
  }

  downloadExcel(){
    this.sharedService.downloadAsExcel(this.dataToUse.data, 'applicants-selected');
  }

  downloadAsPdf(){
    const rows =  this.dataToUse.rows
  var doc =  new jsPDF('landscape', 'mm', [320, 320]);
  const options:UserOptions = {
    head: [this.dataToUse.columns],
    body: rows,
    headStyles: {
      fillColor: '#F4F7FF',
      textColor: 'black'
    }
  }
  autoTable(doc, options);
  doc.save( 'fileName' in this.dataToUse && this.dataToUse.fileName != null ? this.dataToUse.fileName : 'applicants_selected.pdf');
  }

}
