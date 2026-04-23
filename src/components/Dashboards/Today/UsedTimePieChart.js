import classes from './UsedTimePieChart.module.css';

const COLORS = ['#4dabf7', '#ff6b6b', '#ffb800', '#51cf66', '#cc5de8', '#ff922b', '#20c997', '#f06595'];
const DAY_SECONDS = 24 * 60 * 60;

const UsedTimePieChart = ({ segments }) => {
    const polarToCartesian = (cx, cy, r, angle) => {
        const radian = (angle - 90) * Math.PI / 180.0;
        return { x: cx + r * Math.cos(radian), y: cy + r * Math.sin(radian) };
    };

    const describeArc = (cx, cy, r, startAngle, endAngle) => {
        const start = polarToCartesian(cx, cy, r, endAngle);
        const end = polarToCartesian(cx, cy, r, startAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
        return ['M', cx, cy, 'L', start.x, start.y, 'A', r, r, 0, largeArcFlag, 0, end.x, end.y, 'Z'].join(' ');
    };

    const activeSegments = (segments || []).filter(s => s.seconds > 0);
    const totalUsed = activeSegments.reduce((sum, s) => sum + s.seconds, 0);

    let currentAngle = 0;
    const slices = activeSegments.map((seg, i) => {
        const angle = (seg.seconds / DAY_SECONDS) * 360;
        const slice = {
            startAngle: currentAngle,
            endAngle: currentAngle + angle,
            color: COLORS[i % COLORS.length],
            title: seg.title,
            seconds: seg.seconds,
        };
        currentAngle += angle;
        return slice;
    });

    const secondsToHMS = (s) => {
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = s % 60;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    };

    const untrackedSeconds = Math.max(0, DAY_SECONDS - totalUsed);

    return (
        <div className={classes.pie_chart_container}>
            <svg viewBox="0 0 40 40" className={classes.pie_chart}>
                <circle cx="20" cy="20" r="16" fill="#ededed" />
                {slices.map((slice, i) => (
                    <path key={i} d={describeArc(20, 20, 16, slice.startAngle, slice.endAngle)} fill={slice.color} />
                ))}
            </svg>
            <div className={classes.legend}>
                {slices.map((slice, i) => (
                    <div key={i} className={classes.legend_item}>
                        <span className={classes.swatch} style={{ background: slice.color }} />
                        <span className={classes.legend_title}>{slice.title}</span>
                        <span className={classes.legend_time}>{secondsToHMS(slice.seconds)}</span>
                    </div>
                ))}
                <div className={classes.legend_item}>
                    <span className={classes.swatch} style={{ background: '#ededed', border: '1px solid #ccc' }} />
                    <span className={classes.legend_title}>Untracked</span>
                    <span className={classes.legend_time}>{secondsToHMS(untrackedSeconds)}</span>
                </div>
            </div>
        </div>
    );
};

export default UsedTimePieChart;
