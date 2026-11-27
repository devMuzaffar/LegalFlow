/*
   Pipeline Strip

   Automated processing pipeline as a five-step tracker. Each step carries a
   hover stat and its own progress bar.
*/

import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProgressBar } from 'primeng/progressbar';
import { Tag } from 'primeng/tag';
import { Tooltip } from 'primeng/tooltip';
import { AppCard } from '../../../../components/app-card/app-card';
import { PipelineStep } from '../../data/matters';

@Component({
    selector: 'app-pipeline-strip',
    imports: [AppCard, RouterLink, ProgressBar, Tag, Tooltip],
    templateUrl: './pipeline-strip.html',
    host: { class: 'block h-full' },
})
export class PipelineStrip {
    // Vars
    readonly steps = input.required<readonly PipelineStep[]>();

    // Derived
    readonly done = computed(() => this.steps().filter((s) => s.progress === 100).length);

    /** Mean progress across all steps. */
    readonly overallPct = computed(() => {
        const steps = this.steps();
        return steps.length
            ? Math.round(steps.reduce((sum, s) => sum + s.progress, 0) / steps.length)
            : 0;
    });

    isComplete(step: PipelineStep): boolean {
        return step.progress === 100;
    }
}
