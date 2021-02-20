import axios from "axios";

interface VideoItem {
  snippet: {
    title: string;
    description: string;
    thumbnails: { default: { url: string; width: number; height: number } };
  };
  contentDetails: { duration: string };
  player: { embedHtml: string };
}

interface SearchTermData {
  mostUsedWords: Array<string>;
  daysToWatch: number;
  videos: Array<VideoItem>;
}

interface YoutubeDataAPIServiceInterface {
  searchByTerm(
    searchTerm: string,
    minutesAvailableWeek: string
  ): Promise<SearchTermData>;
}

const YoutubeDataAPIService = (): YoutubeDataAPIServiceInterface => {
  const BASE_URL = "http://localhost:3333";

  const searchByTerm = async (
    term: string,
    minutesAvailableWeek: string
  ): Promise<SearchTermData> => {
    const response = await axios.get(BASE_URL + "/search/term", {
      params: { term, minutesAvailableWeek }
    });

    return response.data;
  };

  return { searchByTerm };
};

export { YoutubeDataAPIService };
