/*
Sent (0) - Tin nhắn đã được gửi nhưng chưa được nhận hoặc đọc.
Delivered (1) - Tin nhắn đã được gửi đến server hoặc thiết bị nhận, nhưng chưa được đọc.
Read (2) - Tin nhắn đã được người nhận xem.
Deleted (3) - Tin nhắn đã bị xóa (có thể bởi người gửi hoặc nhận).
Edited (4) - Tin nhắn đã được chỉnh sửa bởi người gửi.
*/

const MessageStatus = {
    SENT: 0,
    DELIVERED: 1,
    READ: 2,
    DELETED: 3,
    EDITED: 4
};

export default MessageStatus;