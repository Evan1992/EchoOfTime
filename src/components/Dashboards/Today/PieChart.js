import classes from './PieChart.module.css';

const PieChart = (props) => {
    // Default values to prevent NaN
    const remaining = typeof props.remainingPlannedTime === 'number' ? props.remainingPlannedTime : 0;
    const expected = typeof props.expectedTimeToday === 'number' && props.expectedTimeToday > 0 ? props.expectedTimeToday : 1;

    // Helper to create an SVG arc path
    const describeArc = (cx, cy, r, startAngle, endAngle) => {
        const start = polarToCartesian(cx, cy, r, endAngle);
        const end = polarToCartesian(cx, cy, r, startAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
        return [
            "M", cx, cy,
            "L", start.x, start.y,
            "A", r, r, 0, largeArcFlag, 0, end.x, end.y,
            "Z"
        ].join(" ");
    };

    function polarToCartesian(cx, cy, r, angle) {
        const radian = (angle-90) * Math.PI / 180.0;
        return {
            x: cx + (r * Math.cos(radian)),
            y: cy + (r * Math.sin(radian))
        };
    }

    // Pie slice angles (safe calculation)
    const greenStart = 0;
    const greenEnd = 360 - 360 * (remaining / expected);
    const grayStart = greenEnd;
    const grayEnd = 360;

    return (
        <div className={classes.pie_chart_container}>
            <svg viewBox="0 0 40 40" className={classes.pie_chart}>
                {greenEnd === 360 ? (
                    <circle cx="20" cy="20" r="16" fill="#39a721" />
                ) : (
                    <circle cx="20" cy="20" r="16" fill="#ededed" />
                )}
                <path
                    d={describeArc(20, 20, 16, greenStart, greenEnd)}
                    fill="#39a721"
                />
                <path
                    d={describeArc(20, 20, 16, grayStart, grayEnd)}
                    fill="#ededed"
                />
            </svg>
        </div>
    );
};

export default PieChart;



/* ========== Learning ========== */
/* <svg> */
// svg stands for Scalable Vector Graphics - it's an XML-based markup language used to describe
// 2D graphics in HTML. You can use it to draw shapes like circles, lines, rectangels,and even
// complete paths