import { Component } from '@angular/core';
import { AuthPageHeader } from '../../components/dashboard-page-header';

@Component({
    selector: 'app-overview',
    templateUrl: './overview.html',
    imports: [AuthPageHeader],
})
export class Overview { }
