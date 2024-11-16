import * as stylex from '@stylexjs/stylex';

const spin = stylex.keyframes({
  from: { transform: "rotate(0deg)" },
  to: { transform: "rotate(360deg)" }
});

const styles = stylex.create({
  loader: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backdropFilter: "blur(2px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  spinner: {
    border: "4px solid rgba(64, 83, 76, 0.3)",
    borderTop: "4px solid #1A3636",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    animationName: spin,
    animationDuration: "1s",
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
    marginBottom: "10px",
  },
});

const Loader = () => {
  return (
    <div {...stylex.props(styles.loader)}>
      <div {...stylex.props(styles.spinner)}></div>
    </div>
  );
};

export default Loader;
