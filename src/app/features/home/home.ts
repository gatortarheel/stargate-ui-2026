import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StargateService, PersonAstronaut, AstronautDuty } from '../../core/services/stargate.service';
import { Auth } from '../../core/auth/auth';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  people = signal<PersonAstronaut[]>([]);
  selectedPerson = signal<PersonAstronaut | null>(null);
  duties = signal<AstronautDuty[]>([]);
  loading = signal(false);
  loadingDuties = signal(false);
  searchName = '';

  constructor(private stargate: StargateService, private auth: Auth) {
    this.loadPeople();
  }

  async loadPeople(): Promise<void> {
    this.loading.set(true);
    try {
      const response = await this.stargate.getPeople().toPromise();
      this.people.set(response?.people ?? []);
    } finally {
      this.loading.set(false);
    }
  }

  async selectPerson(person: PersonAstronaut): Promise<void> {
    this.selectedPerson.set(person);
    this.loadingDuties.set(true);
    this.duties.set([]);
    try {
      const response = await this.stargate.getAstronautDuties(person.name).toPromise();
      this.duties.set(response?.astronautDuties ?? []);
    } finally {
      this.loadingDuties.set(false);
    }
  }

  logout(): void {
    this.auth.logout();
  }

  isRetired(person: PersonAstronaut): boolean {
    return person.currentDutyTitle === 'RETIRED';
  }
}