function PlusIcon({ className }) {
  return (
    <svg width="24" height="24" x="0" y="0" viewBox="0 0 24 24">
      <path
        className={className}
        d="M12 2c1 0 2 .5 1 1v8h8c1 0 1 1 1 1s-1 1-1 1h-8v8c0 1-.5 1-1 1s-1-.448-1-1v-8H3c-1 0-1-1-1-1s1-1 1-1h8V3c0-1 1-1 1-2z"
      ></path>
    </svg>
    // <svg width="24" height="24" x="0" y="0" viewBox="0 0 24 24">
    //   <path
    //     className={className}
    //     d="M12 2c1 0 2 .5 2 1v8h8c1 0 2 .5 2 1s-1 1-2 1h-8v8c0 1-.5 2-1 2s-1-1-1-2v-8H3c-1 0-2-.5-2-1s1-1 2-1h8V3c0-1 .5-2 1-2z"
    //   ></path>
    // </svg>
  );
}

export default PlusIcon;
