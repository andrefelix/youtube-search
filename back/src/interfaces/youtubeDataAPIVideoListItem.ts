interface YoutubeDataAPIVideoListItem {
  snippet: {
    title: string;
    description: string;
    thumbnails: { default: { url: string; width: number; height: number } };
  };
  fileDetails: { durationMs: number };
  player: { embedHtml: string };
}

export { YoutubeDataAPIVideoListItem };
