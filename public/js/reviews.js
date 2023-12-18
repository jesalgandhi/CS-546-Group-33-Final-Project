$(document).ready(function() {
    $('#reviewForm').submit(function(event) {
        event.preventDefault();

        let isValid = true;
        let rating = $('#ratingInput').val();
        let review = $('#reviewInput').val();
        review = review.trim();



        $('#alert').hide().text('');

        if (!rating) {
            $('#alert').text('Please select a rating.').show();
            isValid = false;
        }

        else if (!review || review.length === 0 || review.length > 1000) {
            $('#alert').text('Please enter your review. It must be less than 1000 characters').show();
            isValid = false;
        }

        if (isValid) {
            this.submit();
        }
    });
});
