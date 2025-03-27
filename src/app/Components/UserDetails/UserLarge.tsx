import { UserType } from "@/app/types/movies.types";
import styles from '../../styles/user.module.css';

interface UserLargeProps{
    user: UserType
}

const UserLarge = (props: UserLargeProps) => {
    const { user } = props;
    const { profilePicture, displayname } = user;

    return (
        <div className={styles.userLarge}>
            <h5>Added by:</h5>
            <div className={styles.row}>
                <img src={profilePicture ? profilePicture : '/default-avatar.png'} alt={displayname} />
                <span>{displayname}</span>
            </div>
        </div>
    )
}

export default UserLarge;