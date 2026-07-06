export default interface TatamiProps {
    id: string;
    name: string;
    is_private: boolean;
    paid_33: boolean
    bet: number
    created_by: string;
    is_real_money: boolean;
    status: string;
    players: number[];
    player_usernames: string[];
    created_at: string;
    seats: { user_id: number; amount_at_stake: number }[];
    seats_connected: boolean[];
    dealer_seat_index: number;
    turn: string;
    last_winning_seat: string;
    last_round_winner: string;
    three_seven_seat: number;
    pot: number;
    hand_over: boolean;
    hand_completed: boolean;
    win_messages: [];
    game_notifications: [];
    history: [];
    seat_turn_timer: [];
    demanded_suit: [];
    current_round_cards: [];
    round_number: number;
    count_hand: number;
    hand_participants: [];
    won_by_combination: boolean;
    on_turn_changed: [];
    chat_room: [];
    invite_link: string;
    current_round: number;     // 0 = pas de manche en cours, 1..5
    revealedSeats?: boolean[];
}

export default interface NormalizedTatamiProps {
    id: string;
    name: string;
    type: boolean;
    realMoney: boolean;
    paid33: boolean;
    bet: number;
    players: number[];
    seatsConnected: boolean[];
}