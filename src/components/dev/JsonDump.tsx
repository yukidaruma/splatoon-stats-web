const JsonDump: React.FC<{ value: any }> = ({ value }) => (
  <pre>{JSON.stringify(value, undefined, 2)}</pre>
);

export default JsonDump;
