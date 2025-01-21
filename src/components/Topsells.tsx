function Topsells() {
    return (
        <div className="flex flex-col h-[88vh] w-full bg-[#022953] relative">
            <div className="flex h-[15vh] w-full bg-amber-300 px-10 items-end">
                <h1 className="font-bold text-5xl">Productos</h1>
                <div className="ml-auto flex items-center space-x-2">
                    <h3 className="font-bold text-lg">Ver más</h3>
                    <span className="font-bold text-xl">{'>'}</span>
                </div>
            </div>

            <div className="flex w-full h-full">
                <div className="flex h-full w-[50vw] bg-amber-950">
                </div>
                <div className="absolute top-[10%] bottom-[10%] left-1/2 w-[1px] bg-white" /> {/* la línea del medio */}
                <div className="flex h-full w-[50vw]">
                </div>
            </div>
        </div>
    );
}

export default Topsells;
