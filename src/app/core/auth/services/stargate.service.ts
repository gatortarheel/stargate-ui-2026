import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PersonAstronaut {
  personId: number;
  name: string;
  currentRank: string;
  currentDutyTitle: string;
  careerStartDate: string;
  careerEndDate: string | null;
}

export interface AstronautDuty {
  id: number;
  personId: number;
  rank: string;
  dutyTitle: string;
  dutyStartDate: string;
  dutyEndDate: string | null;
}

export interface AstronautDutiesResponse {
  person: PersonAstronaut;
  astronautDuties: AstronautDuty[];
  success: boolean;
  message: string;
}

export interface PeopleResponse {
  people: PersonAstronaut[];
  success: boolean;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class StargateService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPeople(): Observable<PeopleResponse> {
    return this.http.get<PeopleResponse>(`${this.apiUrl}/Person`);
  }

  getAstronautDuties(name: string): Observable<AstronautDutiesResponse> {
    return this.http.get<AstronautDutiesResponse>(`${this.apiUrl}/AstronautDuty/${name}`);
  }
}