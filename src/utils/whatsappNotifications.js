// WhatsApp API integration for order notifications
// Using WhatsApp Business API or services like Twilio, MessageBird, etc.

const WHATSAPP_CONFIG = {
  // Your WhatsApp Business number for receiving order notifications
  adminPhone: '+919173963720', // Updated with your phone number
  apiEndpoint: 'https://api.whatsapp.com/send', // For direct WhatsApp links
  // For WhatsApp Business API, use your provider's endpoint
};

/**
 * Format order details for WhatsApp message
 */
export const formatOrderMessage = (order, userInfo) => {
  const { items, total_amount, shipping_address, id, created_at } = order;
  
  const orderDate = new Date(created_at).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Build items list
  const itemsList = items.map(item => 
    `• ${item.name} x ${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}`
  ).join('\n');

  // Format shipping address
  const address = shipping_address ? 
    `${shipping_address.fullName}\n${shipping_address.phone}\n${shipping_address.address}\n${shipping_address.city}, ${shipping_address.state} - ${shipping_address.pincode}` 
    : 'Address not provided';

  const message = `🛍️ *NEW ORDER RECEIVED - ShopHub*

📋 *Order Details:*
Order ID: #${id.slice(0, 8).toUpperCase()}
Date: ${orderDate}
Total: ₹${total_amount.toFixed(2)}

👤 *Customer:*
${userInfo.user_metadata?.full_name || 'N/A'}
${userInfo.email}
${userInfo.user_metadata?.phone || 'N/A'}

📦 *Items Ordered:*
${itemsList}

📍 *Shipping Address:*
${address}

💳 *Payment:* Completed via Razorpay

🏪 *Action Required:* Please process and ship this order.

---
ShopHub Admin Notification`;

  return encodeURIComponent(message);
};

/**
 * Send WhatsApp notification for new orders
 */
export const sendOrderNotificationToAdmin = async (order, userInfo) => {
  try {
    const message = formatOrderMessage(order, userInfo);
    
    // Method 1: Open WhatsApp with pre-filled message (works on mobile/desktop)
    const whatsappUrl = `${WHATSAPP_CONFIG.apiEndpoint}?phone=${WHATSAPP_CONFIG.adminPhone}&text=${message}`;
    
    // For development/testing - opens WhatsApp with the message
    if (window.confirm('Order placed successfully! Open WhatsApp to notify admin?')) {
      window.open(whatsappUrl, '_blank');
    }
    
    // Method 2: For production, integrate with WhatsApp Business API
    // Example with a webhook/API service:
    /*
    const response = await fetch('/api/send-whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: WHATSAPP_CONFIG.adminPhone,
        message: decodeURIComponent(message)
      })
    });
    */
    
    return { success: true };
  } catch (error) {
    console.error('WhatsApp notification error:', error);
    return { success: false, error };
  }
};

/**
 * Send order confirmation to customer
 */
export const sendOrderConfirmationToCustomer = async (order, userInfo) => {
  try {
    const customerPhone = userInfo.user_metadata?.phone || 
                         order.shipping_address?.phone;
    
    if (!customerPhone) {
      console.log('Customer phone not available for WhatsApp notification');
      return { success: false, reason: 'No phone number' };
    }

    const message = `🎉 *Order Confirmed - ShopHub*

Dear ${userInfo.user_metadata?.full_name || 'Customer'},

Your order has been placed successfully!

📋 *Order Details:*
Order ID: #${order.id.slice(0, 8).toUpperCase()}
Total: ₹${order.total_amount.toFixed(2)}
Items: ${order.items.length} product(s)

📦 We'll process your order and notify you once it's shipped.

Thank you for shopping with ShopHub! 🛍️

For any queries, contact us at support@shophub.com`;

    // Similar implementation as admin notification
    const whatsappUrl = `${WHATSAPP_CONFIG.apiEndpoint}?phone=${customerPhone}&text=${encodeURIComponent(message)}`;
    
    // For production, use WhatsApp Business API
    // For now, log the confirmation
    console.log('Customer confirmation ready:', message);
    
    return { success: true };
  } catch (error) {
    console.error('Customer WhatsApp confirmation error:', error);
    return { success: false, error };
  }
};