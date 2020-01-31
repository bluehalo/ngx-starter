'use strict';

module.exports = {
	'extends': [
		'stylelint-config-recommended-scss',
		'stylelint-config-prettier'
	],
	'plugins': [
		'stylelint-prettier',
		'stylelint-scss'
	],
	'rules': {
		'prettier/prettier': true,
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
