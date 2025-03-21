jQuery(function(){
	(function( blocks, element ) {
		var el 		= element.createElement;

		/* Hide the button required by the classic editor */
		jQuery(function(){
			jQuery('.cpm-classic-editor').hide();
            jQuery('.cpm-gutenberg-editor').css({display:'block',width:'100%', padding:0});
            jQuery('.cpm-gutenberg-editor select').css({height:'100px'});
		});

		/* Plugin Category */
		blocks.getCategories().push({slug: 'cpgm', title: 'CP Google Maps'});

		/* ICONS */
		const iconCPGM = el('img', { width: 20, height: 20, src:  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9ImN1cnJlbnRDb2xvciIgY2xhc3M9Imljb24gaWNvbi10YWJsZXIgaWNvbnMtdGFibGVyLWZpbGxlZCBpY29uLXRhYmxlci1tYXAtcGluIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMTguMzY0IDQuNjM2YTkgOSAwIDAgMSAuMjAzIDEyLjUxOWwtLjIwMy4yMS00LjI0MyA0LjI0MmEzIDMgMCAwIDEtNC4wOTcuMTM1bC0uMTQ0LS4xMzUtNC4yNDQtNC4yNDNBOSA5IDAgMCAxIDE4LjM2NCA0LjYzNnpNMTIgOGEzIDMgMCAxIDAgMCA2IDMgMyAwIDAgMCAwLTZ6IiBzdHlsZT0iZmlsbDojZmYyYTJhO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTojMDAwO3N0cm9rZS1vcGFjaXR5OjEiLz48L3N2Zz4=" } );

		/* CP Google Maps Code */
		blocks.registerBlockType( 'cpgm/map', {
			title: 'CP Google Maps',
			icon: iconCPGM,
			category: 'cpgm',
			supports: {
				customClassName: false,
				className: false
			},

			attributes: {
				shortcode : {
					type : 'text'
				}
			},

			edit: function( props )
			{
				var children = [], postID = wp.data.select("core/editor").getCurrentPostId();
				function onChangeMap(evt)
				{
					props.setAttributes({shortcode: evt.target.value});
				};

				if(typeof props.attributes.shortcode == 'undefined')
				{
					props.attributes.shortcode = cpm_generate_shortcode();
				}

				return 	[
					el(
						'textarea',
						{
							key 	: 'cpgm-shortcode',
							onChange: onChangeMap,
							value 	: props.attributes.shortcode,
							style	: {width:"100%", resize: "vertical"}
						}
					),
					el(
						'div', {className: 'cpm-iframe-container', key: 'cpm_iframe_container'},
						el('div', {className: 'cpm-iframe-overlay', key: 'cpm_iframe_overlay'}),
						el('iframe',
							{
								key: 'cpm_store_iframe',
								src: cpm_ge_config.url+encodeURIComponent(props.attributes.shortcode)+'&post-id='+encodeURIComponent(postID),
								height: 0,
								width: 500,
								scrolling: 'no'
							}
						)
					)
				];
			},

			save: function( props ) {
				return props.attributes.shortcode || '[codepeople-post-map]';
			}
		});
	} )(
		window.wp.blocks,
		window.wp.element
	);

	// Autoupdate
	function autoupdate()
	{
		const isSavingPost = wp.data.select('core/editor').isSavingPost();
		if (isSavingPost) return;
		wp.data.dispatch('core/editor').savePost({ waitForResponse: false }).then(()=>{
			jQuery('.cpm-iframe-container iframe').each(function(){
				this.contentWindow.location.reload();
			});
		});
	};

	jQuery(document).on('change click', '#codepeople_post_map_form :input, [id*="cpm_point"]',
		function(evt)
		{
			var t = jQuery(evt.target);
			if(evt.type == 'click' && t.is('input[type="button"]') || evt.type == 'change') autoupdate();
		}
	);
});