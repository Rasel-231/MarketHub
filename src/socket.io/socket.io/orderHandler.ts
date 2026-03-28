import { Server, Socket } from 'socket.io';
import { createClient } from 'redis';
import config from '../../config';

// ১. রেডিস ক্লায়েন্ট সেটআপ
export const redisClient = createClient({
    url: config.redis_url || 'redis://localhost:6379'
});

redisClient.connect().catch((err) => console.error("Redis Connection Error:", err));

export const orderHandler = (io: Server, socket: Socket) => {

    /**
     * ইভেন্ট: join_order_room
     * কাজ: ইউজার বা অ্যাডমিন যখনই কোনো অর্ডারের ডিটেইলস বা ট্র্যাকিং পেজে যাবে, 
     * তাকে ওই নির্দিষ্ট অর্ডারের রুমে জয়েন করাবে।
     */
    socket.on('join_order_room', (orderId: string) => {
        const roomName = `order_${orderId}`;
        socket.join(roomName);
        console.log(`User/Admin ${socket.id} joined room: ${roomName}`);

        // রুমে জয়েন করার পর কনফার্মেশন পাঠানো (ঐচ্ছিক)
        socket.emit('joined_success', { room: roomName });
    });

    /**
     * ইভেন্ট: start_delivery
     * কাজ: অ্যাডমিন যখন রাইডার অ্যাসাইন করে ডেলিভারি শুরু করবে।
     */
    socket.on('start_delivery', (orderId: string) => {
        const roomName = `order_${orderId}`;
        socket.join(roomName);
        console.log(`Delivery process started for: ${roomName}`);
    });

    /**
     * ইভেন্ট: update_location (Rider App থেকে আসবে)
     * কাজ: রাইডারের লাইভ লোকেশন রেডিস-এ সেভ করা এবং ওই রুমের সবাইকে জানানো।
     */
    socket.on('update_location', async (data: { orderId: string, lat: number, lng: number }) => {
        const { orderId, lat, lng } = data;
        const roomName = `order_${orderId}`;

        try {
            // লোকেশন ৫ মিনিটের জন্য রেডিস-এ সেভ রাখা (TTL: 300s)
            await redisClient.set(`location:${orderId}`, JSON.stringify({ lat, lng }), {
                EX: 300
            });


            io.to(roomName).emit('rider_moved', {
                orderId,
                lat,
                lng,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error("Location Update Error:", error);
        }
    });


    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
    });
};