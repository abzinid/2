(function($){$.fn.theiaStickySidebar=function(options){var defaults={'containerSelector':'','additionalMarginTop':0,'additionalMarginBottom':0,'updateSidebarHeight':true,'minWidth':0,'disableOnResponsiveLayouts':true,'sidebarBehavior':'modern','defaultPosition':'relative','namespace':'TSS'};options=$.extend(defaults,options);options.additionalMarginTop=parseInt(options.additionalMarginTop)||0;options.additionalMarginBottom=parseInt(options.additionalMarginBottom)||0;tryInitOrHookIntoEvents(options,this);function tryInitOrHookIntoEvents(options,$that){var success=tryInit(options,$that);if(!success){console.log('TSS: Body width smaller than options.minWidth. Init is delayed.');$(document).on('scroll.'+options.namespace,function(options,$that){return function(evt){var success=tryInit(options,$that);if(success){$(this).unbind(evt)}}}(options,$that));$(window).on('resize.'+options.namespace,function(options,$that){return function(evt){var success=tryInit(options,$that);if(success){$(this).unbind(evt)}}}(options,$that))}}function tryInit(options,$that){if(options.initialized===true){return true}if($('body').width()<options.minWidth){return false}init(options,$that);return true}function init(options,$that){options.initialized=true;var existingStylesheet=$('#theia-sticky-sidebar-stylesheet-'+options.namespace);if(existingStylesheet.length===0){$('head').append($('<style id="theia-sticky-sidebar-stylesheet-'+options.namespace+'">.theiaStickySidebar:after {content: ""; display: table; clear: both;}</style>'))}$that.each(function(){var o={};o.sidebar=$(this);o.options=options||{};o.container=$(o.options.containerSelector);if(o.container.length==0){o.container=o.sidebar.parent()}o.sidebar.parents().css('-webkit-transform','none');o.sidebar.css({'position':o.options.defaultPosition,'overflow':'visible','-webkit-box-sizing':'border-box','-moz-box-sizing':'border-box','box-sizing':'border-box'});o.stickySidebar=o.sidebar.find('.theiaStickySidebar');if(o.stickySidebar.length==0){var javaScriptMIMETypes=/(?:text|application)\/(?:x-)?(?:javascript|ecmascript)/i;o.sidebar.find('script').filter(function(index,script){return script.type.length===0||script.type.match(javaScriptMIMETypes)}).remove();o.stickySidebar=$('<div>').addClass('theiaStickySidebar').append(o.sidebar.children());o.sidebar.append(o.stickySidebar)}o.marginBottom=parseInt(o.sidebar.css('margin-bottom'));o.paddingTop=parseInt(o.sidebar.css('padding-top'));o.paddingBottom=parseInt(o.sidebar.css('padding-bottom'));var collapsedTopHeight=o.stickySidebar.offset().top;var collapsedBottomHeight=o.stickySidebar.outerHeight();o.stickySidebar.css('padding-top',1);o.stickySidebar.css('padding-bottom',1);collapsedTopHeight-=o.stickySidebar.offset().top;collapsedBottomHeight=o.stickySidebar.outerHeight()-collapsedBottomHeight-collapsedTopHeight;if(collapsedTopHeight==0){o.stickySidebar.css('padding-top',0);o.stickySidebarPaddingTop=0}else{o.stickySidebarPaddingTop=1}if(collapsedBottomHeight==0){o.stickySidebar.css('padding-bottom',0);o.stickySidebarPaddingBottom=0}else{o.stickySidebarPaddingBottom=1}o.previousScrollTop=null;o.fixedScrollTop=0;resetSidebar();o.onScroll=function(o){if(!o.stickySidebar.is(":visible")){return}if($('body').width()<o.options.minWidth){resetSidebar();return}if(o.options.disableOnResponsiveLayouts){var sidebarWidth=o.sidebar.outerWidth(o.sidebar.css('float')=='none');if(sidebarWidth+50>o.container.width()){resetSidebar();return}}var scrollTop=$(document).scrollTop();var position='static';if(scrollTop>=o.sidebar.offset().top+(o.paddingTop-o.options.additionalMarginTop)){var offsetTop=o.paddingTop+options.additionalMarginTop;var offsetBottom=o.paddingBottom+o.marginBottom+options.additionalMarginBottom;var containerTop=o.sidebar.offset().top;var containerBottom=o.sidebar.offset().top+getClearedHeight(o.container);var windowOffsetTop=0+options.additionalMarginTop;var windowOffsetBottom;var sidebarSmallerThanWindow=(o.stickySidebar.outerHeight()+offsetTop+offsetBottom)<$(window).height();if(sidebarSmallerThanWindow){windowOffsetBottom=windowOffsetTop+o.stickySidebar.outerHeight()}else{windowOffsetBottom=$(window).height()-o.marginBottom-o.paddingBottom-options.additionalMarginBottom}var staticLimitTop=containerTop-scrollTop+o.paddingTop;var staticLimitBottom=containerBottom-scrollTop-o.paddingBottom-o.marginBottom;var top=o.stickySidebar.offset().top-scrollTop;var scrollTopDiff=o.previousScrollTop-scrollTop;if(o.stickySidebar.css('position')=='fixed'){if(o.options.sidebarBehavior=='modern'){top+=scrollTopDiff}}if(o.options.sidebarBehavior=='stick-to-top'){top=options.additionalMarginTop}if(o.options.sidebarBehavior=='stick-to-bottom'){top=windowOffsetBottom-o.stickySidebar.outerHeight()}if(scrollTopDiff>0){top=Math.min(top,windowOffsetTop)}else{top=Math.max(top,windowOffsetBottom-o.stickySidebar.outerHeight())}top=Math.max(top,staticLimitTop);top=Math.min(top,staticLimitBottom-o.stickySidebar.outerHeight());var sidebarSameHeightAsContainer=o.container.height()==o.stickySidebar.outerHeight();if(!sidebarSameHeightAsContainer&&top==windowOffsetTop){position='fixed'}else if(!sidebarSameHeightAsContainer&&top==windowOffsetBottom-o.stickySidebar.outerHeight()){position='fixed'}else if(scrollTop+top-o.sidebar.offset().top-o.paddingTop<=options.additionalMarginTop){position='static'}else{position='absolute'}}if(position=='fixed'){var scrollLeft=$(document).scrollLeft();o.stickySidebar.css({'position':'fixed','width':getWidthForObject(o.stickySidebar)+'px','transform':'translateY('+top+'px)','left':(o.sidebar.offset().left+parseInt(o.sidebar.css('padding-left'))-scrollLeft)+'px','top':'0px'})}else if(position=='absolute'){var css={};if(o.stickySidebar.css('position')!='absolute'){css.position='absolute';css.transform='translateY('+(scrollTop+top-o.sidebar.offset().top-o.stickySidebarPaddingTop-o.stickySidebarPaddingBottom)+'px)';css.top='0px'}css.width=getWidthForObject(o.stickySidebar)+'px';css.left='';o.stickySidebar.css(css)}else if(position=='static'){resetSidebar()}if(position!='static'){if(o.options.updateSidebarHeight==true){o.sidebar.css({'min-height':o.stickySidebar.outerHeight()+o.stickySidebar.offset().top-o.sidebar.offset().top+o.paddingBottom})}}o.previousScrollTop=scrollTop};o.onScroll(o);$(document).on('scroll.'+o.options.namespace,function(o){return function(){o.onScroll(o)}}(o));$(window).on('resize.'+o.options.namespace,function(o){return function(){o.stickySidebar.css({'position':'static'});o.onScroll(o)}}(o));if(typeof ResizeSensor!=='undefined'){new ResizeSensor(o.stickySidebar[0],function(o){return function(){o.onScroll(o)}}(o))}function resetSidebar(){o.fixedScrollTop=0;o.sidebar.css({'min-height':'1px'});o.stickySidebar.css({'position':'static','width':'','transform':'none'})}function getClearedHeight(e){var height=e.height();e.children().each(function(){height=Math.max(height,$(this).height())});return height}})}function getWidthForObject(object){var width;try{width=object[0].getBoundingClientRect().width}catch(err){}if(typeof width==="undefined"){width=object.width()}return width}return this}})(jQuery);
;
$(function () {
    $('#main-menu')['each'](function () {
        var _0x5d4ex2 = $(this)['find']('.LinkList ul > li')['children']('a'),
            _0x5d4ex3 = _0x5d4ex2['length'];
        for (var _0x5d4ex4 = 0; _0x5d4ex4 < _0x5d4ex3; _0x5d4ex4++) {
            var _0x5d4ex5 = _0x5d4ex2['eq'](_0x5d4ex4),
                _0x5d4ex6 = _0x5d4ex5['text']();
            if (_0x5d4ex6['charAt'](0) !== '_') {
                var _0x5d4ex7 = _0x5d4ex2['eq'](_0x5d4ex4 + 1),
                    _0x5d4ex8 = _0x5d4ex7['text']();
                if (_0x5d4ex8['charAt'](0) === '_') {
                    var _0x5d4ex9 = _0x5d4ex5['parent']();
                    _0x5d4ex9['append']('<ul class="sub-menu m-sub"/>')
                }
            };
            if (_0x5d4ex6['charAt'](0) === '_') {
                _0x5d4ex5['text'](_0x5d4ex6['replace']('_', ''));
                _0x5d4ex5['parent']()['appendTo'](_0x5d4ex9['children']('.sub-menu'))
            }
        };
        for (var _0x5d4ex4 = 0; _0x5d4ex4 < _0x5d4ex3; _0x5d4ex4++) {
            var _0x5d4exa = _0x5d4ex2['eq'](_0x5d4ex4),
                _0x5d4exb = _0x5d4exa['text']();
            if (_0x5d4exb['charAt'](0) !== '_') {
                var _0x5d4exc = _0x5d4ex2['eq'](_0x5d4ex4 + 1),
                    _0x5d4exd = _0x5d4exc['text']();
                if (_0x5d4exd['charAt'](0) === '_') {
                    var _0x5d4exe = _0x5d4exa['parent']();
                    _0x5d4exe['append']('<ul class="sub-menu2 m-sub"/>')
                }
            };
            if (_0x5d4exb['charAt'](0) === '_') {
                _0x5d4exa['text'](_0x5d4exb['replace']('_', ''));
                _0x5d4exa['parent']()['appendTo'](_0x5d4exe['children']('.sub-menu2'))
            }
        };
        $('#main-menu ul li ul')['parent']('li')['addClass']('has-sub');
        $('#main-menu .widget')['addClass']('show-menu')
    });
    $('#main-menu-nav')['clone']()['appendTo']('.mobile-menu');
    $('.mobile-menu .has-sub')['append']('<div class="submenu-toggle"/>');
    $('.mobile-menu ul > li a')['each'](function () {
        var _0x5d4exf = $(this),
            _0x5d4ex10 = _0x5d4exf['attr']('href')['trim'](),
            _0x5d4ex11 = _0x5d4ex10['toLowerCase'](),
            _0x5d4ex12 = _0x5d4ex10['split']('/'),
            _0x5d4ex13 = _0x5d4ex12[0];
        if (_0x5d4ex11['match']('mega-menu')) {
            _0x5d4exf['attr']('href', '/search/label/' + _0x5d4ex13 + '?&max-results=' + postPerPage)
        }
    });
    $('.slide-menu-toggle')['on']('click', function () {
        $('body')['toggleClass']('nav-active')
    });
    $('.mobile-menu ul li .submenu-toggle')['on']('click', function (_0x5d4exf) {
        if ($(this)['parent']()['hasClass']('has-sub')) {
            _0x5d4exf['preventDefault']();
            if (!$(this)['parent']()['hasClass']('show')) {
                $(this)['parent']()['addClass']('show')['children']('.m-sub')['slideToggle'](170)
            } else {
                $(this)['parent']()['removeClass']('show')['find']('> .m-sub')['slideToggle'](170)
            }
        }
    });
    $('.show-search')['on']('click', function () {
        $('#nav-search')['fadeIn'](250)['find']('input')['focus']()
    });
    $('.hide-search')['on']('click', function () {
        $('#nav-search')['fadeOut'](250)['find']('input')['blur']()
    });
    $('.Label a, a.b-label')['attr']('href', function (_0x5d4exf, _0x5d4ex14) {
        return _0x5d4ex14['replace'](_0x5d4ex14, _0x5d4ex14 + '?&max-results=' + postPerPage)
    });
    $('.avatar-image-container img')['attr']('src', function (_0x5d4exf, _0x5d4ex4) {
        _0x5d4ex4 = _0x5d4ex4['replace']('/s35-c/', '/s45-c/');
        _0x5d4ex4 = _0x5d4ex4['replace']('//img1.blogblog.com/img/blank.gif', '//4.bp.blogspot.com/-uCjYgVFIh70/VuOLn-mL7PI/AAAAAAAADUs/Kcu9wJbv790hIo83rI_s7lLW3zkLY01EA/s55-r/avatar.png');
        return _0x5d4ex4
    });
    $('.author-description a')['each'](function () {
        $(this)['attr']('target', '_blank')
    });
    $('.post-nav')['each'](function () {
        var _0x5d4ex15 = $('a.prev-post-link')['attr']('href'),
            _0x5d4ex16 = $('a.next-post-link')['attr']('href');
        $['ajax']({
            url: _0x5d4ex15,
            type: 'get',
            success: function (_0x5d4ex17) {
                var _0x5d4ex18 = $(_0x5d4ex17)['find']('.blog-post h1.post-title')['text']();
                $('.post-prev a .post-nav-inner p')['text'](_0x5d4ex18)
            }
        });
        $['ajax']({
            url: _0x5d4ex16,
            type: 'get',
            success: function (_0x5d4ex19) {
                var _0x5d4ex18 = $(_0x5d4ex19)['find']('.blog-post h1.post-title')['text']();
                $('.post-next a .post-nav-inner p')['text'](_0x5d4ex18)
            }
        })
    });
    $('.post-body strike')['each'](function () {
        var _0x5d4exf = $(this),
            _0x5d4ex11 = _0x5d4exf['text']();
        if (_0x5d4ex11['match']('left-sidebar')) {
            _0x5d4exf['replaceWith']('<style>.item #main-wrapper{float:right}.item #sidebar-wrapper{float:left}</style>')
        };
        if (_0x5d4ex11['match']('right-sidebar')) {
            _0x5d4exf['replaceWith']('<style>.item #main-wrapper{float:left}.item #sidebar-wrapper{float:right}</style>')
        };
        if (_0x5d4ex11['match']('full-width')) {
            _0x5d4exf['replaceWith']('<style>.item #main-wrapper{width:100%}.item #sidebar-wrapper{display:none}</style>')
        }
    });
    $('#main-wrapper, #sidebar-wrapper')['each'](function () {
        if (fixedSidebar == true) {
            $(this)['theiaStickySidebar']({
                additionalMarginTop: 30,
                additionalMarginBottom: 30
            })
        }
    });
    $('.back-top')['each'](function () {
        var _0x5d4exf = $(this);
        $(window)['on']('scroll', function () {
            $(this)['scrollTop']() >= 100 ? _0x5d4exf['fadeIn'](250) : _0x5d4exf['fadeOut'](250)
        }), _0x5d4exf['click'](function () {
            $('html, body')['animate']({
                scrollTop: 0
            }, 500)
        })
    });
    $('#main-menu #main-menu-nav li')['each'](function () {
        var _0x5d4ex1a = $(this),
            _0x5d4ex10 = _0x5d4ex1a['find']('a')['attr']('href')['trim'](),
            _0x5d4exf = _0x5d4ex1a,
            _0x5d4ex11 = _0x5d4ex10['toLowerCase'](),
            _0x5d4ex12 = _0x5d4ex10['split']('/'),
            _0x5d4ex13 = _0x5d4ex12[0];
        _0x5d4ex31(_0x5d4exf, _0x5d4ex11, 4, _0x5d4ex13)
    });
    $('.common-widget .widget-content')['each'](function () {
        var _0x5d4exf = $(this),
            _0x5d4ex10 = _0x5d4exf['text']()['trim'](),
            _0x5d4ex11 = _0x5d4ex10['toLowerCase'](),
            _0x5d4ex12 = _0x5d4ex10['split']('/'),
            _0x5d4ex1b = _0x5d4ex12[0],
            _0x5d4ex13 = _0x5d4ex12[1];
        _0x5d4ex31(_0x5d4exf, _0x5d4ex11, _0x5d4ex1b, _0x5d4ex13)
    });
    $('.related-ready')['each'](function () {
        var _0x5d4exf = $(this),
            _0x5d4ex13 = _0x5d4exf['find']('.related-tag')['data']('label');
        _0x5d4ex31(_0x5d4exf, 'related', 3, _0x5d4ex13)
    });

    function _0x5d4ex1c(_0x5d4ex1d, _0x5d4ex4) {
        for (var _0x5d4ex1e = 0; _0x5d4ex1e < _0x5d4ex1d[_0x5d4ex4]['link']['length']; _0x5d4ex1e++) {
            if (_0x5d4ex1d[_0x5d4ex4]['link'][_0x5d4ex1e]['rel'] == 'alternate') {
                var _0x5d4ex1f = _0x5d4ex1d[_0x5d4ex4]['link'][_0x5d4ex1e]['href'];
                break
            }
        };
        return _0x5d4ex1f
    }

    function _0x5d4ex20(_0x5d4ex1d, _0x5d4ex4, _0x5d4ex1f) {
        var _0x5d4ex21 = _0x5d4ex1d[_0x5d4ex4]['title']['$t'],
            _0x5d4ex22 = '<a href="' + _0x5d4ex1f + '">' + _0x5d4ex21 + '</a>';
        return _0x5d4ex22
    }

    function _0x5d4ex23(_0x5d4ex1d, _0x5d4ex4) {
        var _0x5d4ex21 = _0x5d4ex1d[_0x5d4ex4]['author'][0]['name']['$t'],
            _0x5d4ex22 = '<span class="post-author"><a>' + _0x5d4ex21 + '</a></span>';
        return _0x5d4ex22
    }

    function _0x5d4ex24(_0x5d4ex1d, _0x5d4ex4) {
        var _0x5d4ex25 = _0x5d4ex1d[_0x5d4ex4]['published']['$t'],
            _0x5d4ex26 = _0x5d4ex25['substring'](0, 4),
            _0x5d4ex27 = _0x5d4ex25['substring'](5, 7),
            _0x5d4ex28 = _0x5d4ex25['substring'](8, 10),
            _0x5d4ex29 = monthFormat[parseInt(_0x5d4ex27, 10) - 1] + ' ' + _0x5d4ex28 + ', ' + _0x5d4ex26,
            _0x5d4ex22 = '<span class="post-date">' + _0x5d4ex29 + '</span>';
        return _0x5d4ex22
    }

    function _0x5d4ex2a(_0x5d4ex1d, _0x5d4ex4) {
        var _0x5d4ex21 = _0x5d4ex1d[_0x5d4ex4]['title']['$t'],
            _0x5d4ex2b = _0x5d4ex1d[_0x5d4ex4]['content']['$t'],
            _0x5d4ex2c = $('<div>')['html'](_0x5d4ex2b);
        if ('media$thumbnail' in _0x5d4ex1d[_0x5d4ex4]) {
            var _0x5d4ex2d = _0x5d4ex1d[_0x5d4ex4]['media$thumbnail']['url'],
                _0x5d4ex2e = _0x5d4ex2d['replace']('/s72-c', '/w680');
            if (_0x5d4ex2b['indexOf']('youtube.com/embed') > -1) {
                _0x5d4ex2e = _0x5d4ex2d['replace']('/default.', '/hqdefault.')
            }
        } else {
            if (_0x5d4ex2b['indexOf']('<img') > -1) {
                _0x5d4ex2e = _0x5d4ex2c['find']('img:first')['attr']('src')
            } else {
                _0x5d4ex2e = noThumbnail
            }
        };
        var _0x5d4ex22 = '<img class="post-thumb" alt="' + _0x5d4ex21 + '" src="' + _0x5d4ex2e + '"/>';
        return _0x5d4ex22
    }

    function _0x5d4ex2f(_0x5d4ex1d, _0x5d4ex4) {
        if (_0x5d4ex1d[_0x5d4ex4]['category'] != undefined) {
            var _0x5d4ex30 = _0x5d4ex1d[_0x5d4ex4]['category'][0]['term'],
                _0x5d4ex22 = '<span class="post-tag">' + _0x5d4ex30 + '</span>'
        } else {
            _0x5d4ex22 = ''
        };
        return _0x5d4ex22
    }

    function _0x5d4ex31(_0x5d4exf, _0x5d4ex11, _0x5d4ex1b, _0x5d4ex13) {
        if (_0x5d4ex11['match']('mega-menu') || _0x5d4ex11['match']('featured') || _0x5d4ex11['match']('post-list') || _0x5d4ex11['match']('related')) {
            var _0x5d4ex32 = '';
            if (_0x5d4ex13 == 'recent') {
                _0x5d4ex32 = '/feeds/posts/default?alt=json-in-script&max-results=' + _0x5d4ex1b
            } else {
                if (_0x5d4ex13 == 'random') {
                    var _0x5d4ex33 = Math['floor'](Math['random']() * _0x5d4ex1b) + 1;
                    _0x5d4ex32 = '/feeds/posts/default?max-results=' + _0x5d4ex1b + '&start-index=' + _0x5d4ex33 + '&alt=json-in-script'
                } else {
                    _0x5d4ex32 = '/feeds/posts/default/-/' + _0x5d4ex13 + '?alt=json-in-script&max-results=' + _0x5d4ex1b
                }
            };
            $['ajax']({
                url: _0x5d4ex32,
                type: 'get',
                dataType: 'jsonp',
                success: function (_0x5d4ex34) {
                    if (_0x5d4ex11['match']('mega-menu')) {
                        var _0x5d4ex35 = '<ul class="mega-menu-inner">'
                    } else {
                        if (_0x5d4ex11['match']('post-list')) {
                            var _0x5d4ex35 = '<ul class="custom-widget">'
                        } else {
                            if (_0x5d4ex11['match']('related')) {
                                var _0x5d4ex35 = '<ul class="related-posts">'
                            }
                        }
                    };
                    var _0x5d4ex36 = _0x5d4ex34['feed']['entry'];
                    if (_0x5d4ex36 != undefined) {
                        for (var _0x5d4ex4 = 0, _0x5d4ex1d = _0x5d4ex36; _0x5d4ex4 < _0x5d4ex1d['length']; _0x5d4ex4++) {
                            var _0x5d4ex1f = _0x5d4ex1c(_0x5d4ex1d, _0x5d4ex4),
                                _0x5d4ex18 = _0x5d4ex20(_0x5d4ex1d, _0x5d4ex4, _0x5d4ex1f),
                                _0x5d4ex37 = _0x5d4ex2a(_0x5d4ex1d, _0x5d4ex4),
                                _0x5d4ex30 = _0x5d4ex2f(_0x5d4ex1d, _0x5d4ex4),
                                _0x5d4ex38 = _0x5d4ex23(_0x5d4ex1d, _0x5d4ex4),
                                _0x5d4ex39 = _0x5d4ex24(_0x5d4ex1d, _0x5d4ex4);
                            var _0x5d4ex3a = '';
                            if (_0x5d4ex11['match']('mega-menu')) {
                                _0x5d4ex3a += '<div class="mega-item item-' + _0x5d4ex4 + '"><div class="mega-content"><div class="post-image-wrap"><a class="post-image-link" href="' + _0x5d4ex1f + '">' + _0x5d4ex37 + '</a>' + _0x5d4ex30 + '</div><h2 class="post-title">' + _0x5d4ex18 + '</h2><div class="post-meta">' + _0x5d4ex39 + '</div></div></div>'
                            } else {
                                if (_0x5d4ex11['match']('post-list')) {
                                    _0x5d4ex3a += '<li class="item-' + _0x5d4ex4 + '"><a class="post-image-link" href="' + _0x5d4ex1f + '">' + _0x5d4ex37 + '</a><div class="post-info"><h2 class="post-title">' + _0x5d4ex18 + '</h2><div class="post-meta">' + _0x5d4ex39 + '</div></div></div></li>'
                                } else {
                                    if (_0x5d4ex11['match']('related')) {
                                        _0x5d4ex3a += '<li class="related-item item-' + _0x5d4ex4 + '"><div class="post-image-wrap"><a class="post-image-link" href="' + _0x5d4ex1f + '">' + _0x5d4ex37 + '</a>' + _0x5d4ex30 + '</div><h2 class="post-title">' + _0x5d4ex18 + '</h2><div class="post-meta">' + _0x5d4ex39 + '</div></li>'
                                    }
                                }
                            };
                            _0x5d4ex35 += _0x5d4ex3a
                        };
                        _0x5d4ex35 += '</ul>'
                    } else {
                        _0x5d4ex35 = '<ul class="no-posts">Error: No Posts Found <i class="fa fa-frown"/></ul>'
                    };
                    if (_0x5d4ex11['match']('mega-menu')) {
                        _0x5d4exf['addClass']('has-sub mega-menu')['append'](_0x5d4ex35);
                        _0x5d4exf['find']('a:first')['attr']('href', function (_0x5d4exf, _0x5d4ex14) {
                            if (_0x5d4ex13 == 'recent' || _0x5d4ex13 == 'random') {
                                _0x5d4ex14 = _0x5d4ex14['replace'](_0x5d4ex14, '/search/?&max-results=' + postPerPage)
                            } else {
                                _0x5d4ex14 = _0x5d4ex14['replace'](_0x5d4ex14, '/search/label/' + _0x5d4ex13 + '?&max-results=' + postPerPage)
                            };
                            return _0x5d4ex14
                        })
                    } else {
                        _0x5d4exf['html'](_0x5d4ex35)
                    }
                }
            })
        }
    }
    $('.blog-post-comments')['each'](function () {
        var _0x5d4ex3b = commentsSystem,
            _0x5d4ex3c = disqus_blogger_current_url,
            _0x5d4ex3d = '<div id="disqus_thread"/>',
            _0x5d4ex3e = $(location)['attr']('href'),
            _0x5d4ex3f = '<div class="fb-comments" data-width="100%" data-href="' + _0x5d4ex3e + '" data-numposts="5"></div>',
            _0x5d4ex40 = 'comments-system-' + _0x5d4ex3b;
        if (_0x5d4ex3b == 'blogger') {
            $(this)['addClass'](_0x5d4ex40)['show']()
        } else {
            if (_0x5d4ex3b == 'disqus') {
                (function () {
                    var _0x5d4ex41 = document['createElement']('script');
                    _0x5d4ex41['type'] = 'text/javascript';
                    _0x5d4ex41['async'] = true;
                    _0x5d4ex41['src'] = '//' + disqusShortname + '.disqus.com/embed.js';
                    (document['getElementsByTagName']('head')[0] || document['getElementsByTagName']('body')[0])['appendChild'](_0x5d4ex41)
                })();
                $('#comments, #gpluscomments')['remove']();
                $(this)['append'](_0x5d4ex3d)['addClass'](_0x5d4ex40)['show']()
            } else {
                if (_0x5d4ex3b == 'facebook') {
                    $('#comments, #gpluscomments')['remove']();
                    $(this)['append'](_0x5d4ex3f)['addClass'](_0x5d4ex40)['show']()
                } else {
                    if (_0x5d4ex3b == 'hide') {
                        $(this)['hide']()
                    } else {
                        $(this)['addClass']('comments-system-default')['show']()
                    }
                }
            }
        }
    })
})
//# sourceMappingURL=/sm/e6376752f1c57caea403c4f7e81b8eea1182320fdbc9a39b94f6c19cc4b2f2a3.map
