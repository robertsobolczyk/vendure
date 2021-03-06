import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { Country, CreateCountryInput, LanguageCode, UpdateCountryInput } from 'shared/generated-types';

import { BaseDetailComponent } from '../../../common/base-detail.component';
import { createUpdatedTranslatable } from '../../../common/utilities/create-updated-translatable';
import { _ } from '../../../core/providers/i18n/mark-for-extraction';
import { NotificationService } from '../../../core/providers/notification/notification.service';
import { DataService } from '../../../data/providers/data.service';
import { ServerConfigService } from '../../../data/server-config';

@Component({
    selector: 'vdr-country-detail',
    templateUrl: './country-detail.component.html',
    styleUrls: ['./country-detail.component.scss'],
})
export class CountryDetailComponent extends BaseDetailComponent<Country.Fragment>
    implements OnInit, OnDestroy {
    country$: Observable<Country.Fragment>;
    detailForm: FormGroup;

    constructor(
        router: Router,
        route: ActivatedRoute,
        serverConfigService: ServerConfigService,
        private changeDetector: ChangeDetectorRef,
        private dataService: DataService,
        private formBuilder: FormBuilder,
        private notificationService: NotificationService,
    ) {
        super(route, router, serverConfigService);
        this.detailForm = this.formBuilder.group({
            code: ['', Validators.required],
            name: ['', Validators.required],
            enabled: [true],
        });
    }

    ngOnInit() {
        this.init();
        this.country$ = this.entity$;
    }

    ngOnDestroy(): void {
        this.destroy();
    }

    create() {
        if (!this.detailForm.dirty) {
            return;
        }
        combineLatest(this.country$, this.languageCode$)
            .pipe(
                take(1),
                mergeMap(([country, languageCode]) => {
                    const formValue = this.detailForm.value;
                    const input: CreateCountryInput = createUpdatedTranslatable({
                        translatable: country,
                        updatedFields: formValue,
                        languageCode,
                        defaultTranslation: {
                            name: formValue.name,
                            languageCode,
                        },
                    });
                    return this.dataService.settings.createCountry(input);
                }),
            )
            .subscribe(
                data => {
                    this.notificationService.success(_('common.notify-create-success'), {
                        entity: 'Country',
                    });
                    this.detailForm.markAsPristine();
                    this.changeDetector.markForCheck();
                    this.router.navigate(['../', data.createCountry.id], { relativeTo: this.route });
                },
                err => {
                    this.notificationService.error(_('common.notify-create-error'), {
                        entity: 'Country',
                    });
                },
            );
    }

    save() {
        combineLatest(this.country$, this.languageCode$)
            .pipe(
                take(1),
                mergeMap(([country, languageCode]) => {
                    const formValue = this.detailForm.value;
                    const input: UpdateCountryInput = createUpdatedTranslatable({
                        translatable: country,
                        updatedFields: formValue,
                        languageCode,
                    });
                    return this.dataService.settings.updateCountry(input);
                }),
            )
            .subscribe(
                data => {
                    this.notificationService.success(_('common.notify-update-success'), {
                        entity: 'Country',
                    });
                    this.detailForm.markAsPristine();
                    this.changeDetector.markForCheck();
                },
                err => {
                    this.notificationService.error(_('common.notify-update-error'), {
                        entity: 'Country',
                    });
                },
            );
    }

    protected setFormValues(country: Country, languageCode: LanguageCode): void {
        const currentTranslation = country.translations.find(t => t.languageCode === languageCode);
        if (currentTranslation) {
            this.detailForm.patchValue({
                code: country.code,
                name: currentTranslation.name,
                enabled: country.enabled,
            });
        }
    }
}
