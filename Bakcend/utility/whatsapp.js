async function sendWhatsAppMessage(whatsappClient, phone, message) {
  let normalizedPhone = phone;
  
  const cleanPhone = phone.replace(/\D/g, "");
  
  if (cleanPhone.length === 10 && !phone.startsWith("+")) {
    normalizedPhone = `+91${cleanPhone}`;
  }
  
  const finalCleanPhone = normalizedPhone.replace(/\D/g, "");
  if (!normalizedPhone.startsWith("+91") || finalCleanPhone.length !== 12) {
    throw new Error("Invalid phone number: Must be a 10-digit Indian number or start with +91 followed by 10 digits");
  }
  
  const chatId = `${finalCleanPhone}@c.us`;
  console.log("Sending WhatsApp:", { to: phone, normalized: normalizedPhone, chatId, message });
  
  try {
    if (!whatsappClient || !whatsappClient.info) {
      throw new Error("WhatsApp not ready - scan QR first");
    }
    const msg = await whatsappClient.sendMessage(chatId, message);
    console.log("Sent successfully:", msg.id._serialized);
    return { success: true, msgId: msg.id._serialized };
  } catch (err) {
    console.error("Send failed:", err.message);
    return { success: false, error: err.message };
  }
}

async function sendBookingNotifications({
  whatsappClient,
  io,
  userId,
  serviceProviderId,
  bookingId,
  User_name,
  ServiceProvider_name,
  User_Phone,
  Service_Phone,
  type = "create",
  amount, // Added for payment type
}) {
  try {
    if (!whatsappClient || !whatsappClient.info) {
      throw new Error("WhatsApp client not ready - please scan QR code first");
    }

    let normalizedUserPhone = User_Phone;
    let normalizedServicePhone = Service_Phone;
    
    const cleanUserPhone = User_Phone.replace(/\D/g, "");
    const cleanServicePhone = Service_Phone.replace(/\D/g, "");
    
    if (cleanUserPhone.length === 10 && !User_Phone.startsWith("+")) {
      normalizedUserPhone = `+91${cleanUserPhone}`;
    }
    if (cleanServicePhone.length === 10 && !Service_Phone.startsWith("+")) {
      normalizedServicePhone = `+91${cleanServicePhone}`;
    }
    
    if (!normalizedUserPhone.startsWith("+91") || normalizedUserPhone.replace(/\D/g, "").length !== 12) {
      throw new Error("User phone must be a 10-digit Indian number or start with +91 followed by 10 digits");
    }
    if (!normalizedServicePhone.startsWith("+91") || normalizedServicePhone.replace(/\D/g, "").length !== 12) {
      throw new Error("Service provider phone must be a 10-digit Indian number or start with +91 followed by 10 digits");
    }

    let userMessage, providerMessage;

    switch (type) {
      case "create":
        userMessage = `Your booking request with ${ServiceProvider_name} has been sent successfully! Booking ID: ${bookingId}`;
        providerMessage = `New booking request from ${User_name} received. Booking ID: ${bookingId}`;
        break;
      case "accept":
        userMessage = `Your booking with ${ServiceProvider_name} has been accepted! Booking ID: ${bookingId}`;
        providerMessage = `You have accepted the booking from ${User_name}. Booking ID: ${bookingId}`;
        break;
      case "start":
        userMessage = `Your booking with ${ServiceProvider_name} has started! Booking ID: ${bookingId}`;
        providerMessage = `Booking with ${User_name} has started. Booking ID: ${bookingId}`;
        break;
      case "end":
        userMessage = `Your booking with ${ServiceProvider_name} has ended successfully! Booking ID: ${bookingId}`;
        providerMessage = `Booking with ${User_name} has ended. Booking ID: ${bookingId}`;
        break;
      case "payment":
        userMessage = `Payment of ₹${amount} for Booking ID: ${bookingId} with ${ServiceProvider_name} has been successfully sent!`;
        providerMessage = `Payment of ₹${amount} for Booking ID: ${bookingId} from ${User_name} has been successfully received!`;
        break;
      default:
        throw new Error("Invalid notification type");
    }

    console.log("Notification details:", {
      User_Phone: normalizedUserPhone,
      Service_Phone: normalizedServicePhone,
      userMessage,
      providerMessage,
    });

    const [userResult, providerResult] = await Promise.all([
      sendWhatsAppMessage(whatsappClient, normalizedUserPhone, userMessage),
      sendWhatsAppMessage(whatsappClient, normalizedServicePhone, providerMessage),
    ]);

    if (!userResult.success || !providerResult.success) {
      const errors = [];
      if (!userResult.success) errors.push(`User message failed: ${userResult.error}`);
      if (!providerResult.success) errors.push(`Provider message failed: ${providerResult.error}`);
      throw new Error(`Failed to send WhatsApp messages: ${errors.join(", ")}`);
    }

    switch (type) {
      case "create":
        io.to(userId).emit("bookingRequestSent", {
          serviceProvider: ServiceProvider_name || serviceProviderId,
          bookingId,
        });
        io.to(serviceProviderId).emit("newBookingRequest", {
          user: User_name || userId,
          bookingId,
        });
        break;
      case "accept":
        io.to(userId).emit("bookingAccepted", {
          serviceProvider: ServiceProvider_name || serviceProviderId,
          bookingId,
        });
        io.to(serviceProviderId).emit("bookingAccepted", {
          user: User_name || userId,
          bookingId,
        });
        break;
      case "start":
        io.to(userId).emit("bookingStarted", {
          serviceProvider: ServiceProvider_name || serviceProviderId,
          bookingId,
        });
        io.to(serviceProviderId).emit("bookingStarted", {
          user: User_name || userId,
          bookingId,
        });
        break;
      case "end":
        io.to(userId).emit("bookingEnded", {
          serviceProvider: ServiceProvider_name || serviceProviderId,
          bookingId,
        });
        io.to(serviceProviderId).emit("bookingEnded", {
          user: User_name || userId,
          bookingId,
        });
        break;
      case "payment":
        io.to(userId).emit("paymentSent", {
          serviceProvider: ServiceProvider_name || serviceProviderId,
          bookingId,
          amount,
        });
        io.to(serviceProviderId).emit("paymentReceived", {
          user: User_name || userId,
          bookingId,
          amount,
        });
        break;
    }

    console.log(`${type} notifications sent successfully`);
    return { success: true };
  } catch (error) {
    console.error(`Error sending ${type} notifications:`, error.message);
    return { success: false, error: error.message };
  }
}

module.exports = { sendWhatsAppMessage, sendBookingNotifications };