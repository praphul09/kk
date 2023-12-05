export default function StatusCircle({ fill }: { fill: string }) {
    return (
        <svg width={60} height={60}>
            <circle cx={30} cy={30} r={20} fill={fill} stroke="#000" strokeWidth={3} />
        </svg>
    )
}
