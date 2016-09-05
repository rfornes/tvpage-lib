var _ = require('lodash');
var fs = require('fs');

var renderPartial = function(partial,obj){
	if ( _.isUndefined(partial) ) console.log('nope');
	var dataCheck = 'object' === typeof obj;
	var setts = dataCheck ? obj : {};
	setts.prefix = dataCheck ? obj.prefix : obj;
	
	var template = '';
	template += '<div class="'+(setts.prefix ? setts.prefix+'-' : '')+partial+'">';
	template += fs.readFileSync('templates/partials/'+partial+'.tmpl').toString();
	template += '</div/>'
	return _.template( template )( obj );
};

var renderItemTemplate = function(required){
	var pieces = ['thumbnail', 'title', 'metadata'];
	var diff = _.difference(pieces, required);
	
	for (var i = 0; i < diff.length; i++) {
		pieces = _.without(pieces, diff[i]);
	}

	var tmpl = '';
	for (var i = 0; i < pieces.length; i++) {
		if ('title' === pieces[i]) {
			tmpl += '<p>{{item.title|slice(0, 40)}}</p>';
		} else {
			tmpl += renderPartial(pieces[i]);
		}
	}

	return tmpl;
};

var Generator = {
	generate: function(partial, entity, opts){
		var getItems = function(ent){
			return ( ent === 'video' ? 'channel.videos' : ('product' === ent ? 'products' : '') )
		};
	 	
	 	var template = '';
		if ('gallery' === partial) {
			
			var searchBar = opts.searchBar;
			if ( !_.isUndefined(searchBar) && searchBar ) {
				template += renderPartial('search-bar', 'gallery');
			}
			
			template += renderPartial('grid',{
				prefix: 'gallery',
				items: getItems( entity ),
				itemTemplate: renderItemTemplate(opts.itemTemplate)
			});

			var pagination = opts.pagination;
			if ( !_.isUndefined(pagination) && pagination) {
				template += renderPartial('pagination',{
					prefix: 'gallery',
					pages: 5
				});
			}

		} else if ('list' === partial) {
			
			template += renderPartial('list',{
				prefix: 'related',
				items: getItems( entity ),
				itemTemplate: renderItemTemplate(opts.itemTemplate)
			});

		} else {

		}

	    return template;
	}
};

module['exports'] = Generator;