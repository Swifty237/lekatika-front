


const Timer: React.FC<{ timer: number }> = ({ timer }) => {
    return (
        <div className="bg-green-500 text-white w-8 h-8 rounded-full flex justify-center items-center">
            {timer}
        </div>
    )
};

export default Timer;