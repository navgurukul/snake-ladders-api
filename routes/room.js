const express = require('express');
const roomService = require('../services/room');
const router = express.Router();
const { authenticateJWT } = require('../middleware/auth');



router.post('/create', authenticateJWT, async (req, res) => {
    try {
        let user_id = req.user.id;
        const room = await roomService.createRoom(user_id);
        console.log(room, 'room line no 16 Route');
        res.status(200).json(room);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// player joins a room with a room_id & user_id, joined_at
router.post('/join', authenticateJWT, async (req, res) => {
    try {
        // console.log(req.user, 'line no 27 Route');
        // console.log(req.body, 'line no 28 Route');
        let user_id = req.user.id;
        let room_code = req.body.room_code;
        console.log(user_id, room_code, 'line no 30 Route')
        const player = await roomService.joinRoom(user_id, room_code);
        res.status(200).json(player);

    } catch (error) {
        console.log(error, 'line no 35 Route');
        res.status(400).json({ error: error.message });
    }
});



module.exports = router;