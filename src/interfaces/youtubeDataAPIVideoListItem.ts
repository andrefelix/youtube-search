interface YoutubeDataAPIVideoListItem {
  snippet: {
    title: string;
    description: string;
    thumbnails: { default: { url: string; width: number; height: number } };
  };
  contentDetails: { duration: string };
  player: { embedHtml: string };
}

export { YoutubeDataAPIVideoListItem };
