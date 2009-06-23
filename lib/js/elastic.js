/*
	Elastic CSS Framework
	Released under the MIT, BSD, and GPL Licenses.
	More information http://elasticss.com
	
	Elastic Engine Module
	Provides
		Pixel rounding
		Calculations
		Helpers
		Events
		Configuration

	@author     Fernando Trasviña
	@core team  Sergio de la Garza, Javier Ayala
	@copyright  2009 Elastic CSS framework
	@version    2.0
*/
(function($){
	var CStyle = function (element, pseudoElement) {
		if (window.getComputedStyle){
			return window.getComputedStyle(element, pseudoElement);
		}
		else{
			return element.currentStyle;
		}
	};

	var width = function(element){
		var width = CStyle(element).width;
		if(width == 'auto'){
			return $(element).width();
		}else{
			return parseFloat(width);
		}
	};

	window.Elastic = function Elastic(context){
		var i,j,k,l,il,jl,kl,ll,
		econs, econ, econw, econclass, ecols, ecol, ecolclass, eg, egml, egcl, egnl, ecw, escol, rp, ig,
		efcs, efcsw, eecs, eecsw, eecw, ecs, ecsw, ec, ecclass,
		adaptive, ecolminw, ecolmaxw,
		egreg = /(^|\s+)on\-(\d+)(\s+|$)/,
		esreg = /(^|\s+)span\-(\d+)(\s+|$)/,
		eareg = /(^|\s+)adaptive\-(\d+)\-(\d+)(\s+|$)/;

		eg   = [];
		egcl = egnl = 0;

		econs = $.find('.columns', context);
		for(i = 0, il = econs.length; i < il; i++){
			econ = econs[i];
			econclass = econ.className;
			if(econclass.indexOf('on-') > -1 && egreg.test(econclass)){ egml = Number(RegExp.$2);}
			else{                                                       egml = $.find('> .column, > .container > .column', econ).length; }
			econ  = $.find('> .container', econ)[0] || econ;
			econw = width(econ);
			ecw   = Math.round( econw / egml);
			
			if(econclass.indexOf('adaptive-') > -1 && eareg.test(econclass)){
				ecolminw = Number(RegExp.$2);
				ecolmaxw = Number(RegExp.$3);
				
				if(ecw > ecolmaxw){
					while(ecw > ecolmaxw){
						egml  = egml + 1;
						ecw   = Math.round( econw / egml);
					}
				}
				else if(ecw < ecolminw){
					while(ecw < ecolminw){
						egml  = egml - 1;
						ecw   = Math.round( econw / egml);
					}
				}
			}
			
			ecols = $.find('> .column', econ);
			for(j = 0, jl = ecols.length; j < jl; j++){
				efcs  = [], eecs  = [], ecs   = [];
				rp    = ig = efcsw = ecsw = 0;
				ecol  = ecols[j];
				ecolclass = ecol.className;
				escol = 1;
				if(ecolclass.indexOf('span-') > -1 && esreg.test(ecolclass)){ escol = Number(RegExp.$2); }
				ecol.escol = ( (escol <= egml) ? escol : 1);
				egnl += escol;

				if(egnl == egml || j == (jl - 1) || ecolclass.indexOf('final') > -1){ eg.push(ecol); egcl = 0;     rp = 1; }
				else if(egnl <  egml){                                           eg.push(ecol); egcl = egnl; }
				else if(egnl >  egml){                                                          egcl = escol; rp = 1; ig = 1; }

				if(rp){
					for(k = 0, kl = eg.length; k < kl; k++){
						ec      = eg[k];
						ecclass = ec.className;
						if(     ecclass.indexOf('fixed')   > -1){ efcs.push(ec); efcsw += width(ec); }
						else if(ecclass.indexOf('elastic') > -1){ eecs.push(ec); }
						else                                    { ecs.push(ec); ec.style.width = (ecw * ec.escol) + 'px'; ecsw += width(ec); }
					}
					ll = eecs.length;
					if(ll > 0){
						eecw  = Math.round( ( width(econ) - ( ecsw + efcsw ) ) / ll);
						eecsw = eecw * ll;
						if(ll > 1){
							for(l=0; l<ll; l++){ eecs[l].style.width = eecw + 'px'; }
						}
						eecs[ll-1].style.width = ( width(econ) - ( ecsw + efcsw + (eecsw - eecw) ) ) + 'px';
					}
					else if(ecol.escol == egml && efcs.length == 0){
						ecol.style.width = width(econ) + 'px';
					}
					else if(ecs.length > 0 && efcs.length == 0 && egnl == egml){
						ecs[ecs.length - 1].style.width = ( width(econ) - ( (ecsw - width(ecs[ecs.length - 1]) ) + efcsw ) ) + 'px';
					}
					else if(egnl < egml && ecolclass.indexOf('final') > -1){
						ecol.style['margin' + ( (econclass.indexOf('inverted') > -1) ? 'Left' : 'Right')] = (width(econ) - ecsw - efcsw) + 'px';
					}
					eg = [];
					egnl = 0;
				}
				if(ig){eg = [ecol]; egnl = escol;}
			}
		}
		for(i in Elastic.helpers){
			if(Elastic.helpers.hasOwnProperty(i)){
				Elastic.helpers[i](context);
			}
		}
	};

	var Elastic = window.Elastic;

	Elastic.version = '2.0';

	Elastic.reset = function Elastic_reset(context){
		var doc = $(document);
		doc.trigger('elastic:beforeReset');
		var i,w,wl,h,hl,p,pl,m,ml;
		h = $.find('.same-height > *, .full-height, .elastic-height', context);
		for(i = 0, hl = h.length; i < hl; i++){h[i].style.height = '';}
		p = $.find('.vertical-center, .center, .bottom', context);
		for(i = 0, pl = p.length; i < pl; i++){p[i].parentNode.style.paddingTop = '';}
		w = $.find('.column:not(.fixed), .full-width', context);
		for(i = 0, wl = w.length; i < wl; i++){w[i].style.width = '';}
		m = $.find('.column.last', context);
		for(i = 0, ml = m.length; i < ml; i++){m[i].style.marginLeft = ''; m[i].style.marginRight = '';}
		doc.trigger('elastic:reset');
	};

	Elastic.refresh = function Elastic_refresh(context){
		var doc = $(document);
		doc.trigger('elastic:beforeRefresh');
		Elastic.reset(context);
		Elastic(context);
		doc.trigger('elastic:refresh');
	};

	Elastic.configuration = {
		refreshOnResize : true
	};

	Elastic.helpers = {
		'full-width'       : function Elastic_helper_fullWidth(context){
			var i, $el;
			var els = $.find('.full-width', context);
			var elsl = els.length;
			
			for(i = 0; i < elsl; i++){
				$el = $(els[i]);
				$el.width( $el.parent().width() - ( $el.outerWidth(true) - $el.width() ) );
			}
		},
		'same-height'      : function Elastic_helper_sameHeight(context){
			$('.same-height', context).each(function(){
				var columns = $('> *', this);
				var maxHeight = 0;
				columns.each(function(){
					var currentHeight = $(this).outerHeight(true);
					maxHeight = (maxHeight > currentHeight) ? maxHeight : currentHeight;
				}).each(function(){
					$(this).css('height', maxHeight);
				});
			});
		},
		'full-height'      : function Elastic_helper_fullHeight(context){
			$('.full-height', context).each(function(){
				var _this = $(this);
				_this.css('height', $(this.parentNode).height() - ( _this.outerHeight(true) - _this.height() ));
			});
		},
		'elastic-height'   : function Elastic_helper_elasticHeight(context){
			$('.elastic-height', context).each(function(){
				var _this = $(this);
				var h = 0;
				$('> *:not(.elastic-height)', this.parentNode).each(function(){
					h += $(this).outerHeight(true);
				});
				_this.css('height', Math.round(_this.parent().height() - h));
				Elastic.refresh(this);
			});
		},
		'center'           : function Elastic_helper_center(context){
			$('.vertical-center, .center', context).each(function(){
				var parentNode = $(this.parentNode);
				var paddingTop = Math.round( ( parentNode.height() - $(this).outerHeight(true) ) / 2 );
				parentNode.css({
					paddingTop : paddingTop + 'px',
					height     : ( parentNode.css('height') ) ? ( parentNode.outerHeight() - paddingTop ) : ''
				});
			});
		},
		'bottom'          : function Elastic_helper_bottom(context){
			$('.bottom', context).each(function(){
				var parentNode = $(this.parentNode);
				var paddingTop = Math.round( parentNode.height() - $(this).outerHeight(true) );
				parentNode.css({
					paddingTop : paddingTop + 'px',
					height     : ( parentNode.css('height') ) ? ( parentNode.outerHeight() - paddingTop ) : ''
				});
			});
		}
	};
	
	/*
		Elastic Layouts
	*/
	$(document).bind('elastic:beforeInitialize', function(){
		var r = /(^|\s+)display\s+([\w\_\-\d]+)(\s+|$)/;
		$('.display').each(function Elastic_layout(){
			r.test(this.className);
			var c = '.position-' + RegExp.$2;
			$(c).removeClass(c).appendTo(this); 
		});
	});
})(jQuery);

// due to a safari 4 final bug, this initialization must be done on window.load event
// definitely a must fix either on elastic or jquery
jQuery(window).bind('load', function(){
	var doc = jQuery(document);
	var iw  = document.body.clientWidth;
	doc.trigger('elastic:beforeInitialize');
	Elastic();
	if(iw != document.body.clientWidth){
		Elastic.refresh();
	}
	jQuery(window).bind('resize',function Elastic_resizeHandler(){
		if(Elastic.configuration.refreshOnResize){
			Elastic.refresh();
		}
	});
	doc.bind('elastic', Elastic.refresh);
	doc.trigger('elastic:initialize');
});