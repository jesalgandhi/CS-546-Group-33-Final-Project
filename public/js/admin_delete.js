$(document).ready(function () {
    $('#deleteButton').click(function(event) {
        event.preventDefault();

        $.ajax({
            url: '/settings/admin', 
            type: 'DELETE',
            success: function(response) {
                if (response.success) window.location.href = response.redirectTo;
            },
            error: function() {
                console.log('Error deleting user');
            }
        });
    });
});
