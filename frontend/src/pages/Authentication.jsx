const Authentication = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 px-6">
      <div className="text-2xl font-semibold text-on-surface">Voxen</div>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button className="w-full sm:w-auto bg-primary text-on-primary font-semibold px-8 py-3 rounded-lg transition-transform active:scale-95">
          Sign in
        </button>
        <button className="w-full sm:w-auto text-on-surface border border-outline px-8 py-3 rounded-lg hover:bg-surface transition-colors">
          Sign up
        </button>
      </div>
    </div>
  );
};

export default Authentication;
