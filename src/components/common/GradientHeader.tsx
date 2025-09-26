const GradientHeader = ({ title }: { title: string }) => {
  return (
    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
      {title}
    </h1>
  );
};

export default GradientHeader;
