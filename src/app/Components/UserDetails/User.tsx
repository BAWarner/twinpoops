import { UserType } from "@/app/types/movies.types";
import styles from '../../styles/user.module.css';

interface UserProps{
    user: UserType
}

const User = (props: UserProps) => {
    const { user } = props;

    const { displayname, profilePicture } = user;

    return (
        <div className={styles.userDetails}>
            <img src={ profilePicture ? profilePicture : '/default-avatar.png'} alt={displayname} className={styles.tinyProfilePicture} />
            {displayname}
        </div>
    );
}

export default User;