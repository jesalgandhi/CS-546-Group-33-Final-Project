$(document).ready(function() {
    const conversationId = $('#conversationId').data('conversationId');
    const senderId = $('#senderId').data('senderId');
    const thisGroupName = $('#thisGroupName').data('thisGroupName');
    const otherGroupName = $('#otherGroupName').data('otherGroupName');
    
    /* AJAX request to /messages/:conversationId/content that periodically fetches msgs */
    const fetchMessages = () => {
        $.ajax({
            url: `/messages/${conversationId}/content`,
            type: 'GET',
            success: function(messages) {
                $('#messageContainer').empty();

                messages.forEach(message => {
                    if (message.senderId === senderId) {
                        $('#messageContainer').append(
                            `
                            <div class="sender">
                                <p class="groupName">${thisGroupName}</p>
                                <p class="message">${message.text}</p>
                            </div>
                            `
                        );
                    }
                    else {
                        $('#messageContainer').append(
                            `
                            <div class="receiver">
                                <p class="groupName">${otherGroupName}</p>
                                <p class="message">${message.text}</p>
                            </div>
                            `
                        );
                    }
                });
            },
            error: function() {
                console.error("Error fetching messages");
            }
        });
    };

    /* Attempt to send message to button click */
    $('#messageForm').submit(function(e) {
        e.preventDefault();
        let messageSendError = $('#messageSendError');
        let messageText = $('#messageText').val();
        messageText = messageText.trim();

        if (typeof messageText !== 'string' || messageText.length <= 0 || messageText.length > 1024) {
            messageSendError.show();
        }
        
        else {
            $.ajax({
                url: `/messages/${conversationId}`,
                type: 'POST',
                data: { 
                    text: messageText, 
                    conversationId: conversationId,
                    senderId: senderId
                },
                success: function(response) {
                    messageSendError.hide();
                    $('#messageText').val(''); 
                    fetchMessages(); 
                },
                error: function() {
                    messageSendError.show();
                    console.error("Error sending message");
                }
            });
        }

        
        
    });

    // fetch messages every 5 seconds
    setInterval(fetchMessages, 5000);

    fetchMessages();
});