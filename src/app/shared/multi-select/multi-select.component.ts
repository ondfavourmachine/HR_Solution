import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { debounceTime, defer, fromEvent, lastValueFrom, } from 'rxjs';
import { InterviewTypes, SearchedApplicant, StaffName } from 'src/app/models/scheduleModels';
import { ScheduleService } from 'src/app/services/schedule.service';
import { SharedService } from 'src/app/services/sharedServices';

@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss']
})
export class MultiSelectComponent implements OnInit {
  @Input()
  labelName: string = '';

  @Input()
  showAdditionButton: boolean = true;

  @Input()
  placeholder: string = 'Type applicant name here';

  @Input()
  department?: string

  @Input()
  interviewType!: InterviewTypes;

  @Input()
  showMultiSelectApplicantsButton: boolean = false;

  @ViewChild('searchFieldForApplicant', {read: ElementRef, static: true}) searchFieldForApplicant!: ElementRef<HTMLInputElement>

  @Output() sendUpApplicants = new EventEmitter<{target:string, data: Array<Partial<StaffName & SearchedApplicant>>}>();
  searchedPersons: Array<Partial<StaffName & SearchedApplicant>> = [];
  selectedApplicants: Set<string> = new Set();
  // searchedStaff: Array<Partial<StaffName & SearchedApplicant>> = [];
  constructor(private scheduleService: ScheduleService, private sharedService: SharedService) {this.searchForPerson = this.searchForPerson.bind(this)}

  ngOnInit(): void {
    // using defer because i am accessing this viewChild in the ngOnInit life cyle hook and because i set static to true in the viewChild config.
    // if use fromEvent without wrapping it with defer here in this life cycle hook, inconsistencies might arise.
    defer(() => fromEvent<InputEvent, HTMLInputElement>(this.searchFieldForApplicant.nativeElement, 'input', (event: Event)=> (event.target as HTMLInputElement) ).pipe(debounceTime(1000)))
    .subscribe({next: this.searchForPerson, error: console.error})
  }

  async searchForPerson<T extends HTMLInputElement>(element: T){
    // this.selectedApplicants = new Set();
    // this.searchedPersons = [];
    if(element.value.length < 1 ) {this.searchedPersons = []; return}
    console.log(element.id)
    try {
      switch(element.id){
        case 'Add Applicant':
          await this.getApplicants();
        break;
        case 'Invigilators':
        case 'Panel Chair (Main Interviewer)':
        case 'Other Interviewers (Optional)':
        case 'Other Interviewers':
          const {result: res} = await lastValueFrom(this.scheduleService.getStaff(this.department!, element.value));
          this.searchedPersons = res;
          // console.log(this.searchedPersons);
        break;
      }
    } catch (error) {
      console.log(error);
      this.searchedPersons = [];
    } 
  }

  async getApplicants(value?: string, event?: Event){
    let prevInnerHtml!: string;
    let button!: HTMLButtonElement;
    if(event) {
      button = event.target instanceof HTMLImageElement ? event.target.closest('button') as HTMLButtonElement : event.target as HTMLButtonElement;
      prevInnerHtml = button?.innerHTML;
      this.sharedService.loading4button(button as HTMLButtonElement, 'yes', 'Loading Applicants...');
    }
    const interviewtype = this.interviewType.split('_')[this.interviewType.split('_').length - 1] ?? 0
    const {result} = await lastValueFrom(this.scheduleService.getApplicants(parseInt(interviewtype), value ?? undefined));
    this.sharedService.loading4button(button, 'done', prevInnerHtml as string);
    this.searchedPersons = Array.isArray(result) ? [...result] : [];
    this.searchedPersons.length > 0 ? this.loadSearchedApplicantsIntoSelectedApplicants(): null;
    this.searchedPersons.length > 0 ? this.sendUpListOfSelecteedApplicantsToParent(): null;
    Array.isArray(result) ? null : this.sharedService.successSnackBar(`No Applicants on queue for ${this.interviewType.split('_')[0]}`, 'close');
  }

  loadSearchedApplicantsIntoSelectedApplicants(){
    this.searchedPersons.forEach(elem => this.selectedApplicants.add(`${elem?.firstName} ${elem.lastName}`));
  }

  selectAnApplicant(event: Event, applicant: Partial<StaffName & SearchedApplicant>){
    const {target} = event;
    if(target instanceof HTMLLIElement){
      const input = target.querySelector<HTMLInputElement>('input');
      input!.checked = !input?.checked;
      input!.checked ? this.selectedApplicants.add(this.isStaffTypeOfPerson(applicant) ? `${applicant.displayName}` : `${applicant?.firstName} ${applicant.lastName}`) : this.selectedApplicants.delete(this.isStaffTypeOfPerson(applicant) ? `${applicant.displayName}` : `${applicant?.firstName} ${applicant.lastName}`);
    }
    else if( target instanceof HTMLSpanElement){
      const input = (<HTMLLIElement>target.closest('li')).querySelector<HTMLInputElement>('input');
      input!.checked = !input?.checked;
      input!.checked ? this.selectedApplicants.add(this.isStaffTypeOfPerson(applicant) ? `${applicant.displayName}` : `${applicant?.firstName} ${applicant.lastName}`) : this.selectedApplicants.delete(this.isStaffTypeOfPerson(applicant) ? `${applicant.displayName}` : `${applicant?.firstName} ${applicant.lastName}`);;
    }
    else{
     const {checked} = target as HTMLInputElement;
     checked ? this.selectedApplicants.add(this.isStaffTypeOfPerson(applicant) ? `${applicant.displayName}` : `${applicant?.firstName} ${applicant.lastName}`) : this.selectedApplicants.delete(this.isStaffTypeOfPerson(applicant) ? `${applicant.displayName}` : `${applicant?.firstName} ${applicant.lastName}`);
    }
    console.log(this.selectedApplicants);
  }


  sendUpListOfSelecteedApplicantsToParent(){
    const arrOfSelected = Array.from(this.selectedApplicants);
    const arr = this.searchedPersons.filter(elem => arrOfSelected.indexOf(this.isStaffTypeOfPerson(elem) ? elem.displayName as string : `${elem.firstName} ${elem.lastName}`) > -1 )
    this.sendUpApplicants.emit({target: this.labelName, data: Array.from(arr)});
    this.resetStatus();
  }

  resetStatus(){
    this.selectedApplicants = new Set();
    this.searchedPersons = [];
    this.searchFieldForApplicant.nativeElement.value = '';
  }

  trackSearchedPerson(index: number, item: Partial<StaffName & SearchedApplicant>){
    return item.displayName || item?.applicationRefNo
  }

  name(person: Partial<StaffName & SearchedApplicant>): string{
    return person?.displayName  ?? person.firstName + ' ' + person?.lastName
  }

  isStaffTypeOfPerson(person: Partial<StaffName & SearchedApplicant>): boolean{
    return 'displayName' in person;
  }

}
