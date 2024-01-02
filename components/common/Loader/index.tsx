interface LoaderProps {
  heightClass?: string;
}
const Loader = ({ heightClass }: LoaderProps) => {
  return (
    <div
      className={`flex items-center justify-center bg-white ${
        heightClass ? heightClass : "h-screen"
      }`}
    >
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
    </div>
  );
};

export default Loader;
