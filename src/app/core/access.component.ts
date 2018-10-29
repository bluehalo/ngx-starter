import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
	template: `
		<div class="container">
			<div class="row">
				<div class="col-md-8 offset-2 jumbotron" style="margin-top: 4rem;">

					<h1>{{status}}</h1>
					<p>{{message}}</p>

				</div>
			</div>
		</div>
	`,
	styles: [ '' ]
})
export class AccessComponent implements OnInit {

	loaded = false;

	status: string;
	message: string;


	constructor(
		private activatedRoute: ActivatedRoute
	) {}


	ngOnInit() {
		this.activatedRoute.params.subscribe((routeParams) => {
			this.loaded = true;

			this.status = routeParams.status;
			this.message = routeParams.message;
		});
	}

}
