function showContent(parent_collapse) {
	var content = parent_collapse.find('.collapse-content');
	if (!content.length) {
		console.error('No content found for collapse menu');
		return;
	}
	if (content.is(':visible')) {
		content.slideUp();
	} else {
		content.slideDown();
	}
}

$().ready(function () {
	$('.collapse-toogle').click(function () {
		var parent = $(this).parent();
		showContent(parent);
	});
});