import styles from '@/app/Loading.module.css';

export default function PrimaryLoading() {
    return (
        <div className="h-screen w-full bg-[#29328d] flex justify-center items-center z-50 absolute">
            <div className={`${styles.container} text-white}`}>
                <p className={styles.typed}>{process.env.MALL_NAME} is loading...</p>
            </div>
        </div>
    );
}
