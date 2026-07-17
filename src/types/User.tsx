export default interface UserProps {
    user_id: number;
    username: string;
    email: string;
    free_chips_amount_bankroll: number;
    real_chips_amount_bankroll: number;
    profile_picture_link?: string | null;
    bio?: string;
}