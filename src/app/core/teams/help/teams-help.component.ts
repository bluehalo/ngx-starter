import { Component } from '@angular/core';
import { HelpTopics } from '../../help/help-topic.component';

@Component({
	templateUrl: './teams-help.component.html'
})
export class TeamsHelpComponent {
}

HelpTopics.registerTopic('teams', TeamsHelpComponent, 9);
