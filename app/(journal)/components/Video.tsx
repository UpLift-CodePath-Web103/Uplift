export function Video(props: { src: string }) {
    return (
      <div className="w-full max-w-2xl mx-auto p-4 bg-gray-100 rounded-lg shadow-md">
        <div className="relative w-full h-0 overflow-hidden rounded-lg" style={{ paddingBottom: '56.25%' }}>
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-lg"
            src={props.src}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    );
  }
  