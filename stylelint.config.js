'use strict';

module.exports = {
	'extends': 'stylelint-config-recommended-scss',
	'plugins': [
		'stylelint-scss'
	],
	'rules': {
		'at-rule-empty-line-before': null,
		'indentation': [ 'tab' ],
		'no-descending-specificity': null,
		'no-empty-source': null,
		"selector-pseudo-element-no-unknown": [
			true,
			{
				"ignorePseudoElements": ["ng-deep"]
			}
		]
	}
};
