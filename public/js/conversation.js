(function ($) {
	// let tvShowList = $('#tvShowList');
	// let showDetails = $('#showDetails');
	// let searchShowsForm = $('#searchShows');
	
	// /* 1. Making the AJAX request on page load and retrieving/showing all shows names */
	// let requestConfig = {
	// 	method: "GET", 
	// 	url: route('current-route')
	// };
	// $.ajax(requestConfig).then(function (responseMessage) {
	// 	console.log(responseMessage);
	// 	responseMessage.map((tvShow) => {
	// 		let tvShowItem = $(`<li><a href=${tvShow["_links"]["self"].href}>${tvShow.name}</a></li>`);
	// 		showDataOnClick(tvShowItem);
	// 		tvShowList.append(tvShowItem);
	// 	})
	// 	tvShowList.show();
	// 	showDetails.hide();
	// })

	// /* 2. Searching show functionality */
	// searchShowsForm.submit((event) => {
	// 	event.preventDefault();
	// 	let show_search_term = $('#show_search_term').val().toLowerCase().trim();
	// 	if (!show_search_term || show_search_term.length === 0) {
	// 		$('#error').show();
    //   $('#error').html('Error: Please enter a non-empty show search term');
	// 		$('#show_search_term').focus();
	// 		$('#show_search_term').val('');
	// 	}
	// 	else {
	// 		$('#error').hide();
	// 		tvShowList.empty();
	// 		let requestConfig = {
	// 			method: 'GET',
	// 			url: `http://api.tvmaze.com/search/shows?q=${show_search_term}`
	// 		}
	// 		$.ajax(requestConfig).then(function (responseMessage) {
	// 			responseMessage.map((tvShow) => {
	// 				let tvShowItem = $(`<li><a href="${tvShow["show"]["_links"]["self"].href}">${tvShow["show"].name}</a></li>`);
	// 				showDataOnClick(tvShowItem);
	// 				tvShowList.append(tvShowItem);
	// 			})
	// 			tvShowList.show();
	// 			showDetails.hide();
	// 		})
	// 	}
	// })


	// /* 3. When a show is clicked on, its information is retrieved and shown */
	// function showDataOnClick(tvShowItem) {
	// 	tvShowItem.find('a').on('click', function (event) {
	// 		event.preventDefault();
	// 		tvShowItem.hide();
	// 		showDetails.empty();
	// 		$.ajax(tvShowItem.find('a').attr('href')).then(function (show) {
	// 			let name = "N/A";
	// 			if (show.name) name = show.name;
	// 			let imageHTML = `<img src="../public/no_image.jpeg" alt="No Image Found">`;
	// 			if (show.image && show.image.medium) imageHTML = `<img src="${show.image.medium}" alt="${name}">`;
	// 			let genres = "N/A";
	// 			if (show.genres.length !== 0) genres = show.genres.map(genre => `<li>${genre}</li>`).join(" ");
	// 			let language = "N/A";
	// 			if (show.language) language = show.language;
	// 			let rating = "N/A";
	// 			if (show.rating && show.rating.average) rating = show.rating.average;
	// 			let network = "N/A";
	// 			if (show.network && show.network.name) network = show.network.name;
	// 			let summary = "N/A";
	// 			if (show.summary) summary = show.summary;
				
	// 			showDetails.append($(`<h1>${name}</h1>`));
	// 			showDetails.append($(imageHTML));
	// 			let def_list = `
	// 			<dl>
	// 				<dt>Language</dt>
	// 				<dd>${language}</dd>
			
	// 				<dt>Genres</dt>
	// 				<dd>
	// 					<ul>
	// 						${genres}
	// 					</ul>
	// 				</dd>
			
	// 				<dt>Average Rating</dt>
	// 				<dd>${rating}</dd>

	// 				<dt>Network</dt>
	// 				<dd>${network}</dd>

	// 				<dt>Summary</dt>
	// 				<dd>${summary}</dd>
	// 			</dl>`;
	// 			showDetails.append(def_list);
	// 		})
	// 		showDetails.show();
	// 	})
	// }


})(window.jQuery);